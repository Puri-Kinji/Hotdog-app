import { useMemo, useState } from "react";
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
      "https://www.ubereats.com/store/earles-on-crenshaw/li55HwiTQAWeXlk3hpvg5A",
    doorDash:
      "https://www.doordash.com/store/earle's-los-angeles-260651/81230038/",
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
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 8.99, category: "Dogs & Links", badge: "Spicy" },
  { id: "vegan-dog", name: "Vegan Dog", price: 7.49, category: "Dogs & Links", badge: "Vegan" },
  { id: "turkey-burger", name: "Turkey Burger", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "vegan-burger", name: "Vegan Burger", price: 12.99, category: "Burgers & Sandwiches", badge: "Vegan" },
  { id: "pastrami", name: "Pastrami Sandwich", price: 8.99, category: "Burgers & Sandwiches" },
  { id: "cheese", name: "Cheese (American, Cheddar)", price: 0.75, category: "Sides & Extras" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "Sides & Extras", badge: "Vegan" },
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

const money = (n: number) => `$${n.toFixed(2)}`;
function groupByCategory(items: MenuItem[]) {
  const m = new Map<MenuItem["category"], MenuItem[]>();
  for (const c of CATEGORIES) m.set(c, []);
  for (const it of items) m.get(it.category)!.push(it);
  return m;
}

/* -------------------- APP -------------------- */
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
  const tax = +(subtotal * 0.095).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  function addToCart(item: MenuItem) {
    setCart((c) => {
      const exists = c.find((l) => l.id === item.id);
      return exists
        ? c.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: THEME.bg, color: THEME.text }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: THEME.bg, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 16, background: THEME.black, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>E</div>
          <div style={{ flex: 1 }}>
            <h1>{RESTAURANT.name}</h1>
            <p>{RESTAURANT.tagline}</p>
          </div>
          <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
        </div>
        <div style={{ background: THEME.bg, borderTop: `1px solid ${THEME.border}`, padding: "8px 16px" }}>
          <a href={RESTAURANT.links.doorDash} target="_blank" rel="noreferrer" className="btn-primary">
            {RESTAURANT.promo.label}
          </a> <span>{RESTAURANT.promo.text}</span>
        </div>
      </header>

      {/* Main */}
      <main className="app-container main-grid">
        <section>
          <CategoryBar active={category} onPick={setCategory} counts={CATEGORIES.reduce((acc, c) => {
            acc[c] = MENU.filter((m) => m.category === c).length;
            return acc;
          }, {} as Record<string, number>)} />
          {[...grouped.entries()].map(([cat, items]) =>
            items.length ? (
              <div key={cat}>
                <h2>{cat}</h2>
                <div className="menu-grid">
                  {items.map((it) => (
                    <article key={it.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <h3>{it.name}</h3>
                          {it.badge && <span style={{ background: THEME.black, color: "#fff", borderRadius: 999, padding: "4px 8px", fontSize: 12 }}>{it.badge}</span>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700 }}>{money(it.price)}</div>
                          <button onClick={() => addToCart(it)}>Add</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </section>

        <aside className="cart-aside">
          <div className="card">
            <h2>Your Order</h2>
            {!cart.length && <p>Your cart is empty.</p>}
            {cart.map((l) => (
              <div key={l.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{l.name} x{l.qty}</span>
                  <strong>{money(l.price * l.qty)}</strong>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <>
                <p>Subtotal: {money(subtotal)}</p>
                <p>Tax: {money(tax)}</p>
                <h3>Total: {money(total)}</h3>
              </>
            )}
          </div>
        </aside>
      </main>

      <footer>
        <div>© {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.</div>
      </footer>
    </div>
  );
}

/* -------------------- Small Components -------------------- */
function Toggle<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] | T[]; }) {
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

function CategoryBar({ active, onPick, counts }: { active: MenuItem["category"] | "All"; onPick: (c: MenuItem["category"] | "All") => void; counts: Record<string, number>; }) {
  const cats: (MenuItem["category"] | "All")[] = ["All", ...CATEGORIES];
  return (
    <div className="category-bar">
      <div style={{ display: "flex", gap: 8 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => onPick(c)} style={{
            padding: "6px 12px",
            borderRadius: 12,
            border: `1px solid ${active === c ? THEME.black : THEME.border}`,
            background: active === c ? THEME.black : "#fff",
            color: active === c ? "#fff" : THEME.text,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}>
            {c} {c !== "All" && <span style={{ opacity: 0.6 }}>({counts[c] || 0})</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
