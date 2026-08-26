import { useRef, useState, useEffect, useCallback } from "react";
import { tourScenes } from "../tourScenes";

const PAN_WIDTH = 2400; // matches the SVG panorama width in tourScenes.js

export default function VehicleTour360({ vehicle, onClose }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [offset, setOffset] = useState(0); // px, 0..PAN_WIDTH, wraps
  const dragState = useRef(null);
  const viewportRef = useRef(null);

  const scene = tourScenes[sceneIndex];

  const clampWrap = (v) => ((v % PAN_WIDTH) + PAN_WIDTH) % PAN_WIDTH;

  const onPointerDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    dragState.current = { startX: x, startOffset: offset };
  };

  const onPointerMove = useCallback((e) => {
    if (!dragState.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - dragState.current.startX;
    setOffset(clampWrap(dragState.current.startOffset - dx * 3));
  }, []);

  const onPointerUp = () => {
    dragState.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [onPointerMove]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const bgX = -offset;

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`360 degree tour of ${vehicle.name}`}
      onClick={onClose}
    >
      <div
        className="bg-pine-dark rounded-sm w-full max-w-4xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-light/10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-brass-light mb-1">
              360° Tour · {scene.label}
            </div>
            <h2 className="font-display text-xl text-sand-light">{vehicle.name}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close 360 tour"
            className="text-sand-light/70 hover:text-sand-light w-9 h-9 flex items-center justify-center rounded-full hover:bg-sand-light/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Panorama viewport */}
        <div
          ref={viewportRef}
          className="relative h-72 sm:h-96 overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        >
          {/* Two copies side by side for seamless infinite wrap */}
          <div
            className="absolute top-0 left-0 h-full flex"
            style={{ transform: `translateX(${bgX}px)`, width: PAN_WIDTH * 2 }}
          >
            <img src={scene.image} alt="" className="h-full" style={{ width: PAN_WIDTH }} draggable={false} />
            <img src={scene.image} alt="" className="h-full" style={{ width: PAN_WIDTH }} draggable={false} />
          </div>

          {/* Hotspots, positioned relative to the visible pan offset */}
          {[0, 1].map((copy) =>
            scene.hotspots.map((h, i) => {
              const absoluteX = copy * PAN_WIDTH + (h.x / 100) * PAN_WIDTH;
              const screenX = absoluteX + bgX;
              if (screenX < -60 || screenX > (viewportRef.current?.clientWidth || 900) + 60) return null;
              return (
                <Hotspot key={`${copy}-${i}`} x={screenX} label={h.label} />
              );
            })
          )}

          {/* Drag hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-sand-light/70 bg-ink/40 px-3 py-1.5 rounded-full pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 9l-4 3 4 3M16 9l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Drag to look around
          </div>
        </div>

        {/* Scene selector */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-sand-light/10">
          {tourScenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setSceneIndex(i);
                setOffset(0);
              }}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                i === sceneIndex
                  ? "bg-brass text-pine-dark"
                  : "bg-sand-light/10 text-sand-light/70 hover:bg-sand-light/20"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-5 pt-1 text-center text-[11px] text-sand-light/40 font-mono">
          Illustrative preview · captured to the I-ZURU field standard · real photography ahead of launch
        </div>
      </div>
    </div>
  );
}

function Hotspot({ x, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 z-10"
      style={{ left: x }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={label}
        className="w-6 h-6 rounded-full bg-brass border-2 border-sand-light/80 shadow-lg flex items-center justify-center animate-pulse hover:animate-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-pine-dark" />
      </button>
      {open && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink text-sand-light text-xs px-3 py-1.5 rounded-sm shadow-lg">
          {label}
        </div>
      )}
    </div>
  );
}
