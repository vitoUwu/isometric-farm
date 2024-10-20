import gameState from "./gameState.js";
import { showModal } from "./modal.js";
import { hasDirtTiles, hasMatureCrop, toIso } from "./tile.js";

export function canSeed() {
  return hasDirtTiles() && gameState.cash >= gameState.cropCost;
}

export function canHarvest() {
  return (
    hasMatureCrop() && gameState.storage.length < gameState.maxStorageCapacity
  );
}

/**
 *
 * @param {number} x
 * @param {number} y
 */
export function harvest(x, y) {
  const index = gameState.crops.findIndex(
    (crop) => crop.x === x && crop.y === y && crop.mature,
  );
  if (index !== -1) {
    if (gameState.storage.length < gameState.maxStorageCapacity) {
      gameState.crops.splice(index, 1);
      gameState.storage.push({ harvestTime: Date.now() });
      gameState.saveGameState();
    } else {
      showModal("Storage is full! Sell or delete some crops.");
    }
  }
}

/**
 *
 * @param {number} x
 * @param {number} y
 */
export function plant(x, y) {
  if (
    canSeed() &&
    !gameState.crops.some((crop) => crop.x === x && crop.y === y)
  ) {
    const iso = toIso(x, y);
    gameState.crops.push({
      x,
      y,
      mature: false,
      plantTime: Date.now(),
      isoX: iso.x,
      isoY: iso.y,
    });
    gameState.cash -= gameState.cropCost;
    gameState.saveGameState();
  }
}

export function sellCrops(quantity = gameState.storage.length) {
  const soldCrops = Math.min(quantity, gameState.storage.length);
  gameState.cash += soldCrops * gameState.cropSellPrice;
  gameState.storage.splice(0, soldCrops);
  showModal(
    `Sold ${soldCrops} crops for $${soldCrops * gameState.cropSellPrice}`,
  );
  gameState.saveGameState();
}

window.sellCrops = sellCrops;
