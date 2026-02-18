import { useEffect, useRef } from "react";
import SceneManager from "../game/SceneManager";

function Run() {
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    if (!canvasContainerRef.current) {
      return undefined;
    }

    const sceneManager = new SceneManager(canvasContainerRef.current);
    sceneManager.init();

    return () => {
      sceneManager.dispose();
    };
  }, []);

  return (
    <div className="run-root">
      <div ref={canvasContainerRef} className="run-canvas-container" />
    </div>
  );
}

export default Run;
