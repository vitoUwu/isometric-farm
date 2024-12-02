import { closeModal } from "..";
import CropManager from "../../../lib/crops/Manager.ts";
import Button from "../../ui/Button";

export default function CropLevelUpgraded() {
  return (
    <>
      <h1>Crops Level Upgraded</h1>
      <p>Now, every crop you sell will be worth more!</p>
      <p>Crop level: {CropManager.level}</p>
      <p>Seed cost: {CropManager.cropCost()}</p>
      <p>Selling price: {CropManager.cropSellingPrice()}</p>
      <Button
        variant="success"
        style="margin-top: 12px"
        onClick={() => closeModal()}
      >
        Yay!
      </Button>
    </>
  );
}