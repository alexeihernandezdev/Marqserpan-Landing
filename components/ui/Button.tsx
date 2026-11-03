import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-[background-color,box-shadow,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-60 text-center";

// El CTA directo usa siempre "primary": mismo color en toda la landing (FR-003).
const variants: Record<Variant, string> = {
  primary:
    "bg-verde-700 text-white shadow-[0_8px_24px_-8px_rgb(0_122_35/0.6)] hover:bg-verde-800 hover:-translate-y-px hover:shadow-[0_12px_28px_-8px_rgb(0_122_35/0.7)]",
  secondary: "border border-neutral-300 bg-white text-carbon hover:border-carbon hover:bg-hueso",
  ghost: "text-carbon underline-offset-4 hover:underline",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
