import camera from "./camera.js";
import { canvas, ctx } from "./canvas.js";
import {
  GRID_SIZE,
  MATURITY_TIME,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./constants.js";
import CropManager from "./crops/Manager";
import { fromIso, getTile, toIso } from "./tiles/Manager";
import { TILE_TYPES } from "./tiles/constants";

export function updateTooltip() {
  const tooltip = document.getElementById("tooltip");
  const rect = canvas.current!.getBoundingClientRect();

  const cameraX = camera.cameraX;
  const cameraY = camera.cameraY;
  const lastMouseX = camera.lastMouseX;
  const lastMouseY = camera.lastMouseY;
  const scale = camera.scale;

  const mouseX = (lastMouseX - rect.left) / scale + cameraX;
  const mouseY = (lastMouseY - rect.top) / scale + cameraY;
  const { x, y } = fromIso(mouseX, mouseY);

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
      const tile = getTile(x, y);
      tooltip.textContent = `Tile (${x}, ${y}): ${
        tile.type === TILE_TYPES.BLOCKED ? "Blocked" : "Empty"
      }`;
    }

    ctx().save();
    ctx().scale(scale, scale);
    ctx().translate(-cameraX, -cameraY);
    const iso = toIso(x, y);
    ctx().strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx().lineWidth = 2;
    ctx().beginPath();
    ctx().moveTo(iso.x, iso.y + TILE_HEIGHT / 2);
    ctx().lineTo(iso.x + TILE_WIDTH / 2, iso.y);
    ctx().lineTo(iso.x + TILE_WIDTH, iso.y + TILE_HEIGHT / 2);
    ctx().lineTo(iso.x + TILE_WIDTH / 2, iso.y + TILE_HEIGHT);
    ctx().closePath();
    ctx().stroke();
    ctx().restore();
  } else {
    tooltip.style.display = "none";
  }
}
