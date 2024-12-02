import { renderModal } from "../../components/modals";
import CropLevelUpgraded from "../../components/modals/Crops/CropLevelUpgraded";
import SoldCrops from "../../components/modals/Crops/SoldCrops";
import StorageFull from "../../components/modals/Crops/StorageFull";
import NotEnoughCash from "../../components/modals/Upgrades/NotEnoughCash";
import BankManager from "../bank/Manager";
import Canvas from "../canvas";
import { GAMESTATE_KEYS } from "../constants";
import GameState from "../gameState";
import { Item, ItemType } from "../Item";
import logger from "../logger";
import StorageManager from "../storage/Manager";
import { TILE_TYPES } from "../tiles/constants";
import TileManager from "../tiles/Manager";

interface Crop {
  x: number;
  y: number;
  isoX: number;
  isoY: number;
  isReadyToHarvest: boolean;
  drop: Item;
  plantedAt: number;
}

interface CropObject {
  crops: Crop[];
  level: number;
}

let _instance: CropManager;

class CropManager {
  private _crops: CropObject;

  constructor() {
    if (_instance) {
      throw new Error("Attempted to create a second instance of CropManager");
    }
    this._crops = GameState.loadGameState(GAMESTATE_KEYS.CROPS, {
      crops: [],
      level: 1,
    });
  }

  static getInstance() {
    logger.time("CropManager.getInstance");
    if (!_instance) {
      _instance = new CropManager();
    }
    logger.timeEnd("CropManager.getInstance");
    return _instance;
  }

  save(): void {
    localStorage.setItem(GAMESTATE_KEYS.CROPS, JSON.stringify(this._crops));
  }

  hasCropAt(x: number, y: number) {
    return !!this.findCrop(x, y);
  }

  findCrop(x: number, y: number): Crop & { index: number } | undefined {
    const index = this._crops.crops.findIndex((crop) =>
      crop.x === x && crop.y === y
    );
    if (index !== -1) {
      return {
        ...this._crops.crops[index],
        index,
      };
    }

    return undefined;
  }

  private removeCrop(index: number) {
    this._crops.crops.splice(index, 1);
  }

  cropSellingPrice(level?: number) {
    switch (level || this._crops.level) {
      case 1:
        return 150;
      case 2:
        return 300;
      case 3:
        return 550;
      default:
        return 550;
    }
  }

  plant(x: number, y: number) {
    if (
      this.canSeed() &&
      !this.hasCropAt(x, y) &&
      TileManager.getTile(x, y).type === TILE_TYPES.DIRT
    ) {
      BankManager.withdraw(this.cropCost());
      const iso = Canvas.toIso(x, y);
      this._crops.crops.push({
        x,
        y,
        isoX: iso.x,
        isoY: iso.y,
        isReadyToHarvest: false,
        drop: Item.createCrop(
          "crop",
          "Crop",
          "A crop",
          true,
          this.cropSellingPrice(),
        ),
        plantedAt: Date.now(),
      });
    }
  }

  harvest(x: number, y: number) {
    const crop = this.findCrop(x, y);

    if (!crop) {
      return;
    }

    if (!StorageManager.willFit(1)) {
      renderModal(StorageFull());
      GameState.action = null;
      return;
    }

    this.removeCrop(crop.index);

    StorageManager.storeItem({
      data: crop.drop,
      quantity: 1,
    });
  }

  setReadyToHarvest(x: number, y: number) {
    const crop = this.findCrop(x, y);
    if (crop) {
      crop.isReadyToHarvest = true;
    }
  }

  getMatureCrop(): Crop & { index: number } | undefined {
    const index = this._crops.crops.findIndex((crop) => crop.isReadyToHarvest);
    if (index !== -1) {
      return { ...this._crops.crops[index], index };
    }
    return undefined;
  }

  hasMatureCrop() {
    return this.getMatureCrop() !== undefined;
  }

  get crops() {
    return this._crops.crops;
  }

  cropCost(level?: number) {
    switch (level || this._crops.level) {
      case 1:
        return 100;
      case 2:
        return 200;
      case 3:
        return 300;
      default:
        return 300;
    }
  }

  canSeed() {
    return BankManager.balance >= this.cropCost();
  }

  upgrade() {
    const cropCost = this.cropCost();

    if (BankManager.balance < cropCost) {
      return renderModal(NotEnoughCash());
    }

    BankManager.withdraw(cropCost);
    this._crops.level++;
    this.save();

    renderModal(CropLevelUpgraded());
  }

  isMaxed() {
    return this._crops.level >= 3;
  }

  get level() {
    return this._crops.level;
  }

  sellCrops() {
    const crops = StorageManager.getAllItems().filter((item) =>
      item.data.type === ItemType.CROP
    );
    let quantity = 0;
    let price = 0;

    for (const crop of crops) {
      const _quantity = crop.quantity;
      const _price = crop.data.price * _quantity;

      quantity += _quantity;
      price += _price;

      StorageManager.removeItem(crop.data.id, _quantity);
      BankManager.deposit(_price);
    }

    StorageManager.save();
    BankManager.save();

    renderModal(SoldCrops({ quantity, price }));
  }
}

export default CropManager.getInstance();
