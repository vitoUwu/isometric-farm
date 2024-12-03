import { GAMESTATE_KEYS } from "../constants";
import GameState from "../state/game";
import logger from "../logger";

interface Bank {
  balance: number;
}

let _instance: BankManager;

class BankManager {
  private _bank: Bank;

  constructor() {
    if (_instance) {
      throw new Error("Attempted to create a second instance of BankManager");
    }
    this._bank = GameState.loadGameState(GAMESTATE_KEYS.BANK, {
      balance: 1000,
    });
  }

  static getInstance() {
    logger.time("BankManager.getInstance");
    if (!_instance) {
      _instance = new BankManager();
    }
    logger.timeEnd("BankManager.getInstance");
    return _instance;
  }

  get balanceDisplay() {
    return document.getElementById("cash-display");
  }

  updateBalanceDisplay() {
    const display = this.balanceDisplay;
    if (!display) {
      return logger.error("Bank balance display not found");
    }
    display.style.setProperty("--cash", this.balance.toString());
  }

  get balance() {
    return this._bank.balance;
  }

  withdraw(amount: number) {
    this._bank.balance -= amount;
    this.updateBalanceDisplay();
    this.save();
  }

  deposit(amount: number) {
    this._bank.balance += amount;
    this.updateBalanceDisplay();
    this.save();
  }

  reset() {
    this._bank.balance = 0;
    this.updateBalanceDisplay();
    this.save();
  }

  save() {
    localStorage.setItem(GAMESTATE_KEYS.BANK, JSON.stringify(this._bank));
  }
}

export default BankManager.getInstance();
