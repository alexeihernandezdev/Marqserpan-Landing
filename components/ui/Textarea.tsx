import type { ComponentProps } from "react";
import { controlClasses } from "./Field";

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`${controlClasses} min-h-28 ${className}`} {...props} />;
}
