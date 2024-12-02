import TileManager from "../../../lib/tiles/Manager.ts";
import Button from "../../ui/Button.tsx";

export default function FieldLevel() {
  return (
    <>
      <h2>Upgrade Field Level</h2>
      <p>
        Your current field level is {TileManager.level}x{TileManager.level}.
      </p>
      <p>
        You can upgrade to a {TileManager.level + 1}x{TileManager.level + 1}
        {" "}
        field level by spending ${TileManager.tileLevelUpgradePrice()}.
      </p>
      <Button
        variant="success"
        onClick={() => TileManager.upgradeFieldLevel()}
        style="margin-top: 12px"
      >
        Upgrade
      </Button>
    </>
  );
}
