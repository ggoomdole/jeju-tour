"use client";

import { cn } from "@/lib/utils";

import Button from ".";

export default function FloatingButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, className, ...restProps } = props;

  return (
    <Button
      className={cn(
        "max-w-floating-button fixed bottom-10 w-[calc(100%-2.5rem)] self-center",
        className
      )}
      {...restProps}
    >
      {children}
    </Button>
  );
}
