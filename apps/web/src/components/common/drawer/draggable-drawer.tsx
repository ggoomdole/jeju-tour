"use client";

import { useEffect, useRef, useState } from "react";

interface DraggableDrawerProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  snapThreshold?: number;
}

const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_SNAP_THRESHOLD = 100;
const DEFAULT_HEADER_HEIGHT = 72;
const DEFAULT_FOOTER_HEIGHT = 60;

export default function DraggableDrawer({
  children,
  className,
  minHeight = DEFAULT_MIN_HEIGHT,
  maxHeight,
  snapThreshold = DEFAULT_SNAP_THRESHOLD,
}: DraggableDrawerProps) {
  const [drawerHeight, setDrawerHeight] = useState<number>(minHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragY, setStartDragY] = useState(0);
  const [startDrawerHeight, setStartDrawerHeight] = useState(0);

  const drawerRef = useRef<HTMLElement>(null);
  const minDrawerHeight = useRef<number>(minHeight);
  const maxDrawerHeight = useRef<number>(
    maxHeight || typeof window !== "undefined"
      ? window.innerHeight - DEFAULT_HEADER_HEIGHT - DEFAULT_FOOTER_HEIGHT
      : 0
  );

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartDragY(e.clientY);
    setStartDrawerHeight(drawerHeight || 0);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartDragY(e.touches[0].clientY);
    setStartDrawerHeight(drawerHeight || 0);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaY = startDragY - e.touches[0].clientY;
    const maxHeight =
      maxDrawerHeight.current || window.innerHeight - DEFAULT_HEADER_HEIGHT - DEFAULT_FOOTER_HEIGHT;

    // deltaY가 임계값에 도달하면 최소/최대 높이로 스냅
    if (deltaY > snapThreshold) {
      // 위로 드래그하여 임계값 도달 시 최대 높이로
      setDrawerHeight(maxHeight);
    } else if (deltaY < -snapThreshold) {
      // 아래로 드래그하여 임계값 도달 시 최소 높이로
      setDrawerHeight(minHeight);
    } else {
      // 임계값 내에서는 자연스럽게 드래그
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startDrawerHeight + deltaY));
      setDrawerHeight(newHeight);
    }
  };

  const onTouchEnd = () => {
    if (!isDragging) return;

    const currentHeight = drawerHeight || 0;
    const currentMinHeight = minDrawerHeight.current;
    const maxHeight =
      maxDrawerHeight.current || window.innerHeight - DEFAULT_HEADER_HEIGHT - DEFAULT_FOOTER_HEIGHT;

    // 임계값 범위 내에서 스냅 결정
    if (currentHeight - currentMinHeight < snapThreshold) {
      setDrawerHeight(currentMinHeight);
    } else if (maxHeight - currentHeight < snapThreshold) {
      setDrawerHeight(maxHeight);
    }

    setIsDragging(false);
  };

  useEffect(() => {
    const onGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = startDragY - e.clientY;
      const currentMinHeight = minDrawerHeight.current;
      const maxHeight =
        maxDrawerHeight.current ||
        window.innerHeight - DEFAULT_HEADER_HEIGHT - DEFAULT_FOOTER_HEIGHT;

      // deltaY가 임계값에 도달하면 최소/최대 높이로 스냅
      if (deltaY > snapThreshold) {
        // 위로 드래그하여 임계값 도달 시 최대 높이로
        setDrawerHeight(maxHeight);
      } else if (deltaY < -snapThreshold) {
        // 아래로 드래그하여 임계값 도달 시 최소 높이로
        setDrawerHeight(currentMinHeight);
      } else {
        // 임계값 내에서는 자연스럽게 드래그
        const newHeight = Math.max(
          currentMinHeight,
          Math.min(maxHeight, startDrawerHeight + deltaY)
        );
        setDrawerHeight(newHeight);
      }
    };

    const onGlobalMouseUp = () => {
      if (!isDragging) return;

      const currentHeight = drawerHeight || 0;
      const currentMinHeight = minDrawerHeight.current;
      const maxHeight =
        maxDrawerHeight.current ||
        window.innerHeight - DEFAULT_HEADER_HEIGHT - DEFAULT_FOOTER_HEIGHT;

      // 임계값 범위 내에서 스냅 결정
      if (currentHeight - currentMinHeight < snapThreshold) {
        setDrawerHeight(currentMinHeight);
      } else if (maxHeight - currentHeight < snapThreshold) {
        setDrawerHeight(maxHeight);
      }

      setIsDragging(false);
    };

    // 전역 마우스 이벤트 리스너 추가
    document.addEventListener("mousemove", onGlobalMouseMove);
    document.addEventListener("mouseup", onGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", onGlobalMouseMove);
      document.removeEventListener("mouseup", onGlobalMouseUp);
    };
  }, [isDragging, startDragY, startDrawerHeight, drawerHeight, maxHeight, snapThreshold]);

  return (
    <section
      ref={drawerRef}
      className={`absolute bottom-0 flex w-full flex-col items-center justify-between rounded-t-2xl bg-white shadow-2xl ${className}`}
      style={{
        height: drawerHeight ? `${drawerHeight}px` : "auto",
        transition: "height 0.3s ease-in-out",
      }}
    >
      <div
        className="w-full cursor-ns-resize select-none py-3"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className="mx-auto h-2 w-8 rounded-full bg-gray-500" />
      </div>
      <div className="w-full flex-1 overflow-y-auto p-5">{children}</div>
    </section>
  );
}
