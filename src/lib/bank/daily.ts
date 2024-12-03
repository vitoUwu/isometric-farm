import { ref as dailyButtonRef } from "../../components/ui/buttons/Daily";
import { GAMESTATE_KEYS } from "../constants";
import CropManager from "../crops/Manager";
import logger from "../logger";
import GameState from "../state/game";
import BankManager from "./Manager";

let _instance: Daily;

class Daily {
  private _lastClaimed: number;

  constructor() {
    if (_instance) {
      throw new Error("Attempted to create a second instance of Daily");
    }

    this._lastClaimed = GameState.loadGameState(GAMESTATE_KEYS.DAILY, 0);
    logger.debug("Daily", { lastClaimed: this._lastClaimed, isClaimable: this.isDailyClaimable() });
    this.startTimeout();
  }

  static getInstance() {
    if (!_instance) {
      _instance = new Daily();
    }
    return _instance;
  }

  public isDailyClaimable() {
    return this.getDiff() >= 86400000;
  }

  public tryClaimReward() {
    if (!this.isDailyClaimable()) {
      logger.debug("Daily is not claimable");
      return;
    }

    this._lastClaimed = Date.now();
    this.save();
    BankManager.deposit(this.reward);

    if (!dailyButtonRef.current) {
      logger.error("Daily button ref is not found");
      return;
    }

    dailyButtonRef.current.disabled = true;
    this.startTimeout();
  }

  public save() {
    logger.debug("Daily saving", { lastClaimed: this._lastClaimed });
    localStorage.setItem(GAMESTATE_KEYS.DAILY, JSON.stringify(this._lastClaimed));
  }

  private getDiff() {
    return Date.now() - this._lastClaimed;
  }

  private startTimeout() {
    if (this.isDailyClaimable()) {
      return;
    }

    logger.debug("Daily timeout started ", this.getDiff());

    setTimeout(() => {
      if (!dailyButtonRef.current) {
        logger.error("Daily button ref is not found");
        return;
      }
      dailyButtonRef.current.disabled = false;
    }, 86400000 - this.getDiff());
  }

  get reward() {
    return CropManager.cropCost() * 5;
  }
}

export default Daily.getInstance();
