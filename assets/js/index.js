import "./robots/index.js";
import "./ui/index.js";
import "./camera.js";
import "./canvas.js";
import "./constants.js";
import "./crop.js";
import "./gameState.js";
import "./imageLoader.js";
import "./modal.js";
import "./tile.js";
import "./tooltip.js";
import "./tutorial.js";
import "./utils.js";

import { canvas, ctx, drawGrid } from "./canvas.js";
import { loadImages } from "./imageLoader.js";
import { createUser } from "./robots/index.js";
import { updateTooltip } from "./tooltip.js";
import { drawCash } from "./ui/index.js";

(async () => {
  await loadImages();

  window.robots = [createUser()];

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCash();
    updateTooltip();
    // if (secondsTillNextHarvest === 0 && hasMatureCrop() && storage.length < maxStorageCapacity) {
    //   autoHarvest();
    // }
    // if (secondsTillNextSeed === 0 && canSeed()) {
    //   autoSeed();
    // }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
})();
