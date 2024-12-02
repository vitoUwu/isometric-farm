import CropManager from "../../../lib/crops/Manager.ts";
import StorageManager from "../../../lib/storage/Manager";
import Button from "../../ui/Button";

export default function Inventory() {
  return (
    <>
      <h1>Inventory</h1>
      {StorageManager.getTotalStoredItems() > 0
        ? (
          StorageManager.getAllItems().map((item) => (
            <li key={item.data.id}>
              {item.quantity}x {item.data.displayName} | ${item.data.price}
            </li>
          ))
        )
        : <p>No items in inventory</p>}
      <br />
      <p>
        Usage: {StorageManager.getTotalStoredItems()} /{" "}
        {StorageManager.capacity}
      </p>
      <Button
        disabled={StorageManager.getTotalStoredItems() === 0}
        variant="success"
        style="margin-top: 12px"
        onClick={() => CropManager.sellCrops()}
      >
        Sell All
      </Button>
    </>
  );
}
