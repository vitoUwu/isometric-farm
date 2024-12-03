export const GAMESTATE_KEYS = {
  CROPS: "crops",
  STORAGE: "storage",
  BANK: "bank",
  TILES: "tiles",
  AUTO_HARVEST_LEVEL: "autoHarvestLevel",
  AUTO_SEEDER_LEVEL: "autoSeederLevel",
  CAMERA: "camera",
  VERSION: "version",
} as const;

export const DELETE_KEYS = {
  CAMERA_X: "cameraX",
  CAMERA_Y: "cameraY",
  SCALE: "scale",
  CASH: "cash",
  CROP_LEVEL: "cropLevel",
  TILES_LEVEL: "tilesLevel",
  MAX_STORAGE_CAPACITY: "maxStorageCapacity",
  CROP_COST: "cropCost",
  CROP_SELL_PRICE: "cropSellPrice",
} as const;

export const MOUSE_BUTTONS = {
  left: 0,
  middle: 1,
  right: 2,
};

export const ACTIONS = {
  PLANTING: "planting",
  HARVESTING: "harvesting",
} as const;

export const VERSION = "1.0.0";
export const MIGRATION_FLOW = {
  undefined: "1.0.0", // Is this a good practice? 😂
} as const;

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const GRID_SIZE = 16;
export const MATURITY_TIME = 10000;
export const ROBOT_WIDTH = 64;
export const ROBOT_HEIGHT = 64;
