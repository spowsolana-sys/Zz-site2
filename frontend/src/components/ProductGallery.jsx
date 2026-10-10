import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImageOff, ZoomIn } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

/**
 * ProductGallery — galerie plein écran avec zoom sur ordinateur uniquement.
 * Détection : `matchMedia("(hover: hover) and (pointer: fine)")` → vrai
 * uniquement pour les périphériques avec vraie souris. Sur mobile et tablette
 * tactile, le zoom est désactivé pour préserver le défilement natif.
 *
 * Interaction desktop :
 *   • Clic sur l'image principale → entrée en mode zoom (×2) centré sur le
 *     point cliqué.
 *   • Déplacement de la souris → l'image s'ajuste pour montrer la zone survolée
 *     (via transform-origin). Transition fluide.
 *   • Clic à nouveau, touche Échap ou bouton Fermer → sortie du zoom.
 *   • Curseur `zoom-in` / `zoom-out` selon l'état.
 */
export default function ProductGallery({ open, onClose, variant }) {
  const [sel, setSel] = useState(0);
  const [canZoom, setCanZoom] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // en pourcentage
  const imgWrapRef = useRef(null);

  // Détection ordinateur (souris + survol fin) — exécutée côté client.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanZoom(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  // Reset miniature + zoom à l'ouverture ou au changement de variante.
  useEffect(() => {
    if (open) {
      setSel(0);
      setZoomed(false);
    }
  }, [open, variant.id]);

  // Reset zoom quand on change de miniature.
  useEffect(() => {
    setZoomed(false);
  }, [sel]);

  // Fermeture via Échap ; sortie du zoom aussi via Échap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (zoomed) setZoomed(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, zoomed]);

  const current = variant.gallery[sel];

  const onImageMouseMove = (e) => {
    if (!canZoom || !zoomed || !imgWrapRef.current) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const onImageClick = (e) => {
    if (!canZoom || !current.src) return;
    // Point de clic → point focal du zoom.
    if (imgWrapRef.current) {
      const rect = imgWrapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    }
    setZoomed((z) => !z);
  };

  const onImageLeave = () => {
    if (zoomed) setZoomed(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          data-testid="product-gallery"
        >
          <div className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-black/10">
            <p className="font-tech text-[11px] tracking-[0.35em] text-black/70">
              GALERIE&nbsp;—&nbsp;{variant.name}
            </p>
            <div className="flex items-center gap-3">
              {canZoom && current.src && (
                <span
                  className="hidden sm:flex items-center gap-1.5 font-tech text-[9px] tracking-[0.3em] text-black/40"
                  data-testid="gallery-zoom-hint"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  CLIC&nbsp;POUR&nbsp;{zoomed ? "DÉZOOMER" : "ZOOMER"}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                data-testid="gallery-close-button"
                aria-label="Fermer la galerie"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-black/15 text-black/70 hover:border-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${variant.id}-${sel}`}
                className="relative flex items-center justify-center w-full h-full max-h-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {current.src ? (
                  <div
                    ref={imgWrapRef}
                    onClick={onImageClick}
                    onMouseMove={onImageMouseMove}
                    onMouseLeave={onImageLeave}
                    className="relative flex items-center justify-center w-full max-h-[62vh] overflow-hidden select-none"
                    style={{
                      cursor: canZoom
                        ? zoomed
                          ? "zoom-out"
                          : "zoom-in"
                        : "default",
                    }}
                    data-testid="gallery-main-wrap"
                  >
                    <img
                      src={current.src}
                      alt={`${variant.name} — ${current.label}`}
                      draggable="false"
                      className="max-h-[58vh] w-auto max-w-full object-contain select-none transition-transform duration-200 ease-out will-change-transform"
                      style={{
                        filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.18))",
                        transform: zoomed ? "scale(2)" : "scale(1)",
                        transformOrigin: `${origin.x}% ${origin.y}%`,
                      }}
                      data-testid="gallery-main-view"
                      data-zoomed={zoomed ? "1" : "0"}
                    />
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl aspect-[16/9] border border-dashed border-black/15 rounded-3xl text-center px-6"
                    data-testid="gallery-placeholder"
                  >
                    <ImageOff className="w-8 h-8 text-black/25" strokeWidth={1.5} />
                    <p className="font-tech text-[11px] tracking-[0.35em] text-black/45">
                      {current.label}
                    </p>
                    <p className="font-tech text-[9px] tracking-[0.3em] text-black/30">
                      IMAGE&nbsp;BIENTÔT&nbsp;DISPONIBLE&nbsp;—&nbsp;VIA&nbsp;SHOPIFY
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pb-10 pt-2 flex items-center justify-center gap-3 px-6 overflow-x-auto no-scrollbar">
            {variant.gallery.map((g, i) => (
              <button
                key={g.type}
                type="button"
                onClick={() => setSel(i)}
                data-testid={`gallery-thumb-${g.type}`}
                aria-label={g.label}
                className={`shrink-0 w-20 h-14 rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer ${
                  i === sel
                    ? "border-black bg-black/[0.04]"
                    : "border-black/15 opacity-70 hover:opacity-100 hover:border-black/40"
                }`}
              >
                {g.src ? (
                  <img
                    src={g.src}
                    alt={g.label}
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${variant.scale})` }}
                  />
                ) : (
                  <span className="font-tech text-[8px] tracking-[0.2em] text-black/40">
                    {g.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
