import camera from "./camera.js";
import Canvas from "./canvas.js";
import {
  GRID_SIZE,
  MATURITY_TIME,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./constants.js";
import CropManager from "./crops/Manager";
import TileManager from "./tiles/Manager";
import { TILE_TYPES } from "./tiles/constants";

export function updateTooltip() {
  const tooltip = document.getElementById("tooltip");
  const rect = Canvas.canvas.getBoundingClientRect();

  const cameraX = camera.cameraX;
  const cameraY = camera.cameraY;
  const lastMouseX = camera.lastMouseX;
  const lastMouseY = camera.lastMouseY;
  const scale = camera.scale;

  const mouseX = (lastMouseX - rect.left) / scale + cameraX;
  const mouseY = (lastMouseY - rect.top) / scale + cameraY;
  const { x, y } = Canvas.fromIso(mouseX, mouseY);

  tooltip.style.display = "block";
  tooltip.style.left = `${lastMouseX + 10}px`;
  tooltip.style.top = `${lastMouseY + 10}px`;

  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    const crop = CropManager.findCrop(x, y);
    if (crop) {
      const progress = Math.min(
        (Date.now() - crop.plantedAt) / MATURITY_TIME,
        1,
      );
      const status = crop.isReadyToHarvest
        ? "Mature"
        : `Growing: ${Math.floor(progress * 100)}%`;
      tooltip.textContent = `Tile (${x}, ${y}): ${status}`;
    } else {
      const tile = TileManager.getTile(x, y);
      tooltip.textContent = `Tile (${x}, ${y}): ${
        tile.type === TILE_TYPES.BLOCKED ? "Blocked" : "Empty"
      }`;
    }

    Canvas.ctx.save();
    Canvas.ctx.scale(scale, scale);
    Canvas.ctx.translate(-cameraX, -cameraY);
    const iso = Canvas.toIso(x, y);
    Canvas.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    Canvas.ctx.lineWidth = 2;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(iso.x, iso.y + TILE_HEIGHT / 2);
    Canvas.ctx.lineTo(iso.x + TILE_WIDTH / 2, iso.y);
    Canvas.ctx.lineTo(iso.x + TILE_WIDTH, iso.y + TILE_HEIGHT / 2);
    Canvas.ctx.lineTo(iso.x + TILE_WIDTH / 2, iso.y + TILE_HEIGHT);
    Canvas.ctx.closePath();
    Canvas.ctx.stroke();
    Canvas.ctx.restore();
  } else {
    tooltip.style.display = "none";
  }
}
