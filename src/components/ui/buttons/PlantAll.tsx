import CropManager from "../../../lib/crops/Manager";
import TileManager from "../../../lib/tiles/Manager";
import Button from "../Button";

export default function PlantAll() {
  return (
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
  );
}
