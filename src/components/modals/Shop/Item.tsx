import Button from "../../ui/Button";

interface Props {
  name: string;
  description: string;
  price: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Item(
  { name, description, price, onClick, disabled }: Props,
) {
  return (
    <li style={`opacity: ${disabled ? 0.5 : 1}`}>
      <hr style="margin: 12px 0px" />
      <h2>{name}</h2>
      <p>{description}</p>
      {/* <p>Price: ${price}</p> */}
      <Button
        variant="success"
        style="margin-top: 12px"
        onClick={onClick}
        disabled={disabled}
      >
        Upgrade ({disabled ? "Maxed out" : `$${price}`})
      </Button>
    </li>
  );
}
