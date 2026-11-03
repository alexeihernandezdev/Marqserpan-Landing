import type { ComponentProps } from "react";
import { controlClasses } from "./Field";

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select className={`${controlClasses} ${className}`} {...props}>
      {children}
    </select>
  );
}
