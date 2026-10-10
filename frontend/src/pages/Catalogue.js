import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { GROUPED_PRODUCTS, BRANDS, SIZES } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

/* Styles pills unifiés — fond gris perle #F3F4F6 (idle), rouge grenat
   #8E1721 pour les filtres actifs (couleur d'accent ZEV SHOP). */
const PILL_BASE =
  "inline-flex items-center justify-center font-tech font-semibold tracking-[0.1em] rounded-full transition-colors duration-200 cursor-pointer select-none";
const PILL_IDLE =
  "bg-[#F3F4F6] text-black/60 hover:bg-[#E5E7EB] hover:text-black";
const PILL_ACTIVE = "bg-[#8E1721] text-white hover:bg-[#761019]";

const SORTS = [
  { id: "pertinence", label: "Pertinence" },
  { id: "nouveautes", label: "Nouveautés" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "ventes", label: "Meilleures ventes" },
];

export default function Catalogue() {
  const [fBrands, setFBrands] = useState([]); // tableau extensible : plusieurs marques possibles
  const [fSize, setFSize] = useState(null);
  const [fAvail, setFAvail] = useState(false);
  const [sort, setSort] = useState("pertinence");
  const [showFilters, setShowFilters] = useState(false);

  const toggleBrand = (brand) =>
    setFBrands((bs) => (bs.includes(brand) ? bs.filter((b) => b !== brand) : [...bs, brand]));

  // Grouped products — chaque entrée = un modèle avec toutes ses variantes de coloris.
  // Le filtrage s'applique au niveau du groupe : on garde un groupe si au moins
  // une variante satisfait les filtres actifs.
  const groups = useMemo(() => {
    let list = [...GROUPED_PRODUCTS];
    if (fBrands.length > 0) {
      list = list.filter((g) => g.brand && fBrands.includes(g.brand));
    }
    if (fAvail) {
      list = list
        .map((g) => {
          const matches = g.variants.filter((v) => v.available);
          return matches.length ? { ...g, variants: matches } : null;
        })
        .filter(Boolean);
    }
    if (fSize) list = list; // toutes les tailles 40-46 sont disponibles
    if (sort === "prix-asc" || sort === "prix-desc") {
      // tri par prix inactif tant que les prix ne sont pas définis
      list = list;
    }
    return list;
  }, [fBrands, fSize, fAvail, sort]);

  const priceSortInactive = sort === "prix-asc" || sort === "prix-desc" || sort === "ventes";
  const totalCount = groups.length;
  const activeFilterCount = fBrands.length + (fSize ? 1 : 0) + (fAvail ? 1 : 0);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 sm:px-10 max-w-[1400px] mx-auto">
      <header className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-tech text-[11px] font-semibold tracking-[0.3em] text-black/45"
        >
          BOUTIQUE&nbsp;ZEV&nbsp;SHOP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="font-display font-extrabold uppercase text-[2.25rem] sm:text-5xl lg:text-6xl mt-4 text-black leading-[0.95]"
          data-testid="catalogue-title"
        >
          NOTRE<br className="sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">&nbsp;</span>SÉLECTION
        </motion.h1>
      </header>

      {/* barre filtres + tri */}
      <div className="flex items-center justify-between gap-4 mt-12 sm:mt-16 border-y border-black/10 py-4">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          data-testid="filters-toggle"
          aria-expanded={showFilters}
          className="inline-flex items-center gap-2.5 font-tech text-[11px] font-semibold tracking-[0.14em] text-black/70 hover:text-black px-3 py-2.5 -ml-3 rounded-lg hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.9} />
          FILTRES
          {activeFilterCount > 0 && (
            <span
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#8E1721] text-white text-[9px] font-bold tracking-normal"
              data-testid="filters-active-count"
            >
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-tech text-[9px] tracking-[0.3em] text-black/35">
            TRI&nbsp;—
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            data-testid="sort-select"
            className="font-tech text-[10px] tracking-[0.2em] text-black/70 border border-transparent bg-[#F3F4F6] rounded-full px-4 py-2 hover:bg-[#E5E7EB] focus:outline-none focus:border-black cursor-pointer transition-colors"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid sm:grid-cols-3 gap-8 mt-8 bg-[#FAFAFB] rounded-3xl p-6"
          data-testid="filters-panel"
        >
          <div>
            <p className="font-tech text-[10px] font-semibold tracking-[0.2em] text-black/50 mb-3">MARQUES</p>
            <div className="flex items-center gap-2 flex-wrap">
              {BRANDS.map((b) => {
                const active = fBrands.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBrand(b)}
                    data-testid={`filter-brand-${b.toLowerCase()}`}
                    aria-pressed={active}
                    className={`${PILL_BASE} text-[10px] px-4 py-1.5 ${active ? PILL_ACTIVE : PILL_IDLE}`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="font-tech text-[10px] font-semibold tracking-[0.2em] text-black/50 mb-3">TAILLE</p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setFSize(null)}
                data-testid="filter-size-all"
                className={`${PILL_BASE} text-[10px] px-3 py-1.5 ${!fSize ? PILL_ACTIVE : PILL_IDLE}`}
              >
                TOUTES
              </button>
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFSize(s)}
                  data-testid={`filter-size-${s}`}
                  className={`${PILL_BASE} text-[10px] w-9 h-8 tracking-normal ${fSize === s ? PILL_ACTIVE : PILL_IDLE}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-tech text-[10px] font-semibold tracking-[0.2em] text-black/50 mb-3">DISPONIBILITÉ</p>
            <button
              type="button"
              onClick={() => setFAvail((a) => !a)}
              data-testid="filter-availability"
              aria-pressed={fAvail}
              className={`${PILL_BASE} text-[10px] px-4 py-1.5 ${fAvail ? PILL_ACTIVE : PILL_IDLE}`}
            >
              EN&nbsp;STOCK&nbsp;UNIQUEMENT
            </button>
            <p className="font-tech text-[9px] tracking-[0.2em] text-black/30 mt-4 leading-relaxed">
              Filtres prix &amp; matière : à définir (à la connexion Shopify).
            </p>
          </div>
        </motion.div>
      )}

      {priceSortInactive && groups.length > 0 && (
        <p className="font-tech text-[9px] tracking-[0.25em] text-black/35 mt-4 text-center" data-testid="sort-note">
          Tri par prix / ventes : à définir — les prix ne le sont pas encore.
        </p>
      )}

      {/* grille produits — groupés par modèle, swatches dans chaque carte */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-12" data-testid="catalogue-grid">
        {groups.map((g, i) => (
          <motion.div
            key={g.handle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: EASE }}
          >
            <ProductCard group={g} />
          </motion.div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="mt-16 border border-dashed border-black/15 rounded-3xl py-20 px-8 text-center" data-testid="catalogue-empty">
          <p className="font-tech text-[11px] tracking-[0.25em] text-black/45">
            Aucun produit ne correspond aux filtres actuellement sélectionnés.
          </p>
          <button
            type="button"
            onClick={() => { setFBrands([]); setFSize(null); setFAvail(false); }}
            className="mt-8 font-tech text-[10px] font-semibold tracking-[0.2em] text-[#8E1721] border-b border-[#8E1721] pb-1 hover:opacity-70 transition-opacity cursor-pointer"
          >
            RÉINITIALISER&nbsp;LES&nbsp;FILTRES
          </button>
        </div>
      )}
    </div>
  );
}
