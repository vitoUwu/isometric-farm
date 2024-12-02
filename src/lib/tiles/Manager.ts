import imageLoader from "../ImageLoader.ts";
import { GRID_SIZE, TILE_HEIGHT, TILE_WIDTH } from "../constants.ts";
import CropManager from "../crops/Manager.ts";
import gameState from "../gameState.ts";
import { TILE_TYPES, TILES } from "./constants.ts";

type Tile = {
  color: string;
  path: string;
  type: string;
};

export function fromIso(x: number, y: number) {
  const offsetX = x - TILE_WIDTH / 2;
  const isoX = offsetX / TILE_WIDTH + y / TILE_HEIGHT;
  const isoY = y / TILE_HEIGHT - offsetX / TILE_WIDTH;

  const tileX = Math.floor(isoX);
  const tileY = Math.floor(isoY);

  return { x: tileX, y: tileY };
}

export function toIso(x: number, y: number) {
  return {
    x: ((x - y) * TILE_WIDTH) / 2,
    y: ((x + y) * TILE_HEIGHT) / 2,
  };
}

export function getTile(x: number, y: number) {
  if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) {
    return TILES.grass;
  }

  const crop = CropManager.findCrop(x, y);
  if (crop?.isReadyToHarvest) {
    return TILES.mature;
  }
  if (crop) {
    return TILES.seedling;
  }

  const level = 2 + gameState.tilesLevel;
  return level <= x || level <= y ? TILES.blocked : TILES.dirt;
}

export function hasDirtTiles() {
  return getDirtTile() !== undefined;
}

export function getDirtTile() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const tile = getTile(x, y);
      if (tile.type === TILE_TYPES.DIRT) {
        return tile;
      }
    }
  }
}

export function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tile: Tile,
) {
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
