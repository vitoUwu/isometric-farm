import CropManager from "../../../lib/crops/Manager.ts";
import gameState from "../../../lib/gameState.ts";
import StorageManager from "../../../lib/storage/Manager.ts";
import Item from "./Item.tsx";

export default function Shop() {
  const autoHarvestLevel = gameState.autoHarvestLevel;
  const autoSeederLevel = gameState.autoSeederLevel;
  const getAutoHarvestUpgradePrice = () => 0;
  const getAutoSeederUpgradePrice = () => 0;

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
        description={`Level: ${autoHarvestLevel}`}
        price={getAutoHarvestUpgradePrice()}
        disabled={true}
        // onClick={() => upgradeAutoHarvest()}
      />
      <Item
        name="Auto Seed"
        description={`Level: ${autoSeederLevel}`}
        price={getAutoSeederUpgradePrice()}
        disabled={true}
        // onClick={() => upgradeAutoSeed()}
      />
    </ul>
  );
}
