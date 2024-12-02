import { closeModal, renderModal } from "../components/modals/index.tsx";
import NotEnoughCash from "../components/modals/Upgrades/NotEnoughCash.tsx";
import BankManager from "./bank/Manager.ts";
import camera from "./camera.ts";
import { DELETE_KEYS, GAMESTATE_KEYS } from "./constants.ts";
import CropManager from "./crops/Manager.ts";
import StorageManager from "./storage/Manager.ts";
import { throttle } from "./utils.ts";

class GameState {
  private _tilesLevel: number = loadGameState(GAMESTATE_KEYS.TILES_LEVEL, 1);
  private _autoHarvestLevel: number = loadGameState(
    GAMESTATE_KEYS.AUTO_HARVEST_LEVEL,
    0,
  );
  private _autoSeederLevel: number = loadGameState(
    GAMESTATE_KEYS.AUTO_SEEDER_LEVEL,
    0,
  );
  private _action: "planting" | "harvesting" | null = null;

  get action() {
    return this._action;
  }

  set action(value) {
    if (value !== null && value !== "planting" && value !== "harvesting") {
      throw new Error("Invalid action");
    }

    this._action = value;
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

  get tileLevelUpgradePrice() {
    return this.tilesLevel * 1000;
  }

  upgradeFieldLevel() {
    if (BankManager.balance >= this.tileLevelUpgradePrice) {
      BankManager.withdraw(this.tileLevelUpgradePrice);
      this.tilesLevel++;
      closeModal();
    } else {
      renderModal(NotEnoughCash());
    }
  }
}

const gameState = new GameState();
// window.gameState = gameState;

export function loadGameState<T>(
  key: (typeof GAMESTATE_KEYS)[keyof typeof GAMESTATE_KEYS],
  defaultValue?: T,
): T | undefined {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
  } catch (error) {
    console.error(`Error loading game state for key: ${key}`, error);
    return defaultValue;
  }
}

const saveGameState = throttle(() => {
  console.time("Saving state");
  StorageManager.save();
  CropManager.save();
  BankManager.save();
  localStorage.setItem(GAMESTATE_KEYS.CAMERA_X, JSON.stringify(camera.cameraX));
  localStorage.setItem(GAMESTATE_KEYS.CAMERA_Y, JSON.stringify(camera.cameraY));
  localStorage.setItem(GAMESTATE_KEYS.SCALE, JSON.stringify(camera.scale));
  localStorage.setItem(
    GAMESTATE_KEYS.TILES_LEVEL,
    JSON.stringify(gameState.tilesLevel),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.AUTO_HARVEST_LEVEL,
    JSON.stringify(gameState.autoHarvestLevel),
  );
  localStorage.setItem(
    GAMESTATE_KEYS.AUTO_SEEDER_LEVEL,
    JSON.stringify(gameState.autoSeederLevel),
  );

  for (const key of Object.values(DELETE_KEYS)) {
    localStorage.removeItem(key);
  }
  console.timeEnd("Saving state");
}, 1000);

export default gameState;
