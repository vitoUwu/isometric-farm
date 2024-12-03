import Button from "../Button";
import CropManager from "../../../lib/crops/Manager";
import InventoryManager from "../../../lib/inventory/Manager";

export default function HarvestAll() {
  return (
    <Button
      style="flex-direction: column;display: flex;align-items: center;aspect-ratio: 1/1;justify-content: center;padding:4px"
      variant="success"
      onClick={() => {
        while (CropManager.hasMatureCrop() && InventoryManager.willFit(1)) {
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
  );
}
