interface Props {
  quantity: number;
  price: number;
}

export default function SoldCrops({ quantity, price }: Props) {
  return (
    <div>
      Sold {quantity} crops for ${price}
    </div>
  );
}
