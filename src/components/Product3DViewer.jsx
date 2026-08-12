import { useEffect, useRef, useState } from "react";

const FALLBACK_ORBIT = "35deg 70deg 4m";
const FALLBACK_TARGET = "0m 0.7m 0m";

const Product3DViewer = ({ model, productName, lang = "en" }) => {
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const [customElementReady, setCustomElementReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const copy = lang === "pt"
    ? {
      loading: "A preparar a vista 3D…",
      drag: "Arraste para rodar · use a roda para aproximar",
      reset: "Repor vista",
      fullscreen: "Ecrã inteiro",
      exitFullscreen: "Sair do ecrã inteiro",
      failed: "A vista 3D não ficou disponível. Pode continuar a ver as imagens do produto.",
    }
    : {
      loading: "Preparing the 3D view…",
      drag: "Drag to rotate · use the wheel to zoom",
      reset: "Reset view",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
      failed: "The 3D view could not be loaded. You can still browse the product images.",
    };

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer")
      .then(() => {
        if (!cancelled) setCustomElementReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !customElementReady) return undefined;
    // React can mount a custom element before the model-viewer definition has
    // upgraded. Set the asset attributes after registration so the GLB is
    // always handed to the web component, including on a first visit.
    viewer.setAttribute("src", model.src);
    viewer.setAttribute("poster", model.poster);
    viewer.setAttribute("alt", productName);
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("touch-action", "none");
    viewer.setAttribute("disable-pan", "");
    viewer.setAttribute("interaction-prompt", "auto");
    viewer.setAttribute("shadow-intensity", "0.9");
    viewer.setAttribute("shadow-softness", "0.65");
    viewer.setAttribute("exposure", "1");
    viewer.setAttribute("camera-orbit", model.cameraOrbit || FALLBACK_ORBIT);
    viewer.setAttribute("camera-target", model.cameraTarget || FALLBACK_TARGET);
    viewer.setAttribute("loading", "eager");
    viewer.setAttribute("reveal", "auto");
    viewer.src = model.src;
    viewer.poster = model.poster;
    viewer.alt = productName;
    viewer.cameraOrbit = model.cameraOrbit || FALLBACK_ORBIT;
    viewer.cameraTarget = model.cameraTarget || FALLBACK_TARGET;
    viewer.disablePan = true;
    viewer.disableZoom = false;
    const handleError = () => setLoadFailed(true);
    const handleLoad = () => setLoadFailed(false);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("load", handleLoad);
    return () => {
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("load", handleLoad);
    };
  }, [customElementReady, model.cameraOrbit, model.cameraTarget, model.poster, model.src, productName]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const resetView = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.cameraOrbit = model.cameraOrbit || FALLBACK_ORBIT;
    viewer.cameraTarget = model.cameraTarget || FALLBACK_TARGET;
    viewer.fieldOfView = "auto";
    viewer.jumpCameraToGoal?.();
  };

  const toggleFullscreen = async () => {
    if (!frameRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      return;
    }
    await frameRef.current.requestFullscreen?.();
  };

  if (loadFailed) {
    return (
      <div className="rd-3d-viewer rd-3d-fallback" ref={frameRef} role="status">
        <img src={model.poster} alt={productName} loading="lazy" />
        <p className="fs">{copy.failed}</p>
      </div>
    );
  }

  return (
    <div className="rd-3d-viewer" ref={frameRef}>
      {!customElementReady && (
        <div className="rd-3d-loading fs" role="status">
          <img src={model.poster} alt="" aria-hidden="true" />
          <span>{copy.loading}</span>
        </div>
      )}
      {customElementReady && (
        <model-viewer
          ref={viewerRef}
          className="rd-3d-viewer-canvas"
          src={model.src}
          poster={model.poster}
          alt={productName}
          camera-controls=""
          touch-action="none"
          disable-pan=""
          interaction-prompt="auto"
          shadow-intensity="0.9"
          shadow-softness="0.65"
          exposure="1"
          camera-orbit={model.cameraOrbit || FALLBACK_ORBIT}
          camera-target={model.cameraTarget || FALLBACK_TARGET}
          loading="eager"
          reveal="auto"
        />
      )}
      <div className="rd-3d-controls" aria-label={lang === "pt" ? "Controlos da vista 3D" : "3D view controls"}>
        <span className="rd-3d-hint fs">{copy.drag}</span>
        <div className="rd-3d-actions">
          <button type="button" className="fs" onClick={resetView}>{copy.reset}</button>
          <button type="button" className="fs" onClick={toggleFullscreen}>{isFullscreen ? copy.exitFullscreen : copy.fullscreen}</button>
        </div>
      </div>
    </div>
  );
};

export default Product3DViewer;
