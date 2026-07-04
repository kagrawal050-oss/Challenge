"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-compass text-white hover:bg-teal-800 focus-visible:ring-compass",
  secondary: "border border-slate-300 bg-white text-ink hover:bg-slate-50 focus-visible:ring-slate-400",
  ghost: "text-ink hover:bg-white/70 focus-visible:ring-slate-400"
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
