import CropManager from "../../../lib/crops/Manager.ts";
import InventoryManager from "../../../lib/inventory/Manager.ts";
import Button from "../../ui/Button";

export default function Inventory() {
  return (
    <>
      <h1>Inventory</h1>
      {InventoryManager.getTotalStoredItems() > 0
        ? (
          InventoryManager.getAllItems().map((item) => (
            <li key={item.data.id}>
              {item.quantity}x {item.data.displayName} | ${item.data.price}
            </li>
          ))
        )
        : <p>No items in inventory</p>}
      <br />
      <p>
        Usage: {InventoryManager.getTotalStoredItems()} /{" "}
        {InventoryManager.capacity}
      </p>
      <Button
        disabled={InventoryManager.getTotalStoredItems() === 0}
        variant="success"
        style="margin-top: 12px"
        onClick={() => CropManager.sellCrops()}
      >
        Sell All
      </Button>
    </>
  );
}
