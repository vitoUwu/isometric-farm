import { HTMLAttributes } from "jsx-dom";

export type ButtonVariant = "primary" | "success" | "danger";

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  disabled?: boolean;
}

export default function Button(
  { variant = "primary", class: className, disabled, ...props }: Props,
) {
  return (
    <button
      class={`btn btn-${variant} ${className || ""}`.trim()}
      {...props}
      disabled={disabled}
    />
  );
}
