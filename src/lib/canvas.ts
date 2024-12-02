import { renderModal } from "../components/modals/index.tsx";
import FieldLevel from "../components/modals/Upgrades/FieldLevel.tsx";
import camera from "./camera.ts";
import {
  ACTIONS,
  GRID_SIZE,
  MATURITY_TIME,
  MOUSE_BUTTONS,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./constants.ts";
import CropManager from "./crops/Manager.ts";
import gameState from "./gameState.ts";
import imageLoader from "./ImageLoader.ts";
// import { getRobotById } from "./robots/index.js";
// import { USER_ID } from "./robots/user.js";
import { TILE_TYPES, TILES } from "./tiles/constants.ts";
import TileManager, { Tile } from "./tiles/Manager.ts";

let _instance: Canvas;

class Canvas {
  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (_instance) {
      throw new Error("Canvas already initialized");
    }
  }

  static getInstance() {
    console.time("Canvas.getInstance");
    if (!_instance) {
      _instance = new Canvas();
    }
    console.timeEnd("Canvas.getInstance");
    return _instance;
  }

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._ctx;
  }

  setupCanvas(value: HTMLCanvasElement) {
    console.time("Canvas.setupCanvas");
    this._canvas = value;
    this._ctx = value.getContext("2d");

    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    window.removeEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);

    value.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    value.addEventListener("mousedown", (e) => this.onMouseDown(e));
    value.addEventListener("mousemove", (e) => this.onMouseMove(e));
    value.addEventListener("mouseup", () => this.onMouseUp());
    value.addEventListener("wheel", (e) => this.onWheel(e));
    console.timeEnd("Canvas.setupCanvas");
  }

  drawTile(x: number, y: number, tile: Tile, _ctx?: CanvasRenderingContext2D) {
    const ctx = _ctx || this._ctx;
    if (!ctx) {
      throw new Error(
        "Canvas context not found. You forgot to set the canvas?",
      );
    }

    const image = !!tile.path && imageLoader.get(tile.path);
    if (image) {
      ctx.drawImage(image, x, y, TILE_WIDTH, TILE_HEIGHT);
    } else {
      ctx.fillStyle = tile.color;
      ctx.beginPath();
      ctx.moveTo(x, y + TILE_HEIGHT / 2);
      ctx.lineTo(x + TILE_WIDTH / 2, y);
      ctx.lineTo(x + TILE_WIDTH, y + TILE_HEIGHT / 2);
      ctx.lineTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  drawGrid() {
    if (!this._ctx) {
      throw new Error(
        "Canvas context not found. You forgot to set the canvas?",
      );
    }

    const scale = camera.scale;
    const cameraX = camera.cameraX;
    const cameraY = camera.cameraY;

    this._ctx.save();
    this._ctx.scale(scale, scale);
    this._ctx.translate(-cameraX, -cameraY);

    if (imageLoader.get("/assets/images/grass.png")) {
      const patternCanvas = document.createElement("canvas");
      const patternContext = patternCanvas.getContext("2d");
      patternCanvas.width = TILE_WIDTH;
      patternCanvas.height = TILE_HEIGHT;

      for (let i = -1; i < 3; i++) {
        for (let j = -1; j < 3; j++) {
          const iso = this.toIso(i, j);
          this.drawTile(iso.x, iso.y, TILES.grass, patternContext);
        }
      }

      const grassPattern = this._ctx.createPattern(patternCanvas, "repeat");
      this._ctx.fillStyle = grassPattern;
      this._ctx.fillRect(
        cameraX,
        cameraY,
        this.canvas.width / scale,
        this.canvas.height / scale,
      );
    }

    this._ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    this._ctx.lineWidth = 1;

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const iso = this.toIso(x, y);
        const level = TileManager.level + 2;
        const isBlocked = level <= x || level <= y;
        this.drawTile(iso.x, iso.y, isBlocked ? TILES.blocked : TILES.dirt);
      }
    }

    for (const crop of CropManager.crops) {
      this.drawTile(
        crop.isoX,
        crop.isoY,
        crop.isReadyToHarvest ? TILES.mature : TILES.seedling,
      );
    }

    for (const [index, crop] of CropManager.crops.entries()) {
      if (!crop.isReadyToHarvest) {
        const progress = Math.min(
          (Date.now() - crop.plantedAt) / MATURITY_TIME,
          1,
        );
        this._ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        this._ctx.fillRect(
          crop.isoX,
          crop.isoY + TILE_HEIGHT,
          TILE_WIDTH * progress,
          5,
        );

        if (progress >= 1) {
          CropManager.crops[index].isReadyToHarvest = true;
        }
      }
    }

    // for (const robot of window.robots) {
    //   robot.draw(ctx);
    // }

    this._ctx.restore();
  }

  fromIso(x: number, y: number) {
    const offsetX = x - TILE_WIDTH / 2;
    const isoX = offsetX / TILE_WIDTH + y / TILE_HEIGHT;
    const isoY = y / TILE_HEIGHT - offsetX / TILE_WIDTH;

    const tileX = Math.floor(isoX);
    const tileY = Math.floor(isoY);

    return { x: tileX, y: tileY };
  }

  toIso(x: number, y: number) {
    return {
      x: ((x - y) * TILE_WIDTH) / 2,
      y: ((x + y) * TILE_HEIGHT) / 2,
    };
  }

  // EVENT HANDLERS

  private onResize() {
    if (!this._canvas) {
      throw new Error("Canvas not found. You forgot to set the canvas?");
    }

    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  private onMouseDown(e: MouseEvent) {
    camera.mouseDown(e);

    // if (e.button === MOUSE_BUTTONS.right) {
    //   const user = getRobotById(USER_ID);
    //   if (user) {
    //     const mouseX = camera.mouseX(e.clientX);
    //     const mouseY = camera.mouseY(e.clientY);
    //     const { x, y } = fromIso(mouseX, mouseY);

    //     user.goto(x, y);
    //   }
    // } else
    if (e.button === MOUSE_BUTTONS.left) {
      const mouseX = camera.mouseX(e.clientX);
      const mouseY = camera.mouseY(e.clientY);
      const { x, y } = this.fromIso(mouseX, mouseY);

      const tile = TileManager.getTile(x, y);

      switch (tile.type) {
        case TILE_TYPES.BLOCKED:
          renderModal(FieldLevel());
          break;
        case TILE_TYPES.DIRT:
          gameState.action = ACTIONS.PLANTING;
          CropManager.plant(x, y);
          break;
        case TILE_TYPES.MATURE:
          gameState.action = ACTIONS.HARVESTING;
          CropManager.harvest(x, y);
          break;
        default:
          break;
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this._canvas) {
      throw new Error("Canvas not found. You forgot to set the canvas?");
    }

    camera.mouseMove(e);

    if (e.button === MOUSE_BUTTONS.left) {
      const scale = camera.scale;
      const cameraX = camera.cameraX;
      const cameraY = camera.cameraY;

      const rect = this._canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / scale + cameraX;
      const mouseY = (e.clientY - rect.top) / scale + cameraY;
      const { x, y } = this.fromIso(mouseX, mouseY);

      if (gameState.action === ACTIONS.PLANTING) {
        CropManager.plant(x, y);
      } else if (gameState.action === ACTIONS.HARVESTING) {
        CropManager.harvest(x, y);
      }
    }
  }

  private onMouseUp() {
    camera.mouseUp();
    gameState.action = null;
  }

  private onWheel(e: WheelEvent) {
    camera.wheel(e);
  }
}

export default Canvas.getInstance();
