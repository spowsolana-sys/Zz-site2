import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X, ChevronDown, Search, User, Globe } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { PRODUCTS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

export const VETEMENTS = [
  { slug: "t-shirts", label: "T-shirts" },
  { slug: "pantalons", label: "Pantalons" },
  { slug: "sweats-a-capuche", label: "Sweats à capuche" },
  { slug: "ensembles", label: "Ensembles" },
  { slug: "pulls", label: "Pulls" },
  { slug: "shorts", label: "Shorts" },
  { slug: "shorts-de-bain", label: "Shorts de bain" },
];

export const ACCESSOIRES = [
  { slug: "chaussures", label: "Chaussures" },
  { slug: "sacoches", label: "Sacoches" },
  { slug: "claquettes", label: "Claquettes" },
  { slug: "bonnets", label: "Bonnets" },
  { slug: "casquettes", label: "Casquettes" },
  { slug: "lunettes", label: "Lunettes" },
  { slug: "bracelets", label: "Bracelets" },
];

function Dropdown({ label, items, light = false }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className={`nav-underline flex items-center gap-1.5 font-tech text-[11px] tracking-[0.25em] transition-colors duration-200 py-2 cursor-pointer ${
          light ? "text-white/75 group-hover:text-white" : "text-black/60 group-hover:text-[#8E1721]"
        }`}
      >
        {label}
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
        <div className="bg-white border border-black/10 shadow-[0_24px_48px_rgba(0,0,0,0.08)] p-3 min-w-[230px] rounded-2xl">
          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <Link
                key={item.slug}
                to={`/categorie/${item.slug}`}
                data-testid={`nav-sub-${item.slug}`}
                className="block px-4 py-2 rounded-full bg-[#F3F4F6] hover:bg-[#8E1721] font-tech text-[11px] tracking-[0.2em] text-black/65 hover:text-white transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniSelect({ icon: Icon, value, options, testid, light = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid={testid}
        aria-label={`${testid} — ${value}`}
        className={`flex items-center gap-1 font-tech text-[11px] tracking-[0.15em] transition-colors cursor-pointer ${
          light ? "text-white/75 hover:text-white" : "text-black/60 hover:text-black"
        }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{value}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-black/10 shadow-[0_24px_48px_rgba(0,0,0,0.08)] py-2 min-w-[180px]">
            {options.map((o) => (
              <div
                key={o.label}
                className={`px-5 py-2 font-tech text-[10px] tracking-[0.2em] ${
                  o.active ? "text-black" : "text-black/40"
                }`}
              >
                {o.label}
                {!o.active && (
                  <span className="block text-[8px] text-black/30 mt-0.5">
                    Bientôt disponible
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-testid="search-overlay"
        >
          <div className="max-w-2xl mx-auto pt-28 px-6">
            <div className="flex items-center gap-4 border-b border-black pb-3">
              <Search className="w-5 h-5 text-black/50" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un produit…"
                data-testid="search-input"
                className="flex-1 font-tech text-sm tracking-[0.15em] text-black placeholder:text-black/35 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={onClose}
                data-testid="search-close-button"
                aria-label="Fermer la recherche"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-black/15 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-1">
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/produit/${p.id}`);
                  }}
                  data-testid={`search-result-${p.id}`}
                  className="flex items-center gap-4 p-3 text-left hover:bg-black/[0.03] rounded-xl transition-colors cursor-pointer"
                >
                  <img src={p.image} alt={p.name} className="w-16 h-11 object-contain" />
                  <div>
                    <p className="font-display text-xs font-bold text-black">{p.name}</p>
                    <p className="font-tech text-[9px] tracking-[0.25em] text-black/40 mt-1">
                      SNEAKERS&nbsp;—&nbsp;TN
                    </p>
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <p className="font-tech text-[11px] tracking-[0.2em] text-black/40 py-6">
                  Aucun résultat. De nouveaux produits arriveront bientôt.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [atTop, setAtTop] = useState(true);

  // Mode immersif : transparent uniquement en haut de la page d'accueil
  // (campagne plein écran) ; blanc/opaque au scroll et sur les autres pages.
  const immersive = pathname === "/" && atTop && !menuOpen;

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // petite animation du compteur panier à l'ajout
  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      {/* emplacement bannière promotionnelle — contenu réel actuel */}
      <div className="fixed top-0 inset-x-0 z-50 h-8 bg-black text-white flex items-center justify-center">
        <p className="font-tech text-[9px] tracking-[0.4em]" data-testid="promo-banner">
          LIVRAISON&nbsp;STANDARD&nbsp;ESTIMÉE&nbsp;—&nbsp;7&nbsp;À&nbsp;12&nbsp;JOURS
        </p>
      </div>

      <header
        className={`fixed top-8 inset-x-0 z-50 h-20 flex items-center justify-between px-6 sm:px-10 border-b transition-colors duration-500 ${
          immersive
            ? "bg-transparent backdrop-blur-none border-transparent"
            : "bg-white/85 backdrop-blur-xl border-black/5"
        }`}
        data-testid="site-header"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            data-testid="mobile-menu-open"
            aria-label="Ouvrir le menu"
            className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-500 cursor-pointer ${
              immersive ? "border-white/30 text-white" : "border-black/15 text-black/80"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" data-testid="brand-logo" className="flex items-center gap-3">
            <LogoMark className="w-9 h-9" variant={immersive ? "light" : "dark"} />
            <span
              className={`font-brand text-sm font-extrabold tracking-[0.25em] transition-colors duration-500 ${
                immersive ? "text-white" : "text-black"
              }`}
            >
              ZEV&nbsp;SHOP
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-9">
          <NavLink
            to="/catalogue"
            data-testid="nav-link-catalogue"
            className={({ isActive }) =>
              `nav-underline font-tech text-[11px] tracking-[0.25em] py-2 transition-colors duration-200 ${
                isActive
                  ? immersive
                    ? "text-white nav-underline-active"
                    : "text-[#8E1721] nav-underline-active"
                  : immersive
                    ? "text-white/75 hover:text-white"
                    : "text-black/60 hover:text-[#8E1721]"
              }`
            }
          >
            CATALOGUE
          </NavLink>
          <Dropdown label="VÊTEMENTS" items={VETEMENTS} light={immersive} />
          <Dropdown label="ACCESSOIRES" items={ACCESSOIRES} light={immersive} />
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            data-testid="search-open-button"
            aria-label="Rechercher"
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-500 cursor-pointer ${
              immersive ? "text-white/75 hover:text-white" : "text-black/70 hover:text-black"
            }`}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          <Link
            to="/compte"
            data-testid="account-link"
            aria-label="Compte client"
            className={`hidden sm:flex items-center gap-2 font-tech text-[11px] tracking-[0.2em] transition-colors duration-500 ${
              immersive ? "text-white/75 hover:text-white" : "text-black/70 hover:text-black"
            }`}
          >
            <User className="w-[18px] h-[18px]" />
            <span className="hidden lg:inline">
              {user ? user.name.split(" ")[0].toUpperCase() : "COMPTE"}
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <MiniSelect
              icon={Globe}
              value="FR"
              testid="lang-select"
              light={immersive}
              options={[
                { label: "Français", active: true },
                { label: "English", active: false },
                { label: "Español", active: false },
              ]}
            />
            <MiniSelect
              icon={null}
              value="EUR"
              testid="currency-select"
              light={immersive}
              options={[
                { label: "EUR €", active: true },
                { label: "USD $", active: false },
                { label: "GBP £", active: false },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-testid="cart-open-button"
            aria-label="Ouvrir le panier"
            className={`relative flex items-center gap-2 h-11 px-4 rounded-full border transition-colors duration-500 cursor-pointer font-tech text-[11px] tracking-[0.2em] ${
              immersive ? "border-white/30 text-white hover:border-white" : "border-black/15 text-black/80 hover:border-black/40"
            }`}
          >
            <ShoppingBag className="w-[16px] h-[16px]" />
            <span className="hidden sm:inline">CART</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: bump ? 1.35 : 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                data-testid="cart-count"
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#8E1721] text-white font-tech text-[10px] font-bold"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
            data-testid="mobile-menu"
          >
            <div className="h-16 mt-8 flex items-center justify-between px-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <LogoMark className="w-9 h-9" />
                <span className="font-brand text-sm font-extrabold tracking-[0.25em]">
                  ZEV&nbsp;SHOP
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-menu-close"
                aria-label="Fermer le menu"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-black/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-8 flex flex-col gap-8">
              <Link
                to="/catalogue"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-extrabold tracking-wide"
              >
                CATALOGUE
              </Link>
              <div>
                <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mb-3">
                  VÊTEMENTS
                </p>
                <div className="flex flex-wrap gap-2">
                  {VETEMENTS.map((i) => (
                    <Link
                      key={i.slug}
                      to={`/categorie/${i.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] active:bg-[#8E1721] active:text-white font-tech text-[11px] tracking-[0.15em] text-black/65 transition-colors"
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mb-3">
                  ACCESSOIRES
                </p>
                <div className="flex flex-wrap gap-2">
                  {ACCESSOIRES.map((i) => (
                    <Link
                      key={i.slug}
                      to={`/categorie/${i.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] active:bg-[#8E1721] active:text-white font-tech text-[11px] tracking-[0.15em] text-black/65 transition-colors"
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/compte"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-extrabold tracking-wide"
              >
                COMPTE
              </Link>
              <Link
                to="/suivi"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-extrabold tracking-wide"
              >
                SUIVI&nbsp;DE&nbsp;COMMANDE
              </Link>
              <div className="flex items-center gap-5 font-tech text-[11px] tracking-[0.2em] text-black/50">
                <span>FR</span>
                <span>EUR</span>
                <span className="text-black/25">Langue &amp; devise — à définir</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
