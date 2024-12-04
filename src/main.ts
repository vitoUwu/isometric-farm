import logger from "./lib/logger.ts";
logger.debug("Debugging is enabled");
logger.time("Game Loading time");

import migrate from "./lib/state/migrate.ts";
migrate();

import App from "./App.tsx";
import BankManager from "./lib/bank/Manager.ts";
import Canvas from "./lib/canvas.ts";
import EffectManager from "./lib/effects/Manager.ts";
import Events from "./lib/events.ts";
import ImageLoader from "./lib/ImageLoader.ts";
import InventoryManager from "./lib/inventory/Manager.ts";
import GameState from "./lib/state/game.ts";
import { updateTooltip } from "./lib/tooltip.ts";
import "./styles.css";

document.querySelector("#app")!.appendChild(App());

document.addEventListener("DOMContentLoaded", async () => {
  logger.debug("DOMContentLoaded");
  await ImageLoader.loadImages();
  InventoryManager.updateCapacityDisplay();
  BankManager.updateBalanceDisplay();

  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  Canvas.setupCanvas(canvas);
  Events.setupEvents(canvas);

  gameLoop();

  setInterval(() => {
    GameState.saveGameState();
  }, 10000);

  document.getElementById("loading")?.setAttribute("data-loaded", "true");
  logger.timeEnd("Game Loading time");
});

let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;
let lastFpsUpdateTime = performance.now();

function gameLoop() {
  const currentFrameTime = performance.now();
  const deltaTime = currentFrameTime - lastFrameTime;
  lastFrameTime = currentFrameTime;

  if (logger._debug) {
    frameCount++;

    // Update FPS every second
    if (currentFrameTime - lastFpsUpdateTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFpsUpdateTime = currentFrameTime;
    }
  }

  if (!Canvas.ctx) {
    throw new Error("Canvas context not found. You forgot to set the canvas?");
  }
  Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
  Canvas.drawGrid();
  updateTooltip();

  EffectManager.update(deltaTime);
  EffectManager.render(Canvas.ctx);

  if (logger._debug) {
    Canvas.ctx.fillStyle = "white";
    Canvas.ctx.font = "16px Arial";
    Canvas.ctx.fillText(`FPS: ${fps}`, 500, 20);
  }

  requestAnimationFrame(gameLoop);
}
