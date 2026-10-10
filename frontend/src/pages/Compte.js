import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Package, Heart, MapPin, Gift, LogOut, Plus, Trash2 } from "lucide-react";
import { api, formatApiError } from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const EASE = [0.16, 1, 0.3, 1];

/* ---------- Formulaires auth ---------- */

function AuthForms() {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Bienvenue !");
        navigate("/compte");
      } else if (mode === "register") {
        await register(name, email, password);
        toast.success("Compte créé — bienvenue chez ZEV SHOP");
        navigate("/compte");
      } else {
        await api("/auth/forgot-password", { method: "POST", body: { email } });
        toast.success("Si un compte existe, un lien de réinitialisation a été envoyé.");
        setMode("login");
      }
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto" data-testid="auth-forms">
      <div className="flex justify-center gap-8 mb-10">
        {[
          { id: "login", label: "CONNEXION" },
          { id: "register", label: "CRÉER UN COMPTE" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            data-testid={`auth-tab-${t.id}`}
            className={`font-tech text-[10px] tracking-[0.3em] pb-1 border-b transition-all cursor-pointer ${
              mode === t.id ? "text-black border-black" : "text-black/40 border-transparent hover:text-black/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4" data-testid={`form-${mode}`}>
        {mode === "register" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom / prénom"
            required
            data-testid="auth-name-input"
            className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          data-testid="auth-email-input"
          className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
        />
        {mode !== "forgot" && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "Mot de passe (8 caractères min.)" : "Mot de passe"}
            required
            minLength={mode === "register" ? 8 : 1}
            data-testid="auth-password-input"
            className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
        )}
        <button
          type="submit"
          disabled={busy}
          data-testid="auth-submit-button"
          className="h-14 font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50 mt-2"
        >
          {mode === "login" ? "SE CONNECTER" : mode === "register" ? "CRÉER MON COMPTE" : "ENVOYER LE LIEN"}
        </button>
      </form>

      <div className="text-center mt-6">
        {mode === "login" ? (
          <button
            type="button"
            onClick={() => setMode("forgot")}
            data-testid="forgot-link"
            className="font-tech text-[10px] tracking-[0.25em] text-black/45 hover:text-black underline underline-offset-4 cursor-pointer"
          >
            Mot de passe oublié ?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMode("login")}
            data-testid="back-login-link"
            className="font-tech text-[10px] tracking-[0.25em] text-black/45 hover:text-black underline underline-offset-4 cursor-pointer"
          >
            Retour à la connexion
          </button>
        )}
      </div>

      {/* Avantages du compte */}
      <div className="mt-12 border border-black/10 rounded-3xl p-6">
        <p className="font-tech text-[9px] tracking-[0.35em] text-black/40 mb-3">
          POURQUOI CRÉER UN COMPTE ?
        </p>
        <ul className="font-tech text-[10px] tracking-[0.1em] text-black/55 leading-loose list-disc list-inside">
          <li>Historique de vos commandes</li>
          <li>Wishlist pour sauvegarder vos favoris</li>
          <li>Suivi de commande simplifié</li>
          <li>Informations sauvegardées</li>
          <li>Programme de récompense : 1 000 € d'achats → coupon de 100 €</li>
        </ul>
        <p className="font-tech text-[9px] tracking-[0.2em] text-black/35 mt-4">
          Vous pouvez aussi commander en invité, puis créer un compte plus tard.
        </p>
      </div>
    </div>
  );
}

/* ---------- Dashboard connecté ---------- */

function Dashboard() {
  const { user, logout, wishlist } = useAuth();
  const { add } = useCart();
  const [tab, setTab] = useState("profil");
  const [rewards, setRewards] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addr, setAddr] = useState({ label: "Domicile", full_name: user?.name || "", line1: "", line2: "", city: "", zip: "", country: "France", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    api("/account/rewards").then(setRewards).catch(() => {});
    api("/account/addresses").then((d) => setAddresses(d.addresses)).catch(() => {});
  }, []);

  const wishProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const a = await api("/account/addresses", { method: "POST", body: addr });
      setAddresses((prev) => [...prev, a]);
      setShowAddressForm(false);
      toast.success("Adresse enregistrée");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const removeAddress = async (id) => {
    try {
      await api(`/account/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const TABS = [
    { id: "profil", label: "PROFIL", icon: User },
    { id: "commandes", label: "COMMANDES", icon: Package },
    { id: "wishlist", label: "WISHLIST", icon: Heart },
    { id: "adresses", label: "ADRESSES", icon: MapPin },
    { id: "recompense", label: "RÉCOMPENSE", icon: Gift },
  ];

  return (
    <div data-testid="account-dashboard">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            data-testid={`account-tab-${id}`}
            className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] pb-1 border-b transition-all cursor-pointer ${
              tab === id ? "text-black border-black" : "text-black/40 border-transparent hover:text-black/70"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "profil" && (
        <div className="max-w-md mx-auto text-center" data-testid="account-profil">
          <p className="font-display text-2xl font-extrabold text-black">{user.name}</p>
          <p className="font-tech text-[11px] tracking-[0.2em] text-black/50 mt-2">{user.email}</p>
          <button
            type="button"
            onClick={async () => { await logout(); toast.success("À bientôt !"); navigate("/"); }}
            data-testid="logout-button"
            className="mt-10 inline-flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] text-black border border-black/25 rounded-full px-7 py-3 hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            DÉCONNEXION
          </button>
        </div>
      )}

      {tab === "commandes" && (
        <div className="max-w-2xl mx-auto border border-dashed border-black/15 rounded-3xl py-16 px-8 text-center" data-testid="account-commandes">
          <p className="font-tech text-[11px] tracking-[0.25em] text-black/45">
            Aucune commande pour le moment.
          </p>
          <p className="font-tech text-[10px] tracking-[0.2em] text-black/35 mt-3">
            L'historique s'affichera automatiquement — structure prête pour Shopify.
          </p>
        </div>
      )}

      {tab === "wishlist" && (
        <div data-testid="account-wishlist">
          {wishProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {wishProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="font-tech text-[11px] tracking-[0.2em] text-black/45 text-center border border-dashed border-black/15 rounded-3xl py-16">
              Votre wishlist est vide. Touchez le cœur sur un produit pour le sauvegarder.
            </p>
          )}
        </div>
      )}

      {tab === "adresses" && (
        <div className="max-w-2xl mx-auto" data-testid="account-adresses">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between border border-black/10 rounded-2xl p-5 mb-3">
              <div>
                <p className="font-tech text-[9px] tracking-[0.3em] text-black/40">{a.label}</p>
                <p className="font-tech text-[11px] tracking-[0.1em] text-black/70 mt-2">
                  {a.full_name} — {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.zip} {a.city}, {a.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAddress(a.id)}
                aria-label="Supprimer l'adresse"
                data-testid={`address-remove-${a.id}`}
                className="text-black/40 hover:text-black cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {showAddressForm ? (
            <form onSubmit={addAddress} className="grid sm:grid-cols-2 gap-3 mt-6">
              {[
                { k: "full_name", ph: "Nom complet" },
                { k: "line1", ph: "Adresse" },
                { k: "line2", ph: "Complément (optionnel)" },
                { k: "city", ph: "Ville" },
                { k: "zip", ph: "Code postal" },
                { k: "country", ph: "Pays" },
                { k: "phone", ph: "Téléphone (optionnel)" },
              ].map(({ k, ph }) => (
                <input
                  key={k}
                  type="text"
                  value={addr[k] || ""}
                  onChange={(e) => setAddr({ ...addr, [k]: e.target.value })}
                  placeholder={ph}
                  required={["full_name", "line1", "city", "zip", "country"].includes(k)}
                  data-testid={`address-${k}`}
                  className="h-12 px-5 font-tech text-[10px] tracking-[0.1em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black"
                />
              ))}
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" data-testid="address-save" className="flex-1 h-12 font-tech text-[10px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 cursor-pointer">
                  ENREGISTRER
                </button>
                <button type="button" onClick={() => setShowAddressForm(false)} data-testid="address-cancel" className="flex-1 h-12 font-tech text-[10px] tracking-[0.3em] text-black border border-black/20 rounded-full hover:border-black cursor-pointer">
                  ANNULER
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              data-testid="address-add-button"
              className="mt-4 inline-flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] text-black border border-black/25 rounded-full px-6 py-3 hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              AJOUTER&nbsp;UNE&nbsp;ADRESSE
            </button>
          )}
        </div>
      )}

      {tab === "recompense" && (
        <div className="max-w-xl mx-auto text-center" data-testid="account-recompense">
          <Gift className="w-8 h-8 text-black/60 mx-auto" strokeWidth={1.5} />
          <h3 className="font-display font-extrabold text-xl mt-6 text-black">
            Progression vers votre récompense
          </h3>
          {rewards && (
            <>
              <p className="font-tech text-[12px] tracking-[0.2em] text-black/70 mt-6" data-testid="rewards-progress">
                {rewards.spent} € / {rewards.threshold} €
              </p>
              <div className="h-2 bg-black/10 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (rewards.spent / rewards.threshold) * 100)}%` }}
                  transition={{ duration: 1, ease: EASE }}
                />
              </div>
              <p className="font-tech text-[10px] tracking-[0.2em] text-black/50 mt-6 leading-relaxed">
                {rewards.reached
                  ? `Félicitations, vous avez obtenu un coupon de ${rewards.coupon} €.`
                  : `À partir de ${rewards.threshold} € d'achats cumulés, vous recevez un coupon de ${rewards.coupon} €.`}
              </p>
              <p className="font-tech text-[9px] tracking-[0.2em] text-black/35 mt-3">
                {rewards.guest_note}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Compte() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-4xl mx-auto">
      <header className="text-center mb-14">
        <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">ESPACE&nbsp;CLIENT</p>
        <h1 className="font-display font-extrabold uppercase text-3xl sm:text-5xl mt-4 text-black" data-testid="compte-title">
          {user ? "Mon compte" : "Compte client"}
        </h1>
      </header>
      {user === undefined ? (
        <p className="text-center font-tech text-[11px] tracking-[0.3em] text-black/40 py-24">
          CHARGEMENT…
        </p>
      ) : user ? (
        <Dashboard />
      ) : (
        <AuthForms />
      )}
    </div>
  );
}
