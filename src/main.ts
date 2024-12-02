import App from "./App.tsx";
import BankManager from "./lib/bank/Manager.ts";
import Canvas from "./lib/canvas.ts";
import Events from "./lib/events.ts";
import GameState from "./lib/gameState.ts";
import ImageLoader from "./lib/ImageLoader.ts";
import StorageManager from "./lib/storage/Manager.ts";
import { updateTooltip } from "./lib/tooltip.ts";
import "./styles.css";

document.querySelector("#app")!.appendChild(App());

document.addEventListener("DOMContentLoaded", async () => {
  await ImageLoader.loadImages();
  StorageManager.updateCapacityDisplay();
  BankManager.updateBalanceDisplay();

  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  Canvas.setupCanvas(canvas);
  Events.setupEvents(canvas);

  gameLoop();

  setInterval(() => {
    GameState.saveGameState();
  }, 10000);
});

function gameLoop() {
  if (!Canvas.ctx) {
    throw new Error("Canvas context not found. You forgot to set the canvas?");
  }
  Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
  Canvas.drawGrid();
  updateTooltip();
  // if (secondsTillNextHarvest === 0 && hasMatureCrop() && storage.length < maxStorageCapacity) {
  //   autoHarvest();
  // }
  // if (secondsTillNextSeed === 0 && canSeed()) {
  //   autoSeed();
  // }
  requestAnimationFrame(gameLoop);
}
