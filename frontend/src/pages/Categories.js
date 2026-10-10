import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { GROUPED_PRODUCTS } from "@/data/products";
import { VETEMENTS, ACCESSOIRES } from "@/components/Header";

const EASE = [0.16, 1, 0.3, 1];

const TITLES = Object.fromEntries(
  [...VETEMENTS, ...ACCESSOIRES].map((c) => [c.slug, c.label]),
);

export default function CategoryPage() {
  const { slug } = useParams();
  const title = (TITLES[slug] || slug).toUpperCase();
  const isChaussures = slug === "chaussures";

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 sm:px-10 max-w-[1400px] mx-auto">
      <header className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-tech text-[10px] tracking-[0.45em] text-black/45"
        >
          ZEV&nbsp;SHOP&nbsp;—&nbsp;CATÉGORIE
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="font-display font-extrabold uppercase text-3xl sm:text-5xl mt-4 text-black leading-none"
          data-testid="category-title"
        >
          {title}
        </motion.h1>
      </header>

      {isChaussures ? (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-tech text-[10px] tracking-[0.35em] text-black/35 mt-5 text-center"
          >
            COLLECTION&nbsp;SNEAKERS&nbsp;//&nbsp;TOUS&nbsp;LES&nbsp;MODÈLES
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-14">
            {GROUPED_PRODUCTS.filter((g) => g.productType === "SNEAKERS").map((g, i) => (
              <motion.div
                key={g.handle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: EASE }}
              >
                <ProductCard group={g} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="mt-16 border border-black/10 rounded-3xl py-24 px-8 text-center"
          data-testid="category-empty"
        >
          <p className="font-tech text-[11px] tracking-[0.35em] text-black/50">
            CETTE&nbsp;CATÉGORIE&nbsp;ARRIVE&nbsp;BIENTÔT.
          </p>
          <Link
            to="/catalogue"
            className="inline-block mt-8 font-tech text-[11px] tracking-[0.3em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
          >
            VOIR&nbsp;LE&nbsp;CATALOGUE
          </Link>
        </motion.div>
      )}
    </div>
  );
}
