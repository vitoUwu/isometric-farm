import Camera from "./camera.ts";
import Canvas from "./canvas.ts";
import GameState from "./gameState.ts";

let _instance: Events;

class Events {
  constructor() {
    if (_instance) {
      throw new Error("Events already initialized");
    }
  }

  static getInstance() {
    if (!_instance) {
      _instance = new Events();
    }
    return _instance;
  }

  setupEvents(canvas: HTMLCanvasElement) {
    console.time("Events setup");
    // Canvas Events
    canvas.addEventListener("mousedown", (e) => {
      GameState.updateMouseState(e);
      Canvas.handleTileClick(e);
    });

    canvas.addEventListener("mouseup", (e) => {
      GameState.resetMouseState();
    });

    canvas.addEventListener("wheel", (e) => {
      Camera.applyZoom(e);
    });

    canvas.addEventListener("mousemove", (e) => {
      Camera.moveCamera(e);
      GameState.handleDragState();
      Canvas.continueActionWhileMouseDown(e);
    });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Window Events
    window.addEventListener("resize", () => {
      Canvas.resizeCanvas();
    });

    // Document Events
    document.addEventListener("keydown", (e) => {
      const speed = 10;
      if (e.key === "ArrowUp") {
        Camera.cameraY -= speed;
      } else if (e.key === "ArrowDown") {
        Camera.cameraY += speed;
      } else if (e.key === "ArrowLeft") {
        Camera.cameraX -= speed;
      } else if (e.key === "ArrowRight") {
        Camera.cameraX += speed;
      }
    });
    console.timeEnd("Events setup");
  }
}

export default Events.getInstance();
