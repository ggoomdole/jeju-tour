import { useCallback, useEffect, useRef } from "react";

export const useOutsideClick = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  const onClick = useCallback(
    ({ target }: MouseEvent) => {
      if (!ref.current || !target) return;

      if (ref.current.contains(target as Node)) return;

      callback();
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  });

  return [ref] as const;
};
