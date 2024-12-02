import { useRef } from "jsx-dom";
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
import { drawTile, fromIso, getTile, toIso } from "./tiles/Manager.ts";

export const canvas = useRef<HTMLCanvasElement>(null);

let _ctx: CanvasRenderingContext2D | null = null;
export const ctx = () => _ctx ?? (_ctx = canvas.current?.getContext("2d"));

export function setupCanvas() {
  if (!canvas.current) throw new Error("Canvas not found");

  canvas.current.width = window.innerWidth;
  canvas.current.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.current!.width = window.innerWidth;
    canvas.current!.height = window.innerHeight;
  });

  canvas.current!.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  canvas.current!.addEventListener("mousedown", (e) => {
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
      const { x, y } = fromIso(mouseX, mouseY);

      const tile = getTile(x, y);

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
  });

  canvas.current!.addEventListener("mousemove", (e) => {
    camera.mouseMove(e);

    if (e.button === MOUSE_BUTTONS.left) {
      const scale = camera.scale;
      const cameraX = camera.cameraX;
      const cameraY = camera.cameraY;

      const rect = canvas.current!.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / scale + cameraX;
      const mouseY = (e.clientY - rect.top) / scale + cameraY;
      const { x, y } = fromIso(mouseX, mouseY);

      if (gameState.action === ACTIONS.PLANTING) {
        CropManager.plant(x, y);
      } else if (gameState.action === ACTIONS.HARVESTING) {
        CropManager.harvest(x, y);
      }
    }
  });

  canvas.current!.addEventListener("mouseup", (e) => {
    camera.mouseUp();
    gameState.action = null;
  });

  canvas.current!.addEventListener("wheel", (e) => {
    camera.wheel(e);
  });

  document.addEventListener("keydown", (e) => {
    const speed = 10;
    if (e.key === "ArrowUp") {
      camera.cameraY -= speed;
    } else if (e.key === "ArrowDown") {
      camera.cameraY += speed;
    } else if (e.key === "ArrowLeft") {
      camera.cameraX -= speed;
    } else if (e.key === "ArrowRight") {
      camera.cameraX += speed;
    }
  });
}

export function drawGrid() {
  const scale = camera.scale;
  const cameraX = camera.cameraX;
  const cameraY = camera.cameraY;

  ctx().save();
  ctx().scale(scale, scale);
  ctx().translate(-cameraX, -cameraY);

  if (imageLoader.get("/assets/images/grass.png")) {
    const patternCanvas = document.createElement("canvas");
    const patternContext = patternCanvas.getContext("2d");
    patternCanvas.width = TILE_WIDTH;
    patternCanvas.height = TILE_HEIGHT;

    for (let i = -1; i < 3; i++) {
      for (let j = -1; j < 3; j++) {
        const iso = toIso(i, j);
        drawTile(patternContext, iso.x, iso.y, TILES.grass);
      }
    }

    const grassPattern = ctx().createPattern(patternCanvas, "repeat");
    ctx().fillStyle = grassPattern;
    ctx().fillRect(
      cameraX,
      cameraY,
      canvas.current!.width / scale,
      canvas.current!.height / scale,
    );
  }

  ctx().strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx().lineWidth = 1;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const iso = toIso(x, y);
      const level = gameState.tilesLevel + 2;
      const isBlocked = level <= x || level <= y;
      drawTile(ctx(), iso.x, iso.y, isBlocked ? TILES.blocked : TILES.dirt);
    }
  }

  for (const crop of CropManager.crops) {
    drawTile(
      ctx(),
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
      ctx().fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx().fillRect(
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

  ctx().restore();
}
