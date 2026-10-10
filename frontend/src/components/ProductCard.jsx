import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { priceLabel } from "@/data/products";
import { useShoeTilt, ShoeFloat, ShoeTiltLayer } from "./ShoeMotion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

/* Même courbe que le ProductStage immersif pour une cohérence totale
   avec l'animation de transition entre coloris existante sur la fiche produit. */
const EASE = [0.65, 0, 0.35, 1];

/*
 * ProductCard — accepte deux modes :
 *   - group={groupObj}    : nouveau mode groupé (plusieurs variantes de coloris)
 *   - product={variantObj}: mode legacy (variante unique — utilisé par la wishlist)
 * En mode groupé : la carte affiche des pastilles de coloris sous l'image.
 * L'image bascule entre coloris via un carrousel vertical identique au ProductStage
 * (y: -135% → 0 → +135% sur 800 ms, cubic-bezier(0.65,0,0.35,1)).
 * Fond de l'image = gris très léger (#F5F5F5) pour mieux détacher les cartes.
 */
export default function ProductCard({ product, group, feature = false }) {
  const { user, wishlist, toggleWishlist } = useAuth();
  const tilt = useShoeTilt({ maxYaw: 8, maxPitch: 6 });
  const hoverScale = useTransform(tilt.hover, (v) => 1 + v * 0.04);
  const hoverY = useTransform(tilt.hover, (v) => v * -8);

  // Normalisation : si `product` fourni seul, on le traite comme un groupe d'une seule variante.
  const variants = useMemo(() => {
    if (group && Array.isArray(group.variants) && group.variants.length > 0) return group.variants;
    if (product) return [product];
    return [];
  }, [group, product]);

  const [activeId, setActiveId] = useState(variants[0]?.id);
  // Si la liste de variantes change (ex : filtre couleur dans Catalogue), on resynchronise.
  useEffect(() => {
    if (variants.length && !variants.some((v) => v.id === activeId)) {
      setActiveId(variants[0].id);
    }
  }, [variants, activeId]);

  const active = variants.find((v) => v.id === activeId) || variants[0];
  if (!active) return null;

  const multi = variants.length > 1;
  const wished = wishlist.includes(active.id);

  const onWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Créez un compte pour sauvegarder vos produits favoris.");
      return;
    }
    toggleWishlist(active.id).catch(() => toast.error("Erreur — réessayez"));
  };

  const onPickColor = (e, v) => {
    // On absorbe le clic pour que la pastille ne déclenche PAS la navigation vers la fiche produit.
    e.preventDefault();
    e.stopPropagation();
    if (v.id !== activeId) setActiveId(v.id);
  };

  // Index affiché : si groupé, index local au modèle (01/03). Sinon, l'index flat.
  const indexLabel =
    multi && active.groupIndex && active.groupCount
      ? `${active.groupIndex}\u00A0/\u00A0${active.groupCount}`
      : active.index
      ? `${active.index}`
      : null;

  // Nom du coloris : masquer les libellés génériques "Coloris 1/2/..." qui
  // n'apportent aucune information utile. Signalé à l'utilisateur pour qu'il
  // puisse fournir les vrais noms de coloris.
  const colorRaw = active.selectedOptions?.Color || "";
  const isGenericColor = /^\s*coloris\s*\d+\s*$/i.test(colorRaw);
  const colorLabel = isGenericColor ? null : colorRaw;

  return (
    <Link
      to={`/produit/${active.id}`}
      data-testid={`product-card-${active.id}`}
      className="group relative block overflow-hidden border border-black/10 bg-white transition-all duration-500 hover:border-black/40 hover:shadow-[0_24px_48px_rgba(0,0,0,0.07)]"
    >
      <button
        type="button"
        onClick={onWish}
        data-testid={`wishlist-heart-${active.id}`}
        aria-label="Ajouter à la wishlist"
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 backdrop-blur-sm border border-black/5 hover:border-black/25 hover:bg-white/90 transition-all duration-300 cursor-pointer"
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wished ? "fill-black text-black" : "text-black/45"}`} strokeWidth={1.75} />
      </button>

      {/* Zone image — fond gris très léger pour séparer visuellement les cartes.
          Shoe un peu plus grand sur mobile (×1.20) et desktop (×1.05) pour mieux
          mettre en valeur le produit sans jamais couper (overflow-hidden absorbe
          la marge transparente des PNG). */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[#F5F5F5] ${
          feature ? "aspect-[16/9]" : "aspect-[4/3] sm:aspect-[3/2]"
        }`}
      >
        <div
          className="absolute w-[75%] h-[75%] rounded-full transition-transform duration-700 group-hover:scale-110 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
          }}
        />
        {/* présentation premium 2.5D : lévitation idle subtile + inclinaison curseur */}
        <div
          className="relative w-full h-full scale-[1.20] sm:scale-[1.05]"
          {...tilt.bind}
          style={{ perspective: 900 }}
        >
          <ShoeFloat
            amplitude={4}
            rotate={0.5}
            breathe={0.006}
            duration={6.5}
            className="absolute inset-0"
          >
            <ShoeTiltLayer tilt={tilt} hoverScale={0} className="w-full h-full">
              <motion.div className="relative w-full h-full" style={{ scale: hoverScale, y: hoverY }}>
                {/* Carrousel vertical — identique à l'animation ProductStage. */}
                <AnimatePresence>
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ y: "-135%", scale: 0.94, opacity: 0 }}
                    animate={{
                      y: "0%",
                      scale: 1,
                      opacity: 1,
                      transition: {
                        y: { duration: 0.8, ease: EASE },
                        scale: { duration: 0.8, ease: EASE },
                        opacity: { duration: 0.3, ease: "easeOut" },
                      },
                    }}
                    exit={{
                      y: "135%",
                      scale: 0.96,
                      opacity: 0,
                      transition: {
                        y: { duration: 0.8, ease: EASE },
                        scale: { duration: 0.8, ease: EASE },
                        opacity: { duration: 0.3, delay: 0.5, ease: "easeIn" },
                      },
                    }}
                    data-testid={`product-card-image-${active.id}`}
                  >
                    <div
                      className="w-full h-full"
                      style={{ transform: `scale(${active.scale}) translateY(${active.shiftY})` }}
                    >
                      <img
                        src={active.image}
                        alt={`ZEV SHOP — ${active.name}`}
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        className="relative w-full h-full object-contain select-none pointer-events-none will-change-transform"
                        style={{ filter: `drop-shadow(0 24px 22px ${active.glow})` }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </ShoeTiltLayer>
          </ShoeFloat>
        </div>
        {indexLabel && (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-5 font-tech text-[9px] sm:text-[10px] font-medium tracking-[0.12em] sm:tracking-[0.18em] text-black/35">
            {indexLabel}
          </span>
        )}
        <span className="hidden sm:flex absolute top-4 right-5 items-center gap-1.5 font-tech text-[10px] font-semibold tracking-[0.2em] text-black/70 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          VOIR
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="px-2.5 py-2.5 sm:px-5 sm:py-4 border-t border-black/10">
        <h3 className="font-tech text-[12.5px] sm:text-[15px] font-extrabold text-black leading-[1.15] sm:leading-tight line-clamp-2 sm:line-clamp-none sm:truncate tracking-[-0.01em]">
          {active.productTitle}
        </h3>
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
          {colorLabel ? (
            <p className="font-tech text-[10px] sm:text-[11px] font-medium tracking-[0.02em] text-black/50 uppercase truncate">
              {colorLabel}
            </p>
          ) : (
            <span aria-hidden="true" />
          )}
          <p
            className="font-tech text-[11px] sm:text-[12px] font-semibold tracking-[0.02em] text-black shrink-0"
            data-testid={`product-card-price-${active.id}`}
          >
            {priceLabel(active)}
          </p>
        </div>

        {/* Pastilles de coloris — plates (couleur fidèle, sans brillance),
            bordure fine. Mobile : point visible ~11 px dans une zone tactile
            ~44 px (padding). Desktop : 24 px. */}
        {multi && (
          <div
            className="flex items-center gap-0.5 sm:gap-2.5 mt-1.5 sm:mt-3.5 flex-wrap -ml-2 sm:ml-0"
            data-testid={`product-card-swatches-${active.productHandle}`}
          >
            {variants.map((v) => {
              const isActive = v.id === active.id;
              const dotColor = v.swatchFlat || v.swatch;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => onPickColor(e, v)}
                  aria-label={`Choisir ${v.selectedOptions.Color}`}
                  aria-pressed={isActive}
                  data-testid={`product-card-swatch-${v.id}`}
                  className="relative flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 hover:scale-110 focus:outline-none p-2 sm:p-0 sm:w-6 sm:h-6"
                  style={{ touchAction: "manipulation" }}
                >
                  <span
                    aria-hidden="true"
                    className="block w-[11px] h-[11px] sm:w-full sm:h-full rounded-full"
                    style={{
                      background: dotColor,
                      boxShadow: isActive
                        ? "0 0 0 1px #fff, 0 0 0 1.5px #0A0A0A"
                        : "inset 0 0 0 1px rgba(0,0,0,0.18)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
