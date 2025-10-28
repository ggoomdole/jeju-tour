"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
}

const buttonVariants = {
  default: "from-main-700 to-main-900",
  warning: "from-red-300 to-red-500",
};

type ButtonVariants = keyof typeof buttonVariants;

export default function Button(props: ButtonProps) {
  const { children, className, variant = "default", ...restProps } = props;

  return (
    <button
      className={cn(
        "typo-semibold rounded-xl bg-gradient-to-r py-5 text-white transition-colors disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300",
        buttonVariants[variant],
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}
