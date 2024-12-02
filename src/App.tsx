import Modal, { renderModal } from "./components/modals/index.tsx";
import Inventory from "./components/modals/Inventory/index.tsx";
import Shop from "./components/modals/Shop/index.tsx";
import { showTutorial } from "./components/modals/Tutorial.tsx";
import Button from "./components/ui/Button.tsx";
import CropManager from "./lib/crops/Manager.ts";
import StorageManager from "./lib/storage/Manager.ts";
import TileManager from "./lib/tiles/Manager.ts";

export default function App() {
  const dev = localStorage.getItem("dev") === "true";
  return (
    <>
      <div id="loading"></div>
      <canvas id="gameCanvas"></canvas>
      <div id="tooltip"></div>
      <div class="btn-container">
        <Button onClick={() => renderModal(<Inventory />)}>Inventory</Button>
        <Button onClick={() => renderModal(<Shop />)}>Shop</Button>
        <Button onClick={() => showTutorial()}>?</Button>
      </div>
      <div class="info-container">
        <p>
          🪙 <span id="cash-display"></span>
        </p>
        <p>
          📦 <span id="storage-display"></span>
        </p>
      </div>
      {dev && (
        <div class="powers-container">
          <Button
            style="flex-direction: column;display: flex;align-items: center;aspect-ratio: 1/1;justify-content: center;padding:4px"
            variant="success"
            onClick={() => {
              while (CropManager.hasMatureCrop() && StorageManager.willFit(1)) {
                const crop = CropManager.getMatureCrop();
                if (crop) {
                  CropManager.harvest(crop.x, crop.y);
                }
              }
            }}
          >
            <span style="font-size: 32px">🌽</span>
            <span>Harvest Max</span>
          </Button>
          <Button
            style="flex-direction: column;display: flex;align-items: center;aspect-ratio: 1/1;justify-content: center;padding:4px"
            variant="success"
            onClick={() => {
              while (CropManager.canSeed() && TileManager.findDirtTile()) {
                const tile = TileManager.findDirtTile();
                if (tile) {
                  CropManager.plant(tile.x, tile.y);
                }
              }
            }}
          >
            <span style="font-size: 32px">🫘</span>
            <span>Plant Max</span>
          </Button>
          <Button
            style="flex-direction: column;display: flex;align-items: center;aspect-ratio: 1/1;justify-content: center;padding:4px"
            variant="danger"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <span style="font-size: 32px">🔄</span>
            <span>Reset</span>
          </Button>
        </div>
      )}
      <Modal />
    </>
  );
}
