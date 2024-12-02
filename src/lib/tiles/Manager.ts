import NotEnoughCash from "../../components/modals/Upgrades/NotEnoughCash.tsx";
import { closeModal, renderModal } from "../../components/modals/index.tsx";
import BankManager from "../bank/Manager.ts";
import { GAMESTATE_KEYS, GRID_SIZE } from "../constants.ts";
import CropManager from "../crops/Manager.ts";
import GameState from "../gameState.ts";
import logger from "../logger.ts";
import { TILES } from "./constants.ts";

export type Tile = {
  color: string;
  path: string;
  type: string;
};

interface Data {
  fieldLevel: number;
}

let _instance: TileManager;

class TileManager {
  private _data: Data;

  constructor() {
    if (_instance) {
      throw new Error("Attempted to create a second instance of TileManager");
    }

    this._data = GameState.loadGameState(
      GAMESTATE_KEYS.TILES,
      {
        fieldLevel: 1,
      },
      (value) =>
        typeof value === "object" && !Array.isArray(value) &&
        "fieldLevel" in value && typeof value.fieldLevel === "number",
    );
  }

  static getInstance() {
    logger.time("TileManager.getInstance");
    if (!_instance) {
      _instance = new TileManager();
    }
    logger.timeEnd("TileManager.getInstance");
    return _instance;
  }

  save() {
    localStorage.setItem(GAMESTATE_KEYS.TILES, JSON.stringify(this._data));
  }

  getTile(x: number, y: number) {
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) {
      return TILES.grass;
    }

    const crop = CropManager.findCrop(x, y);
    if (crop) {
      return crop.isReadyToHarvest ? TILES.mature : TILES.seedling;
    }

    const level = 2 + this._data.fieldLevel;
    return level <= x || level <= y ? TILES.blocked : TILES.dirt;
  }

  findDirtTile() {
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (this.getTile(x, y) === TILES.dirt) return { x, y };
      }
    }
  }

  get level() {
    return this._data.fieldLevel;
  }

  upgradeFieldLevel() {
    const price = this.tileLevelUpgradePrice();
    if (BankManager.balance >= price) {
      BankManager.withdraw(price);
      this._data.fieldLevel++;
      closeModal();
    } else {
      renderModal(NotEnoughCash());
    }

    this.save();
    BankManager.save();
  }

  tileLevelUpgradePrice() {
    return this._data.fieldLevel * 1000;
  }
}

export default TileManager.getInstance();
