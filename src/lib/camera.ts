import Canvas from "./canvas.js";
import { GAMESTATE_KEYS, MOUSE_BUTTONS } from "./constants.ts";
import GameState from "./state/game.ts";

let _instance: Camera;

class Camera {
  private _cameraX: number = 0;
  private _cameraY: number = 0;
  private _scale: number = 1;

  constructor() {
    if (_instance) {
      throw new Error("Camera already initialized");
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const defaultPosition = {
      cameraX: -(screenWidth / 4),
      cameraY: -(screenHeight / 8),
      scale: screenWidth < 768 ? 1.2 : 1.5,
    };

    const data = GameState.loadGameState(GAMESTATE_KEYS.CAMERA, defaultPosition, Camera.validateState);

    this.cameraX = data.cameraX;
    this.cameraY = data.cameraY;
    this.scale = data.scale;
  }

  static getInstance() {
    if (!_instance) {
      _instance = new Camera();
    }
    return _instance;
  }

  static validateState(value: unknown) {
    return (
      typeof value === "object" &&
      "cameraX" in value &&
      "cameraY" in value &&
      "scale" in value &&
      typeof value.cameraX === "number" &&
      typeof value.cameraY === "number" &&
      typeof value.scale === "number"
    );
  }

  get cameraX() {
    return this._cameraX;
  }

  set cameraX(value) {
    this._cameraX = Math.max(-1400, Math.min(400, value));
  }

  get cameraY() {
    return Math.max(-500, Math.min(400, this._cameraY));
  }

  set cameraY(value) {
    this._cameraY = value;
  }

  get scale() {
    return Math.max(1, Math.min(3, this._scale));
  }

  set scale(value) {
    this._scale = value;
  }

  mouseX(clientX: number) {
    const scale = this._scale;
    const cameraX = this._cameraX;

    const rect = Canvas.canvas.getBoundingClientRect();
    return (clientX - rect.left) / scale + cameraX;
  }

  mouseY(clientY: number) {
    const scale = this._scale;
    const cameraY = this._cameraY;

    const rect = Canvas.canvas.getBoundingClientRect();
    return (clientY - rect.top) / scale + cameraY;
  }

  moveCamera(e: MouseEvent) {
    if (GameState.buttonDown === MOUSE_BUTTONS.middle) {
      this.cameraX += (GameState.lastMouseX - e.clientX) / this.scale;
      this.cameraY += (GameState.lastMouseY - e.clientY) / this.scale;
    }
    GameState.lastMouseX = e.clientX;
    GameState.lastMouseY = e.clientY;
  }

  applyZoom(e: WheelEvent) {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const oldScale = this.scale;

    if (e.deltaY < 0) {
      this.scale *= 1 + zoomSpeed;
    } else {
      this.scale /= 1 + zoomSpeed;
    }

    const rect = Canvas.canvas.getBoundingClientRect();
    
    const mouseXBeforeZoom = (e.clientX - rect.left) / oldScale + this.cameraX;
    const mouseYBeforeZoom = (e.clientY - rect.top) / oldScale + this.cameraY;

    const mouseXAfterZoom = (e.clientX - rect.left) / this.scale + this.cameraX;
    const mouseYAfterZoom = (e.clientY - rect.top) / this.scale + this.cameraY;

    this.cameraX += mouseXBeforeZoom - mouseXAfterZoom;
    this.cameraY += mouseYBeforeZoom - mouseYAfterZoom;
  }

  save() {
    localStorage.setItem(
      GAMESTATE_KEYS.CAMERA,
      JSON.stringify({
        cameraX: this.cameraX,
        cameraY: this.cameraY,
        scale: this.scale,
      }),
    );
  }
}

export default Camera.getInstance();
