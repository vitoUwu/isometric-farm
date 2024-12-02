import App from "./App.tsx";
import BankManager from "./lib/bank/Manager.ts";
import { canvas, ctx, drawGrid, setupCanvas } from "./lib/canvas.ts";
import gameState from "./lib/gameState.ts";
import ImageLoader from "./lib/ImageLoader.ts";
import StorageManager from "./lib/storage/Manager.ts";
import { updateTooltip } from "./lib/tooltip.ts";
import "./styles.css";

document.querySelector("#app")!.appendChild(App());

document.addEventListener("DOMContentLoaded", async () => {
  await ImageLoader.loadImages();
  StorageManager.updateCapacityDisplay();
  BankManager.updateBalanceDisplay();
  setupCanvas();
  gameLoop();

  setInterval(() => {
    gameState.saveGameState();
  }, 10000);
});

function gameLoop() {
  ctx().clearRect(0, 0, canvas.current!.width, canvas.current!.height);
  drawGrid();
  updateTooltip();
  // if (secondsTillNextHarvest === 0 && hasMatureCrop() && storage.length < maxStorageCapacity) {
  //   autoHarvest();
  // }
  // if (secondsTillNextSeed === 0 && canSeed()) {
  //   autoSeed();
  // }
  requestAnimationFrame(gameLoop);
}
