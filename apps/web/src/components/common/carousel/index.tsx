"use client";

import { Children, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  interval?: number;
  className?: string;
}

function Carousel({ children, interval = 0, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(560);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(20);
  const [dragDistance, setDragDistance] = useState(0);

  const childrenArray = Children.toArray(children);

  const getTranslateX = () => {
    if (isDragging) {
      const baseTranslateX =
        currentIndex === 0 ? 20 : -(currentIndex * itemWidth + (currentIndex - 2) * 10);
      return `${baseTranslateX + translateX}px`;
    }
    if (currentIndex === 0) return `20px`;
    if (currentIndex === childrenArray.length - 1)
      return `-${currentIndex * itemWidth + (currentIndex - 2) * 10}px`;
    return `-${currentIndex * itemWidth + (currentIndex - 2) * 10}px`;
  };

  useEffect(() => {
    const calculateItemWidth = () => {
      const el = document.querySelector(".carousel-viewport");
      if (el) return el.clientWidth - 40;
      return 560;
    };
    setItemWidth(calculateItemWidth());
    let timeoutId: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setItemWidth(calculateItemWidth());
      }, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!interval || interval <= 0) return;
    if (isDragging) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= childrenArray.length - 1) return 0;
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isDragging, childrenArray.length, interval]);

  useEffect(() => {
    if (!isDragging) setTranslateX(0);
  }, [currentIndex, isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragDistance(0);
    setTranslateX(0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const distance = e.clientX - startX;
    setDragDistance(distance);
    setTranslateX(distance);
  };
  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragDistance) < 50) {
      setTranslateX(0);
      return;
    }
    let newIndex = currentIndex;
    if (dragDistance > 50) newIndex = Math.max(0, currentIndex - 1);
    else if (dragDistance < -50) newIndex = Math.min(childrenArray.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    setTranslateX(0);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragDistance(0);
    setTranslateX(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const distance = e.touches[0].clientX - startX;
    setDragDistance(distance);
    setTranslateX(distance);
  };
  const onTouchEnd = () => {
    onMouseUp();
  };

  return (
    <div className={cn("carousel-viewport relative w-full overflow-x-hidden", className)}>
      <div
        className={cn("flex gap-2.5 transition-transform duration-300", {
          "transition-none": isDragging,
        })}
        style={{
          transform: `translateX(${getTranslateX()})`,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center justify-center"
            style={{
              maxWidth: `${itemWidth}px`,
              width: `${itemWidth}px`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

function CarouselItem({ children, className }: CarouselItemProps) {
  return <div className={cn("h-full w-full", className)}>{children}</div>;
}

export { Carousel, CarouselItem };
