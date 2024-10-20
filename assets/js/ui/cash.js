import gameState from "../gameState.js";

const cashDisplay = document.getElementById("cash-display");
const storageDisplay = document.getElementById("storage-display");

export function drawCash() {
  cashDisplay.textContent = `$${gameState.cash.toFixed(2)}`;
  storageDisplay.textContent = `${gameState.storage.length}/${gameState.maxStorageCapacity} crops`;
}
