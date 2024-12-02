import { closeModal } from "..";
import StorageManager from "../../../lib/storage/Manager.ts";
import Button from "../../ui/Button";

export default function StorageLevelUpgraded() {
  return (
    <>
      <h1>Storage Level Upgraded</h1>
      <p>Now, you can store more crops!</p>
      <p>Storage level: {StorageManager.level}</p>
      <p>Capacity: {StorageManager.capacity}</p>
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
