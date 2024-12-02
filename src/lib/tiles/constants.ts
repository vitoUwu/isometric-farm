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
