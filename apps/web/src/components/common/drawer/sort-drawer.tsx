"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { getParams } from "@/utils/params";

import { Check } from "lucide-react";

import { Drawer, DrawerContent, DrawerTrigger } from ".";

interface SortDrawerProps {
  options: {
    name: string;
    value: string;
  }[];
  className?: string;
}

function SortDrawerWithoutSuspense({ options, className }: SortDrawerProps) {
  const searchParams = useSearchParams();
  const currentSortOption = searchParams.get("sort") || options[0].value;
  const selectedSortOption = options.find((option) => option.value === currentSortOption);

  const router = useRouter();

  const onSortChange = (value: string) => {
    const defaultParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === "sort") continue;
      defaultParams[key] = value;
    }
    const params = getParams(defaultParams, { sort: value });
    router.replace(`?${params}`);
  };

  return (
    <Drawer>
      <DrawerTrigger className={className}>{selectedSortOption?.name}</DrawerTrigger>
      <DrawerContent className="typo-semibold flex flex-col">
        {options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "flex items-center justify-between py-2.5 text-gray-300",
              option.value === selectedSortOption?.value && "text-gray-900"
            )}
            onClick={() => onSortChange(option.value)}
          >
            <p>{option.name}</p>
            {option.value === selectedSortOption?.value && <Check className="size-5" />}
          </button>
        ))}
      </DrawerContent>
    </Drawer>
  );
}

export default function SortDrawer({ options, className }: SortDrawerProps) {
  return (
    <Suspense fallback={<></>}>
      <SortDrawerWithoutSuspense options={options} className={className} />
    </Suspense>
  );
}
