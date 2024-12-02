import gameState from "../../../lib/gameState.ts";
import Button from "../../ui/Button.tsx";

export default function FieldLevel() {
  return (
    <>
      <h2>Upgrade Field Level</h2>
      <p>
        Your current field level is{" "}
        {gameState.tilesLevel}x{gameState.tilesLevel}.
      </p>
      <p>
        You can upgrade to a{" "}
        {gameState.tilesLevel + 1}x{gameState.tilesLevel + 1}{" "}
        field level by spending ${gameState.tileLevelUpgradePrice}.
      </p>
      <Button
        variant="success"
        onClick={gameState.upgradeFieldLevel}
        style="margin-top: 12px"
      >
        Upgrade
      </Button>
    </>
  );
}
