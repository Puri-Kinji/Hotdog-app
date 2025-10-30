import { useMemo, useState } from "react";
import "./index.css"
import './App.css'

/* -------------------- Brand Theme -------------------- */
const THEME = {
  bg: "#CFB857",        // mustard yellow background
  text: "#111111",      // near-black text
  card: "#FFFFFF",      // white cards
  red: "#C7372F",       // CTA red
  black: "#111111",     // dark accents
  border: "rgba(0,0,0,0.16)", // soft black border
  container: 1152,      // max content width
};

/* -------------------- Types -------------------- */
type MenuItem = {
  id: string;
  name: string;
  price: number;
  category:
    | "Dogs & Links"
    | "Burgers & Sandwiches"
    | "Sides & Extras"
    | "Drinks"
    | "Desserts";
  desc?: string;
  badge?: "Vegan" | "Spicy" | "Kosher" | "New" | "Popular";
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
};

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
      "https://www.ubereats.com/store/earles-on-crenshaw/li55HwiTQAWeXlk3hpvg5A?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjM4NjQlMjBDcmVuc2hhdyUyMEJsdmQlMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJiZmFhZGRkMC1jNjdhLWIwMjAtZjk1Mi1iN2IzZGViZmViYjklMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIydWJlcl9wbGFjZXMlMjIlMkMlMjJsYXRpdHVkZSUyMiUzQTM0LjAxNTQzOSUyQyUyMmxvbmdpdHVkZSUyMiUzQS0xMTguMzM0Nzg1JTdE",
    doorDash:
      "https://www.doordash.com/store/earle's-los-angeles-260651/81230038/?srsltid=AfmBOooLlowBi9lmHJ_KRnOnuicsoQpXRU6hvtvk-cpwmmspMWqFEqnO",
    instagram: "https://www.instagram.com/earlesoncrenshaw/",
    tiktok: "https://www.tiktok.com/@earlesrestaurant",
  },
  promo: {
    label: "ORDER NOW",
    text: "Use EARLES5 for $5 off total today",
  },
};

/* -------------------- Menu Data -------------------- */
const MENU: MenuItem[] = [
  { id: "turkey-dog", name: "Turkey Dog", price: 4.49, category: "Dogs & Links" },
  { id: "beef-dog", name: "Beef Dog (Kosher)", price: 5.75, category: "Dogs & Links", badge: "Kosher" },
  { id: "beef-jumbo", name: "Beef Jumbo Dog (Kosher)", price: 7.49, category: "Dogs & Links", badge: "Kosher" },
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 8.99, category: "Dogs & Links", badge: "Spicy" },
  { id: "chicken-link", name: "Chicken Link", price: 8.99, category: "Dogs & Links" },
  { id: "vegan-dog", name: "Vegan Dog", price: 7.49, category: "Dogs & Links", badge: "Vegan" },
  { id: "vegan-link", name: "Vegan Link (Spicy)", price: 8.49, category: "Dogs & Links", badge: "Vegan" },

  { id: "turkey-burger", name: "Turkey Burger", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "salmon-burger", name: "Salmon Burger", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "vegan-burger", name: "Vegan Burger", price: 12.99, category: "Burgers & Sandwiches", badge: "Vegan" },
  { id: "pastrami", name: "Pastrami Sandwich", price: 8.99, category: "Burgers & Sandwiches" },

  { id: "cheese", name: "Cheese (American, Cheddar)", price: 0.75, category: "Sides & Extras" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "Sides & Extras", badge: "Vegan" },
  { id: "beef-chili-scoop", name: "Beef Chili Scoop", price: 1.0, category: "Sides & Extras" },
  { id: "vegan-chili-scoop", name: "Vegan Chili Scoop", price: 2.49, category: "Sides & Extras", badge: "Vegan" },

  { id: "small-cup", name: "Small Cup (Lemonade, Playas Punch)", price: 3.99, category: "Drinks" },
  { id: "large-cup", name: "Large Cup (Lemonade, Playas Punch)", price: 4.99, category: "Drinks" },
  { id: "soda-can", name: "Soda Can", price: 2.25, category: "Drinks" },
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");

  const filtered = useMemo(() => {
    let list = MENU.filter((m) => m.name.toLowerCase().includes(query.toLowerCase().trim()));
    if (category !== "All") list = list.filter((m) => m.category === category);
    return list;
  }, [query, category]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const taxRate = 0.095;
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  function addToCart(item: MenuItem) {
    setCart((c) => {
      const exists = c.find((l) => l.id === item.id);
      return exists
        ? c.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }
  function removeFromCart(id: string) {
    setCart((c) => c.filter((l) => l.id !== id));
  }
  function changeQty(id: string, delta: number) {
    setCart((c) =>
      c
        .map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l))
        .filter((l) => l.qty > 0),
    );
  }
  function applyNote(id: string, note: string) {
    setCart((c) => c.map((l) => (l.id === id ? { ...l, note } : l)));
    setNoteFor(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: THEME.bg, color: THEME.text }}>
      {/* Header */}
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
            maxWidth: THEME.container,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              flexShrink: 0,
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
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>{RESTAURANT.name}</h1>
            <p style={{ fontSize: 14, opacity: 0.9 }}>{RESTAURANT.tagline}</p>
          </div>

          {/* Search */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              borderRadius: 12,
              padding: "8px 12px",
            }}
            className="md:flex"
          >
            <input
              aria-label="Search menu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu…"
              style={{ background: "transparent", outline: "none", fontSize: 14, minWidth: 220 }}
            />
          </div>

          {/* Mode toggle + Delivery link */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
            <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
            {mode === "Delivery" && (
              <a
                href={RESTAURANT.links.uberEats}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 14, textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                Order on Uber Eats
              </a>
            )}
          </div>
        </div>

        {/* Promo strip */}
        <div style={{ background: THEME.bg, borderTop: `1px solid ${THEME.border}` }}>
          <div
            style={{
              maxWidth: THEME.container,
              margin: "0 auto",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 14,
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
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: THEME.container,
          margin: "0 auto",
          padding: "24px 16px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
        }}
        className="md:grid-cols-[1fr_360px]"
      >
        {/* Left: Menu */}
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
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{cat}</h2>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                     gridTemplateColumns: "1fr",
                  }}
                >
                  {items.map((it) => (
                    <article
                      key={it.id}
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${THEME.border}`,
                        background: THEME.card,
                        padding: 16,
                        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <h3 style={{ fontWeight: 600, lineHeight: 1.15 }}>{it.name}</h3>
                          {it.desc && (
                            <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{it.desc}</p>
                          )}
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
            ) : null,
          )}
        </section>

        {/* Right: Cart */}
        <aside style={{ position: "sticky" as const, top: 104, height: "max-content" }}>
          <div
            style={{
              borderRadius: 16,
              border: `1px solid ${THEME.border}`,
              background: THEME.card,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              padding: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Your Order</h2>
            {!cart.length && (
              <p style={{ fontSize: 14, opacity: 0.8, marginTop: 8 }}>
                Your cart is empty. Add something tasty!
              </p>
            )}

            {!!cart.length && (
              <div style={{ marginTop: 12 }}>
                {cart.map((l) => (
                  <div key={l.id} style={{ borderBottom: `1px solid ${THEME.border}`, paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, lineHeight: 1.15 }}>{l.name}</div>
                        {l.note && (
                          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Note: {l.note}</div>
                        )}
                      </div>
                      <div style={{ textAlign: "right", minWidth: 140 }}>
                        <div style={{ fontSize: 14 }}>{money(l.price * l.qty)}</div>
                        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => changeQty(l.id, -1)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: 8,
                              background: "#fff",
                              border: `1px solid ${THEME.border}`,
                            }}
                          >
                            -
                          </button>
                          <span style={{ width: 24, textAlign: "center" }}>{l.qty}</span>
                          <button
                            onClick={() => changeQty(l.id, +1)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: 8,
                              background: "#fff",
                              border: `1px solid ${THEME.border}`,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => setNoteFor(l.id)}
                        style={{ fontSize: 12, textDecoration: "underline", textUnderlineOffset: 2 }}
                      >
                        {l.note ? "Edit note" : "Add note"}
                      </button>
                      <button
                        onClick={() => removeFromCart(l.id)}
                        style={{ fontSize: 12, color: THEME.red }}
                      >
                        Remove
                      </button>
                    </div>

                    {noteFor === l.id && (
                      <NoteEditor
                        initial={l.note || ""}
                        onCancel={() => setNoteFor(null)}
                        onSave={(val) => applyNote(l.id, val)}
                      />
                    )}
                  </div>
                ))}

                {/* Totals */}
                <div style={{ fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                    <span>Subtotal</span><span>{money(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                    <span>Tax</span><span>{money(tax)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, marginTop: 8, borderTop: `1px solid ${THEME.border}`, fontWeight: 700, fontSize: 16 }}>
                    <span>Total</span><span>{money(total)}</span>
                  </div>
                </div>

                {/* Checkout actions */}
                <div style={{ marginTop: 12 }}>
                  {mode === "Delivery" ? (
                    <a
                      href={RESTAURANT.links.uberEats}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: THEME.red,
                        color: "#fff",
                        textDecoration: "none",
                      }}
                    >
                      Continue on Uber Eats
                    </a>
                  ) : (
                    <button
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: THEME.red,
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Place Pickup Order (demo)
                    </button>
                  )}
                  <p style={{ fontSize: 12, opacity: 0.7, textAlign: "center", marginTop: 6 }}>
                    * Online checkout not wired in this demo. Link out to delivery partners or add your own API.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info card */}
          <div
            style={{
              marginTop: 16,
              borderRadius: 16,
              border: `1px solid ${THEME.border}`,
              background: THEME.card,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              padding: 16,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700 }}>Visit us</div>
            <div style={{ marginTop: 4 }}>{RESTAURANT.address}</div>
            <div style={{ marginTop: 4 }}>{RESTAURANT.phone}</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {RESTAURANT.hours.map((h) => (
                <div key={h.d} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.7 }}>{h.d}</span>
                  <span>{h.h}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${THEME.border}` }}>
        <div
          style={{
            maxWidth: THEME.container,
            margin: "0 auto",
            padding: "24px 16px",
            fontSize: 14,
            color: "rgba(0,0,0,0.8)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <div>© {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={RESTAURANT.links.instagram} target="_blank" rel="noreferrer" style={{ color: THEME.black, textDecoration: "underline dotted" }}>Instagram</a>
            <a href={RESTAURANT.links.tiktok} target="_blank" rel="noreferrer" style={{ color: THEME.black, textDecoration: "underline dotted" }}>TikTok</a>
            <a href={RESTAURANT.links.doorDash} target="_blank" rel="noreferrer" style={{ color: THEME.black, textDecoration: "underline dotted" }}>DoorDash</a>
            <a href={RESTAURANT.links.uberEats} target="_blank" rel="noreferrer" style={{ color: THEME.black, textDecoration: "underline dotted" }}>Uber Eats</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------- Small Components -------------------- */
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
              fontSize: 14,
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

function NoteEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: string;
  onCancel: () => void;
  onSave: (val: string) => void;
}) {
  const [val, setVal] = useState(initial);
  return (
    <div style={{ marginTop: 8, padding: 8, borderRadius: 12, border: `1px solid ${THEME.border}`, background: "#fefefe" }}>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={2}
        style={{ width: "100%", background: "#fff", borderRadius: 8, padding: 8, fontSize: 14, border: `1px solid ${THEME.border}`, outline: "none" }}
        placeholder="Add ketchup, extra onions, no pickles…"
      />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={() => onSave(val)}
          style={{ padding: "6px 12px", borderRadius: 10, fontSize: 14, background: THEME.red, color: "#fff", border: "none", cursor: "pointer" }}
        >
          Save note
        </button>
        <button
          onClick={onCancel}
          style={{ padding: "6px 12px", borderRadius: 10, fontSize: 14, background: "#fff", border: `1px solid ${THEME.border}`, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
