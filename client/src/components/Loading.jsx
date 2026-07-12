import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/animations/loadingWave.json";

const Loading = ({ size = "w-60 h-60", bgClass = "bg-base-100" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => animation.destroy();
  }, []);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-50 ${bgClass} max-h-dvh`}
    >
      <div ref={containerRef} className={size} />
    </div>
  );
};

export default Loading;
