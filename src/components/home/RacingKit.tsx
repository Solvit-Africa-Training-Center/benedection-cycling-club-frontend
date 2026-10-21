"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageProvider";

type Product = {
  name: string;
  tagline: string;
  price: string;
  /** Leave undefined until the photo is in /public. A placeholder shows instead. */
  image?: string;
  /** Optional back view. When set, the card flips on hover. */
  imageBack?: string;
};

export type RacingKitProduct = Product;

const products: Product[] = [
  {
    name: "Cycling Jersey",
    tagline: "Fuel for the climb",
    price: "$140.00",
    image: "/jersey.png",
  },
  {
    name: "Cycling Short",
    tagline: "Endless miles",
    price: "$140.00",
    image: "/short.png",
  },
  {
    name: "Cycling Glass",
    tagline: "Eyes on the prize",
    price: "$32.00",
    image: "/glasses.jpg",
  },
  {
    name: "Cycling Gloves",
    tagline: "Total control",
    price: "$35.00",
    image: "/gloves.jpg",
  },
];

function CartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
    </svg>
  );
}

function ProductPhoto({ product, photoSoon }: { product: Product; photoSoon: string }) {
  if (!product.image) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-600 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-300">
        {photoSoon}
      </div>
    );
  }

  const hasBack = Boolean(product.imageBack);

  return (
    <div className="group [perspective:900px]">
      <div
        className={`relative aspect-square rounded-xl bg-gray-600 transition-transform duration-700 [transform-style:preserve-3d] ${
          hasBack ? "group-hover:[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden]">
          <Image
            src={product.image}
            alt={`${product.name}, front`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            unoptimized={product.image.startsWith("http")}
            className={hasBack ? "object-contain p-4" : "object-cover"}
          />
        </div>

        {/* Back */}
        {product.imageBack && (
          <div className="absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={product.imageBack}
              alt={`${product.name}, back`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain p-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function RacingKit({ items }: { items?: Product[] }) {
  const { t } = useI18n();
  const catalog = items?.length ? items : products;
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            {t.home.kitTitle}
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-lime px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-brand-navy transition-opacity hover:opacity-90"
          >
            {t.home.enterStore}
            <CartIcon />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {catalog.map((product) => (
            <article
              key={product.name}
              className="rounded-2xl bg-[#1a2030] p-3 md:p-4"
            >
              <ProductPhoto product={product} photoSoon={t.common.photoSoon} />

              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
                {product.name}
              </h3>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                {product.tagline}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg text-green-500">{product.price}</span>
                <Link
                  href="/shop"
                  className="rounded-full bg-blue-600 px-4 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors hover:bg-blue-500"
                >
                  {t.home.buyNow}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}