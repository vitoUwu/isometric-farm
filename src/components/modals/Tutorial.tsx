import { useRef } from "jsx-dom";
import Button from "../ui/Button";

export default function Tutorial() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} class="tutorial-container">
      <Button variant="danger" onClick={() => container.current?.remove()}>
        X
      </Button>
      <p>👋 Welcome to the Isometric Pixel Farming Game!</p>
      <p>
        Harvest crops by pressing the left mouse button and dragging over them.
      </p>
      <p>
        Plant crops by pressing the left mouse button and clicking on the dirt
        tile.
      </p>
      <p>Sell crops by clicking on the "Inventory" button.</p>
      <p>You can buy upgrades by clicking on the "Shop" button.</p>
      <p>To increase your field level, click on the darker tiles.</p>
    </div>
  );
}

export function showTutorial() {
  document.body.appendChild(<Tutorial />);
}
