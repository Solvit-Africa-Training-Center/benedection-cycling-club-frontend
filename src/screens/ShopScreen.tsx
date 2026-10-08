"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Category = "All items" | "Jerseys" | "Shorts" | "Glasses" | "Gloves" | "Socks" | "Helmet";

type Product = {
  name: string;
  price: number;
  category: Exclude<Category, "All items">;
  image: string;
  sizes: string[];
  filter?: string;
};

const categories: Category[] = [
  "All items",
  "Jerseys",
  "Shorts",
  "Glasses",
  "Gloves",
  "Socks",
  "Helmet",
];

const products: Product[] = [
  {
    name: "Pro Race Aero Jersey 2026",
    price: 140,
    category: "Jerseys",
    image: "/Rectangle%2047.png",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Elite Endurance Bib Shorts",
    price: 135,
    category: "Shorts",
    image: "/Article%20-%20Product%206_%20Windstopper%20Gilet.png",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Aero Polarized Sunglasses",
    price: 32,
    category: "Glasses",
    image: "/Rectangle%2049.png",
    sizes: ["One size"],
    filter: "CAT 3 Mirrored Blue",
  },
  {
    name: "Pro Team Aero Fingerless Gloves",
    price: 35,
    category: "Gloves",
    image: "/Article%20-%20Product%204_%20Gloves.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "High-Cuff Imongo Racing Socks",
    price: 18,
    category: "Socks",
    image: "/Article%20-%20Product%205_%20Socks.png",
    sizes: ["S/M (37-41)", "L/XL (42-46)"],
  },
  {
    name: "Elite Cycling Helmet",
    price: 95,
    category: "Helmet",
    image: "/Rectangle%2051.png",
    sizes: ["S", "M", "L", "XL"],
  },
];

const fallbackArtwork: Record<Product["category"], string> = {
  Jerseys: "JERSEY",
  Shorts: "BIB",
  Glasses: "AERO",
  Gloves: "GLOVE",
  Socks: "SOCK",
  Helmet: "HELMET",
};

function ProductArtwork({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`shop-art shop-art-${product.category.toLowerCase()}`}>
      {!imageFailed && (
        <Image
          src={product.image}
          alt=""
          fill
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      {imageFailed && (
        <span className="shop-art-fallback" aria-hidden="true">
          {fallbackArtwork[product.category]}
        </span>
      )}
    </div>
  );
}

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>("All items");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [bagCount, setBagCount] = useState(0);

  const visibleProducts = useMemo(
    () =>
      activeCategory === "All items"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  function selectSize(productName: string, size: string) {
    setSelectedSizes((current) => ({ ...current, [productName]: size }));
  }

  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <section className="border-b border-white/10 bg-linear-to-br from-[#151b28] via-brand-navy to-[#17241f] px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand-lime">
            Banafrica team store
          </p>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-tight text-slate-200 sm:text-7xl">
              Featured products
            </h1>
            <div className="border border-white/10 bg-black/20 px-4 py-3 text-right">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500">Bag</span>
              <span className="font-display text-xl font-bold text-brand-lime">{bagCount} items</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 pb-4" role="tablist" aria-label="Product categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeCategory === category
                  ? "bg-brand-lime text-brand-navy"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
              {category === "All items" && " (6)"}
            </button>
          ))}
        </div>

        <div className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const selectedSize = selectedSizes[product.name] ?? product.sizes[Math.min(2, product.sizes.length - 1)];

            return (
              <article key={product.name} className="overflow-hidden rounded-sm bg-[#171d29] shadow-lg shadow-black/10">
                <ProductArtwork product={product} />
                <div className="p-4">
                  <p className="font-display text-xl font-bold uppercase leading-none text-brand-lime">${product.price}</p>
                  <h2 className="mt-1 min-h-10 font-display text-lg font-bold uppercase leading-tight tracking-wide text-slate-200">
                    {product.name}
                  </h2>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500">
                      {product.category === "Glasses" ? "Lens filter" : "Select size"}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                      {product.filter ?? selectedSize}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        aria-label={`Select ${size} for ${product.name}`}
                        aria-pressed={selectedSize === size}
                        onClick={() => selectSize(product.name, size)}
                        className={`min-w-8 px-1.5 py-1 text-[9px] font-bold uppercase ${
                          selectedSize === size ? "bg-blue-600 text-white" : "bg-black/20 text-gray-500 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBagCount((count) => count + 1)}
                    className="mt-4 flex w-full items-center justify-center gap-2 bg-brand-lime px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-brand-navy transition-colors hover:bg-white"
                  >
                    <span aria-hidden="true">🛒</span>
                    Add to bag
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}