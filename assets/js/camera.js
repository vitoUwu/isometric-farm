import { canvas } from "./canvas.js";
import { GAMESTATE_KEYS, MOUSE_BUTTONS } from "./constants.js";
import gameState, { loadGameState } from "./gameState.js";

class Camera {
  /**
   * @type {number}
   */
  _cameraX = loadGameState(GAMESTATE_KEYS.CAMERA_X) || 0;
  /**
   * @type {number}
   */
  _cameraY = loadGameState(GAMESTATE_KEYS.CAMERA_Y) || 0;
  /**
   * @type {number}
   */
  _scale = loadGameState(GAMESTATE_KEYS.SCALE) || 1;

  _isDragging = false;
  _lastMouseX = 0;
  _lastMouseY = 0;
  /**
   * @type {number|null}
   */
  _buttonDown = null;
  /**
   * @type {HTMLCanvasElement | null}
   */
  _canvas = null;

  get buttonDown() {
    return this._buttonDown;
  }

  set buttonDown(value) {
    this._buttonDown = value;
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

  get isDragging() {
    return this._isDragging;
  }

  set isDragging(value) {
    this._isDragging = value;
  }

  get lastMouseX() {
    return this._lastMouseX;
  }

  set lastMouseX(value) {
    this._lastMouseX = value;
  }

  get lastMouseY() {
    return this._lastMouseY;
  }

  set lastMouseY(value) {
    this._lastMouseY = value;
  }

  mouseX(clientX) {
    const scale = this._scale;
    const cameraX = this._cameraX;

    const rect = canvas.getBoundingClientRect();
    return (clientX - rect.left) / scale + cameraX;
  }

  mouseY(clientY) {
    const scale = this._scale;
    const cameraY = this._cameraY;

    const rect = canvas.getBoundingClientRect();
    return (clientY - rect.top) / scale + cameraY;
  }

  mouseUp() {
    this.isDragging = false;
    this.buttonDown = null;
    gameState.saveGameState();
  }

  /**
   *
   * @param {MouseEvent} e
   */
  mouseDown(e) {
    this.buttonDown = e.button;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  /**
   *
   * @param {MouseEvent} e
   */
  mouseMove(e) {
    if (typeof this.buttonDown === "number") {
      this.isDragging = true;
    }
    if (this.buttonDown === MOUSE_BUTTONS.middle) {
      this.cameraX += (this.lastMouseX - e.clientX) / this.scale;
      this.cameraY += (this.lastMouseY - e.clientY) / this.scale;
      console.log(`Camera position: ${this.cameraX}, ${this.cameraY}`);
    }
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  /**
   *
   * @param {WheelEvent} e
   */
  wheel(e) {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
      this.scale *= 1 + zoomSpeed;
    } else {
      this.scale /= 1 + zoomSpeed;
    }
    console.log(`Camera scale: ${this.scale}`);
  }
}

const camera = new Camera();

export default camera;
