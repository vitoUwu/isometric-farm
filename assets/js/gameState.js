import camera from "./camera.js";
import { GAMESTATE_KEYS } from "./constants.js";
import { throttle } from "./utils.js";

/**
 * @typedef {Object} Crop
 * @property {number} x
 * @property {number} y
 * @property {number} isoY
 * @property {number} isoX
 * @property {boolean} mature
 * @property {number} plantTime
 */

class GameState {
  /** @type {number} */
  _cash = loadGameState(GAMESTATE_KEYS.CASH) ?? 1000;
  _storage = loadGameState(GAMESTATE_KEYS.STORAGE) || [];
  /** @type {number} */
  _maxStorageCapacity =
    loadGameState(GAMESTATE_KEYS.MAX_STORAGE_CAPACITY) || 10;
  /** @type {Crop[]} */
  _crops = loadGameState(GAMESTATE_KEYS.CROPS) || [];
  /** @type {number} */
  _cropCost = loadGameState(GAMESTATE_KEYS.CROP_COST) || 100;
  /** @type {number} */
  _cropSellPrice = loadGameState(GAMESTATE_KEYS.CROP_SELL_PRICE) || 150;
  /** @type {number} */
  _tilesLevel = loadGameState(GAMESTATE_KEYS.TILES_LEVEL) || 1;
  /** @type {number} */
  _autoHarvestLevel = loadGameState(GAMESTATE_KEYS.AUTO_HARVEST_LEVEL) || 0;
  /** @type {number} */
  _autoSeederLevel = loadGameState(GAMESTATE_KEYS.AUTO_SEEDER_LEVEL) || 0;
  /**
   * @type {null|"planting"|"harvesting"}
   */
  _action = null;

  get action() {
    return this._action;
  }

  set action(value) {
    if (value !== null && value !== "planting" && value !== "harvesting") {
      throw new Error("Invalid action");
    }

    this._action = value;
  }

  get cash() {
    return this._cash;
  }

  set cash(value) {
    this._cash = value;
  }

  get storage() {
    return this._storage;
  }

  set storage(value) {
    this._storage = value;
  }

  get maxStorageCapacity() {
    return this._maxStorageCapacity;
  }

  set maxStorageCapacity(value) {
    this._maxStorageCapacity = value;
  }

  /**
   * @return {Crop[]}
   */
  get crops() {
    return this._crops;
  }

  set crops(value) {
    this._crops = value;
  }

  get cropCost() {
    return this._cropCost;
  }

  set cropCost(value) {
    this._cropCost = value;
  }

  get cropSellPrice() {
    return this._cropSellPrice;
  }

  set cropSellPrice(value) {
    this._cropSellPrice = value;
  }

  get tilesLevel() {
    return this._tilesLevel;
  }

  set tilesLevel(value) {
    this._tilesLevel = value;
  }

  get autoHarvestLevel() {
    return this._autoHarvestLevel;
  }

  set autoHarvestLevel(value) {
    this._autoHarvestLevel = value;
  }

  get autoSeederLevel() {
    return this._autoSeederLevel;
  }

  set autoSeederLevel(value) {
    this._autoSeederLevel = value;
  }

  get saveGameState() {
    return saveGameState;
  }
}

const gameState = new GameState();

/**
 * @param {keyof typoef GAMESTATE_KEYS} key
 */
export function loadGameState(key) {
  return JSON.parse(localStorage.getItem(key));
}

const saveGameState = throttle(() => {
  console.time("Saving state");
  localStorage.setItem(GAMESTATE_KEYS.CASH, JSON.stringify(gameState.cash));
  localStorage.setItem(
    GAMESTATE_KEYS.STORAGE,
    JSON.stringify(gameState.storage),
  );
  localStorage.setItem(GAMESTATE_KEYS.CAMERA_X, JSON.stringify(camera.cameraX));
  localStorage.setItem(GAMESTATE_KEYS.CAMERA_Y, JSON.stringify(camera.cameraY));
  localStorage.setItem(GAMESTATE_KEYS.SCALE, JSON.stringify(camera.scale));
  localStorage.setItem(
    GAMESTATE_KEYS.MAX_STORAGE_CAPACITY,
    JSON.stringify(gameState.maxStorageCapacity),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.CROP_COST,
    JSON.stringify(gameState.cropCost),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.CROP_SELL_PRICE,
    JSON.stringify(gameState.cropSellPrice),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.TILES_LEVEL,
    JSON.stringify(gameState.tilesLevel),
  );
  localStorage.setItem(GAMESTATE_KEYS.CROPS, JSON.stringify(gameState.crops));
  localStorage.setItem(
    GAMESTATE_KEYS.AUTO_HARVEST_LEVEL,
    JSON.stringify(gameState.autoHarvestLevel),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.AUTO_SEEDER_LEVEL,
    JSON.stringify(gameState.autoSeederLevel),
  );
  console.timeEnd("Saving state");
}, 1000);

export default gameState;
