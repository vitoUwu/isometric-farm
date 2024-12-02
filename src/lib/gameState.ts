import { DELETE_KEYS, GAMESTATE_KEYS } from "./constants.ts";
import logger from "./logger.ts";
import { throttle } from "./utils.ts";

let _instance: GameState;

class GameState {
  private _action: "planting" | "harvesting" | null = null;
  private _isDragging: boolean = false;
  private _lastMouseX: number = 0;
  private _lastMouseY: number = 0;
  private _buttonDown: number | null = null;

  // LOAD AND SAVE MODULES
  private _importedModulesCache: Record<string, { save: () => void }> = {};
  private _saveGameState = throttle(async () => {
    logger.time("Saving state");

    // avoid circular dependency
    if (!this._importedModulesCache.TilesManager) {
      const { default: TilesManager } = await import("./tiles/Manager.ts");
      const { default: StorageManager } = await import("./storage/Manager.ts");
      const { default: CropManager } = await import("./crops/Manager.ts");
      const { default: BankManager } = await import("./bank/Manager.ts");
      const { default: Camera } = await import("./camera.ts");
      this._importedModulesCache = {
        TilesManager,
        StorageManager,
        CropManager,
        BankManager,
        Camera,
      };
    }

    const { StorageManager, CropManager, BankManager, Camera, TilesManager } =
      this._importedModulesCache;

    StorageManager.save();
    CropManager.save();
    BankManager.save();
    TilesManager.save();
    Camera.save();

    for (const key of Object.values(DELETE_KEYS)) {
      localStorage.removeItem(key);
    }
    logger.timeEnd("Saving state");
  }, 1000);

  constructor() {
    if (_instance) {
      throw new Error("GameState already initialized");
    }
  }

  static getInstance() {
    logger.time("GameState.getInstance");
    if (!_instance) {
      _instance = new GameState();
    }
    logger.timeEnd("GameState.getInstance");
    return _instance;
  }

  get action() {
    return this._action;
  }

  set action(value) {
    if (value !== null && value !== "planting" && value !== "harvesting") {
      throw new Error("Invalid action");
    }

    this._action = value;
  }

  get isDragging() {
    return this._isDragging;
  }

  set isDragging(value: boolean) {
    this._isDragging = value;
  }

  get lastMouseX() {
    return this._lastMouseX;
  }

  set lastMouseX(value: number) {
    this._lastMouseX = value;
  }

  get lastMouseY() {
    return this._lastMouseY;
  }

  set lastMouseY(value: number) {
    this._lastMouseY = value;
  }

  get buttonDown() {
    return this._buttonDown;
  }

  set buttonDown(value: number | null) {
    this._buttonDown = value;
  }

  get saveGameState() {
    return this._saveGameState;
  }

  loadGameState<T>(
    key: (typeof GAMESTATE_KEYS)[keyof typeof GAMESTATE_KEYS],
    defaultValue?: T,
    validator?: (value: unknown) => boolean,
  ): T | undefined {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (typeof value === "undefined" || value === null) {
        return defaultValue;
      }

      if (validator && !validator(value)) {
        logger.error(`Invalid value for key: ${key}`);
        return defaultValue;
      }

      return value;
    } catch (error) {
      logger.error(`Error loading game state for key: ${key}`, error);
      return defaultValue;
    }
  }

  // EVENT HANDLERS
  resetMouseState() {
    this.isDragging = false;
    this.buttonDown = null;
  }

  updateMouseState(e: MouseEvent) {
    this.buttonDown = e.button;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  handleDragState() {
    if (typeof this.buttonDown === "number") {
      this.isDragging = true;
    }
  }
}

export default GameState.getInstance();
