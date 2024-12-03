import Modal, { renderModal } from "./components/modals/index.tsx";
import Inventory from "./components/modals/Inventory/index.tsx";
import Shop from "./components/modals/Shop/index.tsx";
import { showTutorial } from "./components/modals/Tutorial.tsx";
import Button from "./components/ui/Button.tsx";
import DailyButton from "./components/ui/buttons/Daily.tsx";
import HarvestAll from "./components/ui/buttons/HarvestAll.tsx";
import PlantAll from "./components/ui/buttons/PlantAll.tsx";
import Reset from "./components/ui/buttons/Reset.tsx";

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
          <HarvestAll />
          <PlantAll />
          <Reset />
        </div>
      )}
      <DailyButton />
      <Modal />
    </>
  );
}
