import Camera from "./camera.ts";
import Canvas from "./canvas.ts";
import GameState from "./state/game.ts";
import logger from "./logger.ts";

let _instance: Events;

class Events {
  private konamiCode: string[] = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  private konamiIndex: number = 0;

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
    logger.time("Events setup");
    // Canvas Events
    canvas.addEventListener("mousedown", (e) => {
      GameState.updateMouseState(e);
      Canvas.handleTileClick(e);
    });

    canvas.addEventListener("mouseup", (e) => {
      GameState.resetMouseState();
    });

    window.addEventListener("mouseup", () => {
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

      // Verificar código Konami
      if (
        e.key.toLowerCase() === this.konamiCode[this.konamiIndex].toLowerCase()
      ) {
        this.konamiIndex++;

        if (this.konamiIndex === this.konamiCode.length) {
          localStorage.setItem("dev", "true");
          localStorage.setItem("debug", "true");
          window.location.reload();
        }
      } else {
        this.konamiIndex = 0;
      }
    });
    logger.timeEnd("Events setup");
  }
}

export default Events.getInstance();
