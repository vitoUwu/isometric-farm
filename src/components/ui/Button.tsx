import type { HTMLAttributes } from "jsx-dom";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger";
  disabled?: boolean;
}

export default function Button(
  { variant = "primary", class: className, ...props }: Props,
) {
  return (
    <button class={`btn btn-${variant} ${className || ""}`.trim()} {...props} />
  );
}
