"use client";

import { useRef, useState } from "react";

import ArrowRight from "@/assets/arrow-right.svg";
import Checkbox from "@/components/checkbox";
import { cn } from "@/lib/utils";

interface AgreementItemProps {
  checked: boolean;
  title: string;
  description: string;
  essential?: boolean;
  onChecked: (checked: boolean) => void;
}

export default function AgreementItem({
  checked,
  title,
  essential,
  description,
  onChecked,
}: AgreementItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const agreementTypeText = essential ? "필수" : "선택";

  const heightRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-2.5">
          <Checkbox
            id={`agreement-item-${title}`}
            checked={checked}
            onChange={(e) => onChecked(e.target.checked)}
          />
          <label htmlFor={`agreement-item-${title}`} className="typo-medium w-full">
            {title}({agreementTypeText})
          </label>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <ArrowRight
            className={cn("size-5 text-gray-300 transition-transform", isOpen && "rotate-90")}
          />
        </button>
      </div>
      <div
        className={cn(
          "typo-regular ml-7.5 overflow-hidden transition-all",
          isOpen && "my-2.5 h-auto"
        )}
        ref={heightRef}
        style={{ height: isOpen ? heightRef.current?.scrollHeight : 0 }}
      >
        {description}
      </div>
    </div>
  );
}
