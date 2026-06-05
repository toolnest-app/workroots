import * as React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-stone-400 focus:ring-2 ${className}`}
      {...props}
    />
  );
}