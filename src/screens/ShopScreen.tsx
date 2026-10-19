"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import type { ShopProductView } from "@/lib/api";

type Product = ShopProductView & { filter?: string; sample?: boolean };

type CartLine = { productId?: number; productName: string; size: string; color?: string; quantity: number };

const fallbackProducts: Product[] = [
  {
    id: 1,
    slug: "pro-race-aero-jersey-2026",
    currency: "USD",
    categorySlug: "jerseys",
    name: "Pro Race Aero Jersey 2026",
    price: 140,
    category: "Jerseys",
    image: "/jersey.png",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The official Benediction Banafrica race jersey, built for fast training days and race-day performance.",
    sample: true,
  },
  {
    id: 2,
    slug: "elite-endurance-bib-shorts",
    currency: "USD",
    categorySlug: "shorts",
    name: "Elite Endurance Bib Shorts",
    price: 135,
    category: "Shorts",
    image: "/short.png",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Comfortable endurance bib shorts with a supportive fit for long rides and hard efforts.",
    sample: true,
  },
  {
    id: 3,
    slug: "aero-polarized-sunglasses",
    currency: "USD",
    categorySlug: "glasses",
    name: "Aero Polarized Sunglasses",
    price: 32,
    category: "Glasses",
    image: "/glasses.jpg",
    sizes: ["One size"],
    description: "Lightweight polarized glasses with a mirrored blue CAT 3 lens for bright cycling conditions.",
    filter: "CAT 3 Mirrored Blue",
    sample: true,
  },
  {
    id: 4,
    slug: "pro-team-aero-fingerless-gloves",
    currency: "USD",
    categorySlug: "gloves",
    name: "Pro Team Aero Fingerless Gloves",
    price: 35,
    category: "Gloves",
    image: "/gloves.jpg",
    sizes: ["S", "M", "L", "XL"],
    description: "Fingerless cycling gloves with padded palms and breathable fabric for confident control.",
    sample: true,
  },
  {
    id: 5,
    slug: "high-cuff-imongo-racing-socks",
    currency: "USD",
    categorySlug: "socks",
    name: "High-Cuff Imongo Racing Socks",
    price: 18,
    category: "Socks",
    image: "/socks.jpg",
    sizes: ["S/M (37-41)", "L/XL (42-46)"],
    description: "High-cuff racing socks designed to complete the Benediction team look while keeping feet comfortable.",
    sample: true,
  },
  {
    id: 6,
    slug: "elite-cycling-helmet",
    currency: "USD",
    categorySlug: "helmet",
    name: "Elite Cycling Helmet",
    price: 95,
    category: "Helmet",
    image: "/helmet.jpg",
    sizes: ["S", "M", "L", "XL"],
    description: "A lightweight cycling helmet with a secure fit for everyday training and competitive riding.",
    sample: true,
  },
];

const fallbackArtwork: Record<string, string> = {
  Jerseys: "JERSEY",
  Shorts: "BIB",
  Glasses: "AERO",
  Gloves: "GLOVE",
  Socks: "SOCK",
  Helmet: "HELMET",
};

function ProductArtwork({ product, className = "" }: { product: Product; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`shop-art shop-art-${product.category.toLowerCase()} ${className}`}>
      {!imageFailed && (
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          unoptimized={product.image.startsWith("http")}
          className="h-full w-full object-contain mix-blend-multiply"
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

function CartButton({
  cartCount,
  onClick,
}: {
  cartCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
      className="flex items-center gap-3 border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:border-brand-lime"
    >
      <div
        className="relative"
        aria-label={`${cartCount} ${cartCount === 1 ? "item" : "items"} in cart`}
      >
        <svg
          aria-hidden="true"
          className="h-7 w-7 text-brand-lime"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-lime px-1 text-[10px] font-bold text-brand-navy">
          {cartCount}
        </span>
      </div>
      <div>
        <span className="block text-[10px] uppercase tracking-widest text-gray-500">Cart</span>
        <span className="font-display text-xl font-bold text-brand-lime">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </span>
      </div>
    </button>
  );
}

function CartButton({
  cartCount,
  onClick,
}: {
  cartCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
      className="flex items-center gap-3 border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:border-brand-lime"
    >
      <div
        className="relative"
        aria-label={`${cartCount} ${cartCount === 1 ? "item" : "items"} in cart`}
      >
        <svg
          aria-hidden="true"
          className="h-7 w-7 text-brand-lime"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-lime px-1 text-[10px] font-bold text-brand-navy">
          {cartCount}
        </span>
      </div>
      <div>
        <span className="block text-[10px] uppercase tracking-widest text-gray-500">Cart</span>
        <span className="font-display text-xl font-bold text-brand-lime">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </span>
      </div>
    </button>
  );
}

export default function ShopScreen({
  products: catalogProducts,
  categories: catalogCategories,
}: {
  products?: Product[];
  categories?: { name: string; slug: string }[];
}) {
  const products = catalogProducts?.length ? catalogProducts : fallbackProducts;
  const categories = [
    "All items",
    ...(catalogCategories?.length
      ? catalogCategories.map((category) => category.name)
      : Array.from(new Set(products.map((product) => product.category)))),
  ];
  const [activeCategory, setActiveCategory] = useState("All items");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [view, setView] = useState<"shop" | "product" | "cart" | "checkout" | "done">("shop");
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.name === item.productName);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

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

  function openProduct(product: Product) {
    setSelectedProductName(product.name);
    setView("product");
  }

  function addToCart(productName: string, size: string) {
    const product = products.find((entry) => entry.name === productName);
    const color = product?.filter;
    setCart((current) => {
      const line = current.find((item) => item.productName === productName && item.size === size && item.color === color);
      return line
        ? current.map((item) => item === line ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { productName, size, quantity }];
    });
  }

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const customer_name = String(data.get("name") ?? "").trim();
    const customer_email = String(data.get("email") ?? "").trim();
    const customer_phone = String(data.get("phone") ?? "").trim();
    const address = [
      String(data.get("street") ?? ""),
      String(data.get("address2") ?? ""),
      String(data.get("city") ?? ""),
      String(data.get("postal") ?? ""),
      String(data.get("country") ?? ""),
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");
    const color = String(data.get("color") ?? "").trim();
    const extra = String(data.get("notes") ?? "").trim();
    const sizeLines = cart
      .map((item) => {
        const details = [`size ${item.size}`, item.color && `color ${item.color}`].filter(Boolean).join(", ");
        return `${item.productName} × ${item.quantity} (${details})`;
      })
      .join("\n");
    const note = [sizeLines, color && `Color: ${color}`, address && `Delivery: ${address}`, extra && `Notes: ${extra}`]
      .filter(Boolean)
      .join("\n");
    const grouped = new Map<number, number>();
    for (const item of cart) {
      if (!item.productId) continue;
      grouped.set(item.productId, (grouped.get(item.productId) ?? 0) + item.quantity);
    }
    const items = [...grouped.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
    if (!items.length) {
      setCheckoutError("These sample products are not in the club shop yet. Connect the live catalog before sending a request.");
      return;
    }
    setCheckoutPending(true);
    try {
      const response = await fetch("/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name,
          customer_email,
          ...(customer_phone ? { customer_phone } : {}),
          note,
          items,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not submit the order request.");
      }
      setCart([]);
      setView("done");
      form.reset();
    } catch (submitError) {
      setCheckoutError(submitError instanceof Error ? submitError.message : "Could not submit the order request.");
    } finally {
      setCheckoutPending(false);
    }
  }

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const customer_name = String(data.get("name") ?? "").trim();
    const customer_email = String(data.get("email") ?? "").trim();
    const customer_phone = String(data.get("phone") ?? "").trim();
    const address = [
      String(data.get("street") ?? ""),
      String(data.get("address2") ?? ""),
      String(data.get("city") ?? ""),
      String(data.get("postal") ?? ""),
      String(data.get("country") ?? ""),
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");
    const color = String(data.get("color") ?? "").trim();
    const extra = String(data.get("notes") ?? "").trim();
    const sizeLines = cart
      .map((item) => {
        const details = [`size ${item.size}`, item.color && `color ${item.color}`].filter(Boolean).join(", ");
        return `${item.productName} × ${item.quantity} (${details})`;
      })
      .join("\n");
    const note = [sizeLines, color && `Color: ${color}`, address && `Delivery: ${address}`, extra && `Notes: ${extra}`]
      .filter(Boolean)
      .join("\n");
    const grouped = new Map<number, number>();
    for (const item of cart) {
      if (!item.productId) continue;
      grouped.set(item.productId, (grouped.get(item.productId) ?? 0) + item.quantity);
    }
    const items = [...grouped.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
    if (!items.length) {
      setCheckoutError("These sample products are not in the club shop yet. Connect the live catalog before sending a request.");
      return;
    }
    setCheckoutPending(true);
    try {
      const response = await fetch("/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name,
          customer_email,
          ...(customer_phone ? { customer_phone } : {}),
          note,
          items,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not submit the order request.");
      }
      setCart([]);
      setView("done");
      form.reset();
    } catch (submitError) {
      setCheckoutError(submitError instanceof Error ? submitError.message : "Could not submit the order request.");
    } finally {
      setCheckoutPending(false);
    }
  }

  function updateQuantity(productName: string, size: string, change: number) {
    setCart((current) => current
      .map((item) => item.productName === productName && item.size === size
        ? { ...item, quantity: item.quantity + change }
        : item)
      .filter((item) => item.quantity > 0));
  }

  function orderSummary() {
    return (
      <aside className="h-fit rounded-sm border border-white/10 bg-[#171d29] p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase text-slate-200">Order summary</h2>
          <span className="text-[9px] uppercase text-gray-500">{cartCount} {cartCount === 1 ? "item" : "items"}</span>
        </div>
        <div className="mt-4 space-y-3 text-xs">
          <div className="flex justify-between"><span className="text-gray-400">Merchandise subtotal</span><strong className="font-display text-lg text-slate-200">${subtotal}</strong></div>
          <div className="flex justify-between text-gray-400"><span>Delivery</span><span>To be confirmed</span></div>
          <div className="flex justify-between text-gray-400"><span>Taxes</span><span>To be confirmed</span></div>
          <div className="border-t border-white/10 pt-3"><div className="flex justify-between text-gray-300"><span>Payable total</span><span>To be confirmed</span></div></div>
          <p className="text-[10px] leading-relaxed text-gray-400">We’ll confirm delivery, taxes, and the payable total after reviewing your request.</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <button type="button" onClick={() => setView("shop")} className="flex w-full items-center justify-center border border-white/20 px-3 py-3 text-[11px] font-bold uppercase text-gray-200 transition-colors hover:border-brand-lime hover:text-brand-lime">
            ← Continue shopping
          </button>
          <button type="button" disabled={!cart.length} onClick={() => setView("checkout")} className="flex w-full items-center justify-center gap-2 bg-brand-lime px-3 py-3 text-[11px] font-bold uppercase text-brand-navy transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
            Continue to checkout <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>
    );
  }

  if (view === "product" && selectedProductName) {
    const product = products.find((entry) => entry.name === selectedProductName);

    if (product) {
      const selectedSize =
        selectedSizes[product.name] ?? product.sizes[Math.min(2, product.sizes.length - 1)];

      return (
        <main className="min-h-screen bg-brand-navy text-white">
          <section className="border-b border-white/10 bg-linear-to-br from-[#151b28] via-brand-navy to-[#17241f] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-start justify-between gap-5">
                <button type="button" onClick={() => setView("shop")} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-lime">
                  ← Back to products
                </button>
                {cartCount > 0 && <CartButton cartCount={cartCount} onClick={() => setView("cart")} />}
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-brand-lime">Benediction / pro team kit</p>
              <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold uppercase leading-none text-slate-200 sm:text-6xl">
                {product.name}
              </h1>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:py-12">
            <ProductArtwork product={product} className="rounded-sm" />
            <div className="flex flex-col justify-center">
              <p className="font-display text-3xl font-bold text-brand-lime">${product.price}</p>
              <p className="mt-5 text-sm leading-relaxed text-gray-300">{product.description}</p>

              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {product.category === "Glasses" ? "Lens filter" : "Select size"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => selectSize(product.name, size)}
                      aria-pressed={selectedSize === size}
                      className={`border px-4 py-2 text-[10px] font-bold uppercase ${
                        selectedSize === size
                          ? "border-brand-lime bg-brand-lime text-brand-navy"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-brand-lime hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product.name, selectedSize);
                    setView("cart");
                  }}
                  className="flex min-w-48 flex-1 items-center justify-center bg-brand-lime px-4 py-4 text-xs font-bold uppercase tracking-widest text-brand-navy transition-colors hover:bg-white"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </section>
        </main>
      );
    }
  }

  if (view === "done") {
    return (
      <main className="min-h-screen bg-brand-navy text-white">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lime">Order request sent</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase">Thank you</h1>
          <p className="mt-4 text-sm text-gray-400">
            The club will confirm availability, delivery and the payable total. There is no online payment.
          </p>
          <button type="button" onClick={() => setView("shop")} className="mt-8 bg-brand-lime px-6 py-3 text-xs font-bold uppercase text-brand-navy">
            Back to shop
          </button>
        </section>
      </main>
    );
  }

  if (view === "done") {
    return (
      <main className="min-h-screen bg-brand-navy text-white">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lime">Order request sent</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase">Thank you</h1>
          <p className="mt-4 text-sm text-gray-400">
            The club will confirm availability, delivery and the payable total. There is no online payment.
          </p>
          <button type="button" onClick={() => setView("shop")} className="mt-8 bg-brand-lime px-6 py-3 text-xs font-bold uppercase text-brand-navy">
            Back to shop
          </button>
        </section>
      </main>
    );
  }

  if (view !== "shop" && view !== "product") {
    return (
      <main className="min-h-screen bg-brand-navy text-white">
        <section className="border-b border-white/10 bg-linear-to-br from-[#151b28] via-brand-navy to-[#17241f] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between text-[9px] uppercase tracking-wide text-gray-400"><span>Official pro shop / checkout</span><button type="button" onClick={() => setView("cart")} className="font-bold text-brand-lime">Cart ({cartCount})</button></div>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase text-slate-200 sm:text-5xl">{view === "cart" ? "Your shopping cart" : "Contact & delivery"}</h1>
            <p className="mt-2 text-xs text-gray-400">{view === "cart" ? "Your team kit, ready for the next step. Check your selection before continuing." : "Tell us who’s riding and where your kit should go."}</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="mb-7 flex gap-8 border-b border-white/10 pb-4 text-[10px] font-bold uppercase text-gray-400"><span className={view === "cart" ? "text-brand-lime" : ""}>① Shopping cart</span><span className={view === "checkout" ? "text-brand-lime" : ""}>② Order details</span><span>③ Confirmation</span></div>
          {view === "cart" ? (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
              <div>
                <div className="mb-4 flex justify-between border-b border-white/10 pb-3"><h2 className="font-display font-bold uppercase">Your items</h2><span className="text-[10px] text-gray-400">{cartCount} {cartCount === 1 ? "item" : "items"}</span></div>
                {cart.length ? <div className="divide-y divide-white/10">{cart.map((item) => {
                  const product = products.find((entry) => entry.name === item.productName)!;
                  return <article key={`${item.productName}-${item.size}`} className="grid gap-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <ProductArtwork product={product} className="shop-art-bag" />
                    <div className="flex flex-col justify-between py-1"><div><p className="text-[9px] uppercase text-gray-500">Benediction / pro team kit</p><h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-slate-200">{product.name}</h3><p className="mt-3 text-xs text-gray-400">Size: {item.size}</p></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center border border-white/10 text-sm"><button aria-label={`Decrease ${product.name} quantity`} type="button" onClick={() => updateQuantity(item.productName, item.size, -1)} className="px-3 py-1">−</button><span className="px-2">{item.quantity}</span><button aria-label={`Increase ${product.name} quantity`} type="button" onClick={() => updateQuantity(item.productName, item.size, 1)} className="px-3 py-1">+</button></div><strong className="font-display text-xl text-brand-lime">${product.price * item.quantity}</strong><button type="button" onClick={() => updateQuantity(item.productName, item.size, -item.quantity)} className="text-xs text-gray-400 underline">Remove</button></div></div>
                  </article>;
                })}</div> : <p className="py-10 text-sm text-gray-400">Your cart is empty. Continue shopping to add team kit.</p>}
              </div>
              {orderSummary()}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
              <form onSubmit={handleCheckout} className="space-y-4">
                <fieldset className="space-y-4 rounded-sm border border-white/10 bg-[#171d29] p-4"><legend className="sr-only">Contact details</legend><h2 className="font-display text-lg font-bold uppercase">Contact details</h2>
                  <label className="block text-[10px] text-gray-300">Full name *<input required name="name" autoComplete="name" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="Your name" /></label>
                  <div className="grid gap-3 sm:grid-cols-2"><label className="block text-[10px] text-gray-300">Email address *<input required type="email" name="email" autoComplete="email" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="you@example.com" /></label><label className="block text-[10px] text-gray-300">Phone number (optional)<input type="tel" name="phone" autoComplete="tel" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="Include country code" /></label></div>
                </fieldset>
                <fieldset className="space-y-4 rounded-sm border border-white/10 bg-[#171d29] p-4"><legend className="sr-only">Delivery address</legend><h2 className="font-display text-lg font-bold uppercase">Delivery address</h2>
                  <div className="grid gap-3 sm:grid-cols-2"><label className="block text-[10px] text-gray-300">Country / territory *<input required name="country" autoComplete="country-name" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" /></label><label className="block text-[10px] text-gray-300">Postal code *<input required name="postal" autoComplete="postal-code" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" /></label></div>
                  <div className="grid gap-3 sm:grid-cols-2"><label className="block text-[10px] text-gray-300">Street address *<input required name="street" autoComplete="address-line1" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" /></label><label className="block text-[10px] text-gray-300">Address line 2<input name="address2" autoComplete="address-line2" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="Apartment, suite or building" /></label></div>
                  <label className="block text-[10px] text-gray-300">City *<input required name="city" autoComplete="address-level2" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" /></label>
                  <label className="flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] text-gray-300"><input type="checkbox" name="sameBilling" defaultChecked className="accent-brand-lime" /> Billing address is the same as delivery address</label>
                  <label className="block text-[10px] text-gray-300">Color (optional)<input name="color" className="mt-2 w-full border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="If a color matters for this order" /></label>
                  <label className="block text-[10px] text-gray-300">Order notes (optional)<textarea name="notes" rows={3} className="mt-2 w-full resize-y border border-white/10 bg-[#10151f] px-3 py-2.5 text-xs text-white outline-none focus:border-brand-lime" placeholder="Anything we should know?" /></label>
                </fieldset>
                {checkoutError ? <p role="alert" className="text-sm text-red-400">{checkoutError}</p> : null}
                <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setView("cart")} className="text-xs text-gray-400">← Back to cart</button><button type="submit" disabled={!cart.length || checkoutPending} className="bg-brand-lime px-8 py-3 text-xs font-bold uppercase text-brand-navy hover:bg-white disabled:opacity-50">{checkoutPending ? "Sending…" : "Submit order"}</button></div>
              </form>
              {orderSummary()}
            </div>
          )}
        </section>
      </main>
    );
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
                  {category === "All items" ? ` (${products.length})` : ""}
            </button>
          ))}
        </div>

        <div className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            return (
              <article key={product.name} className="overflow-hidden rounded-sm bg-[#171d29] shadow-lg shadow-black/10">
                <button
                  type="button"
                  onClick={() => openProduct(product)}
                  aria-label={`View details for ${product.name}`}
                  className="block w-full text-left transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-lime"
                >
                  <ProductArtwork product={product} />
                </button>
                <div className="p-4">
                  <p className="font-display text-xl font-bold uppercase leading-none text-brand-lime">${product.price}</p>
                  <h2 className="mt-1 min-h-10 font-display text-lg font-bold uppercase leading-tight tracking-wide text-slate-200">{product.name}</h2>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-400">{product.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
