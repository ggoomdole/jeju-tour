import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../../ui/carousel";

interface DragCarouselProps {
  children: ReactNode;
  className?: string;
  setApi?: (api: CarouselApi | null) => void;
}

export function DragCarousel({ children, className, setApi }: DragCarouselProps) {
  return (
    <Carousel opts={{ dragFree: true }} className={className} setApi={setApi}>
      <CarouselContent>{children}</CarouselContent>
    </Carousel>
  );
}

interface DragCarouselItemProps {
  children: ReactNode;
  className?: string;
}

export function DragCarouselItem({ children, className }: DragCarouselItemProps) {
  return <CarouselItem className={cn("flex-none", className)}>{children}</CarouselItem>;
}
