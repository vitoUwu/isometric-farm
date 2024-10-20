import camera from "./camera.js";
import {
  ACTIONS,
  GRID_SIZE,
  MATURITY_TIME,
  MOUSE_BUTTONS,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./constants.js";
import { canHarvest, canSeed, harvest, plant } from "./crop.js";
import gameState from "./gameState.js";
import imageLoader from "./imageLoader.js";
import { showModal } from "./modal.js";
import { getRobotById } from "./robots/index.js";
import { USER_ID } from "./robots/user.js";
import {
  TILES,
  TILE_TYPES,
  drawTile,
  fromIso,
  getTile,
  toIso,
} from "./tile.js";

/** @type {HTMLCanvasElement} */
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

canvas.addEventListener("mousedown", (e) => {
  camera.mouseDown(e);

  if (e.button === MOUSE_BUTTONS.right) {
    const user = getRobotById(USER_ID);
    if (user) {
      const mouseX = camera.mouseX(e.clientX);
      const mouseY = camera.mouseY(e.clientY);
      const { x, y } = fromIso(mouseX, mouseY);

      user.goto(x, y);
    }
  } else if (e.button === MOUSE_BUTTONS.left) {
    const mouseX = camera.mouseX(e.clientX);
    const mouseY = camera.mouseY(e.clientY);
    const { x, y } = fromIso(mouseX, mouseY);

    const tile = getTile(x, y);

    switch (tile.type) {
      case TILE_TYPES.BLOCKED:
        showModal(`
          <h2>Upgrade Field Level</h2>
          <p>Your current field level is ${gameState.tilesLevel}x${gameState.tilesLevel}.</p>
          <p>You can upgrade to a ${gameState.tilesLevel + 1}x${gameState.tilesLevel + 1} field level by spending $${/*getTileLevelUpgradePrice()*/ "0"}.</p>
          <button class="success" onclick="upgradeFieldLevel()">Upgrade</button>
        `);
        break;
      case TILE_TYPES.DIRT:
        gameState.action = ACTIONS.PLANTING;
        plant(x, y);
        break;
      case TILE_TYPES.MATURE:
        gameState.action = ACTIONS.HARVESTING;
        harvest(x, y);
        break;
      default:
        break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  camera.mouseMove(e);

  if (e.button === MOUSE_BUTTONS.left) {
    const scale = camera.scale;
    const cameraX = camera.cameraX;
    const cameraY = camera.cameraY;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale + cameraX;
    const mouseY = (e.clientY - rect.top) / scale + cameraY;
    const { x, y } = fromIso(mouseX, mouseY);
    const tile = getTile(x, y);

    if (
      gameState.action === ACTIONS.PLANTING &&
      canSeed() &&
      tile.type === TILE_TYPES.DIRT
    ) {
      plant(x, y);
    } else if (
      gameState.action === ACTIONS.HARVESTING &&
      canHarvest() &&
      tile.type === TILE_TYPES.MATURE
    ) {
      harvest(x, y);
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  camera.mouseUp(e);
  gameState.action = null;
});

canvas.addEventListener("wheel", (e) => {
  camera.wheel(e);
});

export function drawGrid() {
  const scale = camera.scale;
  const cameraX = camera.cameraX;
  const cameraY = camera.cameraY;

  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-cameraX, -cameraY);

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

    const grassPattern = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillStyle = grassPattern;
    ctx.fillRect(cameraX, cameraY, canvas.width / scale, canvas.height / scale);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const iso = toIso(x, y);
      const level = gameState.tilesLevel + 2;
      const isBlocked = level <= x || level <= y;
      drawTile(ctx, iso.x, iso.y, isBlocked ? TILES.blocked : TILES.dirt);
    }
  }

  for (const crop of gameState.crops) {
    drawTile(
      ctx,
      crop.isoX,
      crop.isoY,
      crop.mature ? TILES.mature : TILES.seedling,
    );
  }

  for (const [index, crop] of gameState.crops.entries()) {
    if (!crop.mature) {
      const progress = Math.min(
        (Date.now() - crop.plantTime) / MATURITY_TIME,
        1,
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(
        crop.isoX,
        crop.isoY + TILE_HEIGHT,
        TILE_WIDTH * progress,
        5,
      );

      if (progress >= 1) {
        gameState.crops[index].mature = true;
      }
    }
  }

  for (const robot of window.robots) {
    robot.draw(ctx);
  }

  ctx.restore();
}
