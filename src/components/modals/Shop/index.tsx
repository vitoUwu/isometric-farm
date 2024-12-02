import CropManager from "../../../lib/crops/Manager.ts";
import StorageManager from "../../../lib/storage/Manager.ts";
import Item from "./Item.tsx";

export default function Shop() {
  return (
    <ul style="min-width: 450px;max-height:80dvh;overflow-y:auto;padding-left: 0;">
      <h1>Shop</h1>
      <Item
        name={`Crop - Level ${CropManager.level}`}
        description={CropManager.isMaxed()
          ? `Maxed out`
          : `Seed Cost: $${CropManager.cropCost()} -> $${
            CropManager.cropCost(
              CropManager.level + 1,
            )
          }`}
        disabled={CropManager.isMaxed()}
        price={CropManager.cropSellingPrice()}
        onClick={() => CropManager.upgrade()}
      />
      <Item
        name={`Storage - Level ${StorageManager.level}`}
        description={StorageManager.isMaxed()
          ? "Maxed Out"
          : `Size: ${StorageManager.capacity} -> ${StorageManager.nextLevelCapacity()}`}
        price={StorageManager.upgradeCost()}
        disabled={StorageManager.isMaxed()}
        onClick={() => StorageManager.upgrade()}
      />
      <Item
        name="Auto Harvest"
        description={`Level: ${0}`}
        price={0}
        disabled={true}
        // onClick={() => upgradeAutoHarvest()}
      />
      <Item
        name="Auto Seed"
        description={`Level: ${0}`}
        price={0}
        disabled={true}
        // onClick={() => upgradeAutoSeed()}
      />
    </ul>
  );
}
