"use client";

import { cn } from "@/lib/utils";

export default function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <input
      type="checkbox"
      className={cn(
        "checked:bg-main-900 relative size-5 shrink-0 appearance-none rounded-full border border-gray-900 after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:content-['✓'] checked:border-none checked:after:opacity-100",
        className
      )}
      {...rest}
    />
  );
}
