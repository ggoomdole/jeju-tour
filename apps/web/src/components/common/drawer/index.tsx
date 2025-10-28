"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

import { createPortal } from "react-dom";

interface DrawerContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer 컴포넌트 내부에서만 사용할 수 있어요.");
  }
  return context;
};

interface DrawerProps {
  children: ReactNode;
}

function Drawer({ children }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close }}>{children}</DrawerContext.Provider>
  );
}

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

function DrawerTrigger({ children, className }: TriggerProps) {
  const { open } = useDrawer();
  return (
    <button className={className} onClick={open} type="button">
      {children}
    </button>
  );
}

interface ContentProps {
  children: ReactNode;
  className?: string;
}

function DrawerContent({ children, className }: ContentProps) {
  const { isOpen, close } = useDrawer();
  const [drawerRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen) {
      close();
    }
  });

  const [show, setShow] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setTimeout(() => setShow(true), 10);
    } else if (rendered) {
      setShow(false);
    }
  }, [isOpen]);

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!show && e.propertyName === "transform") {
      setRendered(false);
    }
  };

  if (!rendered) return null;

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-[99999] bg-black/50 transition-opacity duration-300",
          show ? "opacity-100" : "opacity-0"
        )}
        onClick={close}
        style={{ pointerEvents: show ? "auto" : "none" }}
      />
      <div
        ref={drawerRef}
        className={cn(
          "max-w-mobile fixed bottom-0 left-0 right-0 z-[99999] mx-auto transform rounded-t-2xl bg-white p-5 shadow-lg transition-transform duration-300 ease-in-out",
          show ? "translate-y-0" : "translate-y-full",
          className
        )}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

export { Drawer, DrawerTrigger, DrawerContent };
