"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:pointer-events-none disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-white/25 bg-white/5 text-white hover:border-cyan-300/60 hover:bg-white/10"
      : "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30";

  return <button className={`${base} ${styles} ${className}`.trim()} {...props} />;
}
