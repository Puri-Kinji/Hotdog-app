import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";

/* -------------------- Brand Theme -------------------- */
const THEME = {
  bg: "#CFB857",
  text: "#111111",
  card: "#FFFFFF",
  red: "#C7372F",
  black: "#111111",
  border: "rgba(0,0,0,0.16)",
};

/* -------------------- Types -------------------- */
type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "Dogs & Links" | "Burgers & Sandwiches" | "Sides & Extras" | "Drinks" | "Desserts";
  desc?: string;
  badge?: "Vegan" | "Spicy" | "Kosher" | "New" | "Popular";
};
type CartLine = { id: string; name: string; price: number; qty: number; note?: string };

/* -------------------- Restaurant Config -------------------- */
const RESTAURANT = {
  name: "Earle's on Crenshaw",
  tagline: "Save time by ordering online!",
  address: "3864 Crenshaw BLVD",
  phone: "(323) 299-2867",
  hours: [
    { d: "Mon", h: "11:00 AM – 9:00 PM" },
    { d: "Tue", h: "11:00 AM – 9:00 PM" },
    { d: "Wed", h: "11:00 AM – 9:00 PM" },
    { d: "Thu", h: "11:00 AM – 9:00 PM" },
    { d: "Fri", h: "11:00 AM – 9:00 PM" },
    { d: "Sat", h: "11:00 AM – 9:00 PM" },
    { d: "Sun", h: "Closed" },
  ],
  links: {
    uberEats:
      "https://www.ubereats.com/store/earles-on-crenshaw/li55HwiTQAWeXlk3hpvg5A",
    doorDash:
      "https://www.doordash.com/store/earle's-los-angeles-260651/81230038/",
    instagram: "https://www.instagram.com/earlesoncrenshaw/",
    tiktok: "https://www.tiktok.com/@earlesrestaurant",
  },
  promo: { label: "ORDER NOW", text: "Use EARLES5 for $5 off total today" },
};

/* -------------------- Menu Data -------------------- */
const MENU: MenuItem[] = [
  { id: "turkey-dog", name: "Turkey Dog", price: 4.49, category: "Dogs & Links" },
  { id: "beef-dog", name: "Beef Dog (Kosher)", price: 5.75, category: "Dogs & Links", badge: "Kosher" },
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 8.99, category: "Dogs & Links", badge: "Spicy" },
  { id: "chicken-link", name: "Chicken Link", price: 8.99, category: "Dogs & Links" },
  { id: "vegan-link", name: "Vegan Link (Spicy)", price: 8.49, category: "Dogs & Links", badge: "Vegan" },
  { id: "turkey-burger", name: "Turkey Burger", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "salmon-burger", name: "Salmon Burger", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "vegan-burger", name: "Vegan Burger", price: 12.99, category: "Burgers & Sandwiches", badge: "Vegan" },
  { id: "cheese", name: "Cheese (American, Cheddar)", price: 0.75, category: "Sides & Extras" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "Sides & Extras", badge: "Vegan" },
  { id: "small-cup", name: "Small Cup (Lemonade, Playas Punch)", price: 3.99, category: "Drinks" },
  { id: "large-cup", name: "Large Cup (Lemonade, Playas Punch)", price: 4.99, category: "Drinks" },
];
const CATEGORIES: MenuItem["category"][] = [
  "Dogs & Links",
  "Burgers & Sandwiches",
  "Sides & Extras",
  "Drinks",
  "Desserts",
];

/* -------------------- Helpers -------------------- */
const money = (n: number) => `$${n.toFixed(2)}`;
function groupByCategory(items: MenuItem[]) {
  const m = new Map<MenuItem["category"], MenuItem[]>();
  for (const c of CATEGORIES) m.set(c, []);
  for (const it of items) m.get(it.category)!.push(it);
  return m;
}

/* -------------------- App -------------------- */
export default function RestaurantApp() {
  const [category, setCategory] = useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");

  const filtered = useMemo(() => {
    let list = MENU;
    if (category !== "All") list = list.filter((m) => m.category === category);
    return list;
  }, [category]);
  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = +(subtotal * 0.095).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const addToCart = (item: MenuItem) =>
    setCart((c) => {
      const e = c.find((l) => l.id === item.id);
      return e
        ? c.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });

  return (
    <div style={{ minHeight: "100vh", background: THEME.bg, color: THEME.text }}>
      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: THEME.bg,
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "clamp(8px, 2vw, 16px)",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                background: THEME.black,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              E
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 600, margin: 0 }}>
                {RESTAURANT.name}
              </h1>
              <p style={{ fontSize: "clamp(12px, 3vw, 14px)", margin: 0 }}>
                {RESTAURANT.tagline}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
          </div>
        </div>

        <div
          style={{
            background: THEME.bg,
            borderTop: `1px solid ${THEME.border}`,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          <a
            href={RESTAURANT.links.doorDash}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              background: THEME.red,
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {RESTAURANT.promo.label}
          </a>
          <span>{RESTAURANT.promo.text}</span>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          width: "100%",
          maxWidth: "clamp(320px, 95%, 1280px)",
          margin: "0 auto",
          padding: "clamp(12px, 2vw, 24px)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(16px, 3vw, 24px)",
        }}
      >
        {/* MENU */}
        <section>
          <CategoryBar
            active={category}
            onPick={(c) => setCategory(c)}
            counts={CATEGORIES.reduce<Record<string, number>>((acc, c) => {
              acc[c] = MENU.filter((m) => m.category === c).length;
              return acc;
            }, {})}
          />

          {[...grouped.entries()].map(([cat, items]) =>
            items.length ? (
              <div key={cat} style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600 }}>{cat}</h2>
                <div
                  style={{
                    display: "grid",
                    gap: "clamp(12px, 2vw, 20px)",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(clamp(150px, 45%, 320px), 1fr))",
                  }}
                >
                  {items.map((it) => (
                    <article
                      key={it.id}
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${THEME.border}`,
                        background: THEME.card,
                        padding: "clamp(8px, 2vw, 16px)",
                        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <h3
                            style={{
                              fontWeight: 600,
                              lineHeight: 1.15,
                              fontSize: "clamp(14px, 3vw, 16px)",
                            }}
                          >
                            {it.name}
                          </h3>
                          {it.badge && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: 8,
                                fontSize: 12,
                                padding: "4px 8px",
                                borderRadius: 999,
                                background: THEME.black,
                                color: "#fff",
                              }}
                            >
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700 }}>{money(it.price)}</div>
                          <button
                            onClick={() => addToCart(it)}
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              padding: "6px 12px",
                              borderRadius: 12,
                              background: THEME.red,
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </section>

        {/* CART */}
        <aside
          style={{
            position: "sticky",
            top: 104,
            height: "max-content",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              borderRadius: 16,
              border: `1px solid ${THEME.border}`,
              background: THEME.card,
              padding: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Your Order</h2>
            {!cart.length && <p>Your cart is empty.</p>}
            {!!cart.length &&
              cart.map((l) => (
                <div key={l.id} style={{ marginTop: 8 }}>
                  <div>{l.name}</div>
                  <div>{money(l.price * l.qty)}</div>
                </div>
              ))}
            {!!cart.length && (
              <div style={{ marginTop: 12, fontWeight: 600 }}>
                Total: {money(total)}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

/* -------------------- Components -------------------- */
function Toggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[] | T[];
}) {
  return (
    <div style={{ borderRadius: 12, background: "#fff", padding: 4, display: "inline-flex" }}>
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt as T)}
          style={{
            padding: "6px 12px",
            borderRadius: 10,
            fontSize: 14,
            border: `1px solid ${value === opt ? THEME.black : "transparent"}`,
            background: value === opt ? THEME.black : "transparent",
            color: value === opt ? "#fff" : THEME.text,
            opacity: value === opt ? 1 : 0.8,
            cursor: "pointer",
          }}
        >
          {String(opt)}
        </button>
      ))}
    </div>
  );
}

function CategoryBar({
  active,
  onPick,
  counts,
}: {
  active: MenuItem["category"] | "All";
  onPick: (c: MenuItem["category"] | "All") => void;
  counts: Record<string, number>;
}) {
  const cats: (MenuItem["category"] | "All")[] = ["All", ...CATEGORIES];
  return (
    <div
      style={{
        position: "sticky",
        top: 104,
        zIndex: 10,
        background: THEME.bg,
        padding: "12px 0",
        margin: "0 0 16px",
        borderBottom: `1px solid ${THEME.border}`,
        overflowX: "auto",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => onPick(c)}
            style={{
              padding: "6px 12px",
              borderRadius: 12,
              border: `1px solid ${active === c ? THEME.black : THEME.border}`,
              background: active === c ? THEME.black : "#fff",
              color: active === c ? "#fff" : THEME.text,
              fontSize: "clamp(12px, 3vw, 14px)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {c} {c !== "All" && <span style={{ opacity: 0.6 }}>({counts[c] || 0})</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
