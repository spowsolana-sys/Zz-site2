import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { VETEMENTS, ACCESSOIRES } from "@/components/Header";

const SOCIALS = [
  { id: "instagram", label: "Instagram", d: "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" },
  { id: "tiktok", label: "TikTok", d: "M16.6 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.5 0-2.9-.5-4-1.3v5.9c0 3.8-2.7 6.4-6.2 6.4A5.9 5.9 0 0 1 4.5 14c0-3.4 2.6-5.9 6.1-5.9.3 0 .7 0 1 .1v2.8a3 3 0 0 0-1-.2 3 3 0 0 0-3.1 3.1 3 3 0 0 0 3.1 3.1c1.9 0 3.1-1.3 3.1-3.4V3h2.9Z" },
];

export default function Footer() {
  const { setOpen } = useCart();
  const { user } = useAuth();

  return (
    <footer className="relative border-t border-black/10 bg-white overflow-hidden">
      <div className="px-6 sm:px-10 pt-16 pb-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark className="w-10 h-10" />
              <div>
                <p className="font-brand text-sm font-extrabold tracking-[0.3em] text-black">
                  ZEV&nbsp;SHOP
                </p>
                <p className="font-tech text-[9px] tracking-[0.3em] text-black/40 mt-1">
                  MOVE&nbsp;DIFFERENT.
                </p>
              </div>
            </Link>
          </div>

          <div>
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35 mb-4">SHOP</p>
            <nav className="flex flex-col gap-2.5">
              <Link to="/catalogue" data-testid="footer-link-catalogue" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">CATALOGUE</Link>
              <Link to="/catalogue" data-testid="footer-link-nouveautes" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">NOUVEAUTÉS</Link>
              <Link to="/categorie/chaussures" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">CHAUSSURES</Link>
              <Link to="/categorie/vetements" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">VÊTEMENTS</Link>
              <Link to="/categorie/accessoires" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">ACCESSOIRES</Link>
            </nav>
          </div>

          <div>
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35 mb-4">AIDE</p>
            <nav className="flex flex-col gap-2.5">
              <Link to="/livraison" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">LIVRAISON</Link>
              <Link to="/retours" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">RETOURS</Link>
              <Link to="/suivi" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">SUIVI&nbsp;DE&nbsp;COMMANDE</Link>
              <Link to="/faq" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">FAQ</Link>
              <Link to="/contact" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">CONTACT</Link>
            </nav>
          </div>

          <div>
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35 mb-4">COMPTE</p>
            <nav className="flex flex-col gap-2.5">
              {user ? (
                <Link to="/compte" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">MON&nbsp;COMPTE</Link>
              ) : (
                <>
                  <Link to="/compte" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">SE&nbsp;CONNECTER</Link>
                  <Link to="/compte" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">CRÉER&nbsp;UN&nbsp;COMPTE</Link>
                </>
              )}
              <Link to="/compte" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">MES&nbsp;COMMANDES</Link>
              <Link to="/compte" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">WISHLIST</Link>
            </nav>
          </div>

          <div>
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35 mb-4">ZEV&nbsp;SHOP</p>
            <nav className="flex flex-col gap-2.5">
              <Link to="/a-propos" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">À&nbsp;PROPOS</Link>
              <Link to="/#newsletter" className="footer-link font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black transition-colors">NEWSLETTER</Link>
            </nav>
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35 mb-3 mt-6">
              RÉSEAUX&nbsp;SOCIAUX
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ id, label, d }) => (
                <a
                  key={id}
                  href="#"
                  title={`Ajouter le lien ${label}`}
                  aria-label={`Ajouter le lien ${label}`}
                  data-testid={`social-${id}`}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-black/15 text-black/60 hover:text-black hover:border-black transition-colors duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="font-tech text-[8px] tracking-[0.25em] text-black/30 mt-2">
              LIENS&nbsp;À&nbsp;DÉFINIR
            </p>
          </div>
        </div>

        <div className="mt-14 select-none pointer-events-none" aria-hidden="true">
          <p className="font-display font-extrabold uppercase text-outline text-[12vw] leading-none whitespace-nowrap">
            ZEV&nbsp;SHOP
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col lg:flex-row justify-between gap-3">
          <p className="font-tech text-[9px] tracking-[0.3em] text-black/35">
            © 2025 ZEV SHOP — TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1 font-tech text-[9px] tracking-[0.3em] text-black/35">
            <span>FRANÇAIS</span>
            <span>EUR</span>
            <span data-testid="legal-placeholder">
              INFORMATIONS&nbsp;LÉGALES&nbsp;—&nbsp;À&nbsp;DÉFINIR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
