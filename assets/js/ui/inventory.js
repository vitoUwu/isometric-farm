import gameState from "../gameState.js";
import { showModal } from "../modal.js";

const button = document.getElementById("inventory-btn");

button.addEventListener("click", () => {
  showModal(`
      <h1>Inventory</h1>
      <p>Storage: ${gameState.storage.length} crops</p>
      <button class="success" onclick="window.sellCrops()">Sell All</button>
  `);
});
