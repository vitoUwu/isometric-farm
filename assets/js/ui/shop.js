import gameState from "../gameState.js";
import { showModal } from "../modal.js";

const button = document.getElementById("shop-btn");

button.addEventListener("click", () => {
  const cropCost = gameState.cropCost;
  const cropSellPrice = gameState.cropSellPrice;
  const maxStorageCapacity = gameState.maxStorageCapacity;
  const autoHarvestLevel = gameState.autoHarvestLevel;
  const autoSeederLevel = gameState.autoSeederLevel;
  const getCropUpgradePrice = () => 0;
  const getStorageUpgradePrice = () => 0;
  const getAutoHarvestUpgradePrice = () => 0;
  const getAutoHarvestThrottleTime = () => 0;
  const getAutoSeederUpgradePrice = () => 0;
  const getAutoSeederThrottleTime = () => 0;

  showModal(`
      <div style="min-width: 450px;max-height:80dvh;overflow-y:auto">
          <h1>Shop</h1>
          <hr style="margin: 12px 0px">
          <h2>Crop</h2>
          <p>Seed Cost: $${cropCost}</p>
          <p>Sell Price: $${cropSellPrice}</p>
          <p>By upgrading your crop, it will cost $${cropCost * 2} to plant a new crop and you will get $${cropSellPrice * 2} by selling a crop.</p>
          <button class="success" style="margin-top: 12px" onclick="upgradeCrop()">Upgrade ($${getCropUpgradePrice()})</button>
          <hr style="margin: 12px 0px">
          <h2>Storage</h2>
          <p>Size: ${maxStorageCapacity}</p>
          <p>By upgrading your storage, it will increase your storage capacity to ${maxStorageCapacity * 2}.</p>
          <button class="success" style="margin-top: 12px" onclick="upgradeStorage()">Upgrade ($${getStorageUpgradePrice()})</button>
          <hr style="margin: 12px 0px">
          <h2>Auto Harvest</h2>
          <p>Your current auto harvest level is ${autoHarvestLevel}.</p>
          <p>You can upgrade to a ${autoHarvestLevel + 1} auto harvest level by spending $${getAutoHarvestUpgradePrice()}.</p>
          <p>At every ${getAutoHarvestThrottleTime() / 1000} seconds, the auto harvest will harvest one crop.</p>
          <button class="success" style="margin-top: 12px" onclick="upgradeAutoHarvest()">Upgrade ($${getAutoHarvestUpgradePrice()})</button>
          <hr style="margin: 12px 0px">
          <h2>Auto Seed</h2>
          <p>Your current auto seed level is ${autoSeederLevel}.</p>
          <p>You can upgrade to a ${autoSeederLevel + 1} auto seed level by spending $${getAutoSeederUpgradePrice()}.</p>
          <p>At every ${getAutoSeederThrottleTime() / 1000} seconds, the auto seed will plant a crop.</p>
          <button class="success" style="margin-top: 12px" onclick="upgradeAutoSeed()">Upgrade ($${getAutoSeederUpgradePrice()})</button>
      </div>
  `);
});
