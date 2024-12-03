import { renderModal } from "../../components/modals";
import NotEnoughCash from "../../components/modals/Upgrades/NotEnoughCash";
import StorageLevelUpgraded from "../../components/modals/Upgrades/StorageLevelUpgraded";
import BankManager from "../bank/Manager";
import { GAMESTATE_KEYS } from "../constants";
import GameState from "../state/game";
import { Item } from "../Item";
import logger from "../logger";

interface InventoryItem {
  data: Item;
  quantity: number;
}

interface InventoryObject {
  level: number;
  items: Record<string, InventoryItem>;
}

let _instance: InventoryManager;

class InventoryManager {
  private _inventory: InventoryObject;
  private static MAX_LEVEL = 27;

  constructor() {
    if (_instance) {
      throw new Error(
        "Attempted to create a second instance of InventoryManager",
      );
    }
    this._inventory = GameState.loadGameState(GAMESTATE_KEYS.INVENTORY, {
      level: 1,
      items: {},
    });
    logger.debug(`Loaded inventory`);
    logger.debug(this._inventory);
  }

  get capacityDisplay() {
    return document.getElementById("storage-display");
  }

  private calculateCapacity(level?: number) {
    level = level ?? this._inventory.level;
    return level * 10;
  }

  get capacity() {
    return this.calculateCapacity();
  }

  updateCapacityDisplay() {
    const display = this.capacityDisplay;
    if (!display) {
      return logger.error("Inventory capacity display not found");
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
    logger.time("InventoryManager.getInstance");
    if (!_instance) {
      _instance = new InventoryManager();
    }
    logger.timeEnd("InventoryManager.getInstance");
    return _instance;
  }

  save(): void {
    logger.debug(`Saving inventory`);
    logger.debug(this._inventory);
    localStorage.setItem(
      GAMESTATE_KEYS.INVENTORY,
      JSON.stringify(this._inventory),
    );
    this.updateCapacityDisplay();
  }

  getItem(id: string): InventoryItem | undefined {
    return this._inventory.items[id];
  }

  hasItem(id: string): boolean {
    return !!this._inventory.items[id];
  }

  getTotalStoredItems(): number {
    return Object.values(this._inventory.items).reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  }

  willFit(arg: number | InventoryItem): boolean {
    const quantity = typeof arg === "number" ? arg : arg.quantity;
    return this.getTotalStoredItems() + quantity <= this.capacity;
  }

  storeItem(item: InventoryItem) {
    if (!this.willFit(item)) {
      return logger.error(`Item ${item.data.id} will not fit in storage`);
    }

    logger.debug(`Storing item ${item.data.id} with quantity ${item.quantity}`);
    logger.debug(this._inventory);

    if (this.hasItem(item.data.id)) {
      logger.debug(`Item ${item.data.id} already exists, adding quantity`);
      this._inventory.items[item.data.id].quantity += item.quantity;
      this.updateCapacityDisplay();
      this.save();
      return;
    }

    logger.debug(`Item ${item.data.id} does not exist, adding new item`);
    this._inventory.items[item.data.id] = item;
    this.updateCapacityDisplay();
    this.save();
  }

  removeItem(id: string, quantity: number) {
    if (!this.hasItem(id)) {
      return logger.error(`Item ${id} not found in storage`);
    }

    this._inventory.items[id].quantity -= quantity;

    if (this._inventory.items[id].quantity <= 0) {
      delete this._inventory.items[id];
    }

    this.updateCapacityDisplay();
  }

  getAllItems(): InventoryItem[] {
    return Object.values(this._inventory.items);
  }

  // UPGRADES

  upgradeCost(level?: number) {
    level = level ?? this._inventory.level;
    return level * 1000;
  }

  upgrade() {
    if (BankManager.balance < this.upgradeCost()) {
      return renderModal(NotEnoughCash());
    }

    BankManager.withdraw(this.upgradeCost());
    this._inventory.level++;
    this.save();

    renderModal(StorageLevelUpgraded());
  }

  get level() {
    return this._inventory.level;
  }

  nextLevelCapacity() {
    return this.calculateCapacity(this._inventory.level + 1);
  }

  isMaxed() {
    return this.level >= InventoryManager.MAX_LEVEL;
  }
}

export default InventoryManager.getInstance();
