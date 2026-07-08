import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export const Scroll = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositionsRef = useRef(new Map());

  useEffect(() => {
    const container = document.querySelector("main");
    if (!container) return;

    const targetPosition =
      navigationType === "POP"
        ? (scrollPositionsRef.current.get(location.key) ?? 0)
        : 0;

    requestAnimationFrame(() => {
      container.scrollTo({ top: targetPosition, left: 0, behavior: "auto" });
    });

    return () => {
      if (container) {
        scrollPositionsRef.current.set(location.key, container.scrollTop);
      }
    };
  }, [location.key, navigationType]);

  return null;
};
