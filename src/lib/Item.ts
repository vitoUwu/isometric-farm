export enum ItemType {
  CROP = "crop",
}

export class Item {
  public id: string;

  public displayName: string;
  public description: string;

  public sellable: boolean;
  public price: number;

  public type: ItemType;

  constructor(
    id: string,
    displayName: string,
    description: string,
    sellable: boolean,
    price: number,
    type: ItemType,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.sellable = sellable;
    this.price = price;
    this.type = type;
  }

  static createCrop(
    id: string,
    displayName: string,
    description: string,
    sellable: boolean,
    price: number,
  ) {
    return new Item(
      id,
      displayName,
      description,
      sellable,
      price,
      ItemType.CROP,
    );
  }
}
