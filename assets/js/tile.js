import { GRID_SIZE, TILE_HEIGHT, TILE_WIDTH } from "./constants.js";
import gameState from "./gameState.js";
import imageLoader from "./imageLoader.js";

/**
 * @typedef {Object} Tile
 * @property {string} color
 * @property {string} path
 * @property {string} type
 */

export const TILE_TYPES = {
  DIRT: "dirt",
  SEED: "seed",
  MATURE: "mature",
  GRASS: "grass",
  BLOCKED: "blocked",
};

export const TILES = {
  blocked: {
    color: "#63300b",
    type: TILE_TYPES.BLOCKED,
    path: "/assets/images/blocked_tile.png",
  },
  dirt: {
    color: "#8B4513",
    type: TILE_TYPES.DIRT,
    path: "/assets/images/dirt.png",
  },
  seedling: {
    color: "#00FF00",
    type: TILE_TYPES.SEED,
    path: "/assets/images/crop.png",
  },
  mature: {
    color: "#FFFF00",
    type: TILE_TYPES.MATURE,
    path: "/assets/images/mature.png",
  },
  grass: {
    color: "#90EE90",
    type: TILE_TYPES.GRASS,
    path: "/assets/images/grass.png",
  },
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number, y: number }}
 */
export function fromIso(x, y) {
  const offsetX = x - TILE_WIDTH / 2;
  const isoX = offsetX / TILE_WIDTH + y / TILE_HEIGHT;
  const isoY = y / TILE_HEIGHT - offsetX / TILE_WIDTH;

  const tileX = Math.floor(isoX);
  const tileY = Math.floor(isoY);

  return { x: tileX, y: tileY };
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number, y: number }}
 */
export function toIso(x, y) {
  return {
    x: ((x - y) * TILE_WIDTH) / 2,
    y: ((x + y) * TILE_HEIGHT) / 2,
  };
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {Tile}
 */
export function getTile(x, y) {
  if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) {
    return TILES.grass;
  }

  const crop = gameState.crops.find((crop) => crop.x === x && crop.y === y);
  if (crop?.mature) {
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

export function hasMatureCrop() {
  return getMatureCrop() !== undefined;
}

export function getMatureCrop() {
  return gameState.crops.find((crop) => crop.mature);
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {Tile} tile
 */
export function drawTile(ctx, x, y, tile) {
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
