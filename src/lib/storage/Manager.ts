import { renderModal } from "../../components/modals";
import NotEnoughCash from "../../components/modals/Upgrades/NotEnoughCash";
import StorageLevelUpgraded from "../../components/modals/Upgrades/StorageLevelUpgraded";
import BankManager from "../bank/Manager";
import { GAMESTATE_KEYS } from "../constants";
import GameState from "../gameState";
import { Item } from "../Item";
import logger from "../logger";

interface StorageItem {
  data: Item;
  quantity: number;
}

interface StorageObject {
  level: number;
  items: Record<string, StorageItem>;
}

let _instance: StorageManager;

class StorageManager {
  private _storage: StorageObject;
  private static MAX_LEVEL = 27;

  constructor() {
    if (_instance) {
      throw new Error(
        "Attempted to create a second instance of StorageManager",
      );
    }
    this._storage = GameState.loadGameState(GAMESTATE_KEYS.STORAGE, {
      level: 1,
      items: {},
    });
  }

  get capacityDisplay() {
    return document.getElementById("storage-display");
  }

  private calculateCapacity(level?: number) {
    level = level ?? this._storage.level;
    return level * 10;
  }

  get capacity() {
    return this.calculateCapacity();
  }

  updateCapacityDisplay() {
    const display = this.capacityDisplay;
    if (!display) {
      return logger.error("Storage capacity display not found");
    }

    const totalStoredItems = this.getTotalStoredItems();
    const capacity = this.capacity;
    if (totalStoredItems >= capacity) {
      display.textContent = "Full!";
    } else {
      display.textContent = `${totalStoredItems} / ${capacity}`;
    }
  }

  static getInstance() {
    logger.time("StorageManager.getInstance");
    if (!_instance) {
      _instance = new StorageManager();
    }
    logger.timeEnd("StorageManager.getInstance");
    return _instance;
  }

  save(): void {
    localStorage.setItem(GAMESTATE_KEYS.STORAGE, JSON.stringify(this._storage));
    this.updateCapacityDisplay();
  }

  getItem(id: string): StorageItem | undefined {
    return this._storage.items[id];
  }

  hasItem(id: string): boolean {
    return !!this._storage.items[id];
  }

  getTotalStoredItems(): number {
    return Object.values(this._storage.items).reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  }

  willFit(arg: number | StorageItem): boolean {
    const quantity = typeof arg === "number" ? arg : arg.quantity;
    return this.getTotalStoredItems() + quantity <= this.capacity;
  }

  storeItem(item: StorageItem) {
    if (!this.willFit(item)) {
      return logger.error(`Item ${item.data.id} will not fit in storage`);
    }

    if (this.hasItem(item.data.id)) {
      this._storage.items[item.data.id].quantity += item.quantity;
      this.updateCapacityDisplay();
      return;
    }

    this._storage.items[item.data.id] = item;
    this.updateCapacityDisplay();
  }

  removeItem(id: string, quantity: number) {
    if (!this.hasItem(id)) {
      return logger.error(`Item ${id} not found in storage`);
    }

    this._storage.items[id].quantity -= quantity;

    if (this._storage.items[id].quantity <= 0) {
      delete this._storage.items[id];
    }

    this.updateCapacityDisplay();
  }

  getAllItems(): StorageItem[] {
    return Object.values(this._storage.items);
  }

  // UPGRADES

  upgradeCost(level?: number) {
    level = level ?? this._storage.level;
    return level * 1000;
  }

  upgrade() {
    if (BankManager.balance < this.upgradeCost()) {
      return renderModal(NotEnoughCash());
    }

    BankManager.withdraw(this.upgradeCost());
    this._storage.level++;
    this.save();

    renderModal(StorageLevelUpgraded());
  }

  get level() {
    return this._storage.level;
  }

  nextLevelCapacity() {
    return this.calculateCapacity(this._storage.level + 1);
  }

  isMaxed() {
    return this.level >= StorageManager.MAX_LEVEL;
  }
}

export default StorageManager.getInstance();
