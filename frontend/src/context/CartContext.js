import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";

const CartContext = createContext(null);

/**
 * Grille tarifaire livraison France — fournie par le responsable ZEV SHOP.
 * - < 50 €               : 5,00 €
 * - [50 € ; 100 €)       : 2,50 €
 * - ≥ 100 €              : offerte
 * Seuil calculé sur le sous-total HT livraison (après remises éventuelles).
 * Délai annoncé : 7 à 12 jours — jamais raccourci dans l'interface.
 */
export const SHIPPING_RULES = [
  { threshold: 100, fee: 0 },
  { threshold: 50, fee: 2.5 },
  { threshold: 0, fee: 5 },
];

export function computeShipping(subtotal) {
  for (const r of SHIPPING_RULES) {
    if (subtotal >= r.threshold) return r.fee;
  }
  return 5;
}

export function CartProvider({ children }) {
  // Persistance locale : le panier survit aux rechargements
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zev-cart")) || [];
    } catch (e) {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("zev-cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const add = (variantId, size) => {
    const key = `${variantId}-${size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found)
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { key, variantId, size, qty: 1 }];
    });
    setOpen(true);
  };

  const setQty = (key, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  };

  const remove = (key) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  /* Totaux — calculés à partir des prix réels des variantes.
     Si une seule variante n'a pas encore de prix (Shopify non branché),
     `allPriced` reste faux et on affiche "Prix à définir" partout. */
  const totals = useMemo(() => {
    let subtotal = 0;
    let allPriced = items.length > 0;
    for (const item of items) {
      const p = PRODUCTS.find((pr) => pr.id === item.variantId);
      const price = p && p.price;
      if (price && typeof price === "object" && price.amount !== undefined && price.amount !== null) {
        subtotal += Number(price.amount) * item.qty;
      } else {
        allPriced = false;
      }
    }
    const shipping = allPriced ? computeShipping(subtotal) : null;
    const grandTotal = allPriced ? subtotal + shipping : null;
    return { subtotal, shipping, grandTotal, allPriced };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, add, setQty, remove, count, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
