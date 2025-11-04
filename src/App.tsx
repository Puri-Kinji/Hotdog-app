import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";

/* -------------------- Theme -------------------- */
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

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
};

/* -------------------- Config -------------------- */
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

/* -------------------- Data -------------------- */
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      <header className="site-header">
        <div className="header-container">
          <div className="header-main">
            <div
              className="logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: THEME.black,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              E
            </div>
            <div className="header-text">
              <h1 className="h1">{RESTAURANT.name}</h1>
              <p className="tagline">{RESTAURANT.tagline}</p>
            </div>

            {/* Desktop Search */}
            <div className="desktop-search">
              <input
                aria-label="Search menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu…"
                className="search-input"
              />
            </div>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="mobile-search-trigger"
              aria-label="Search menu"
            >
              🔍
            </button>

            {/* Mode toggle + Delivery link */}
            <div className="header-actions">
              <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
              {mode === "Delivery" && (
                <a
                  href={RESTAURANT.links.uberEats}
                  target="_blank"
                  rel="noreferrer"
                  className="delivery-link"
                >
                  Order on Uber Eats
                </a>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          {showMobileSearch && (
            <div className="mobile-search-container">
              <input
                aria-label="Search menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu…"
                className="mobile-search-input"
                autoFocus
              />
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="close-search-btn"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Promo strip */}
        <div className="promo-strip">
          <div className="promo-container">
            <a
              href={RESTAURANT.links.doorDash}
              target="_blank"
              rel="noreferrer"
              className="promo-btn"
            >
              {RESTAURANT.promo.label}
            </a>
            <span className="promo-text">{RESTAURANT.promo.text}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-container main-grid">
        {/* Left: Menu */}
        <section className="menu-section">
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
              <div key={cat} className="category-section">
                <h2 className="h2">{cat}</h2>
                <div className="menu-grid">
                  {items.map((it) => (
                    <article key={it.id} className="menu-card">
                      <div className="menu-card-content">
                        <div className="menu-item-info">
                          <h3 className="menu-item-name">{it.name}</h3>
                          {it.desc && (
                            <p className="menu-item-desc">{it.desc}</p>
                          )}
                          {it.badge && <span className="badge">{it.badge}</span>}
                        </div>
                        <div className="menu-item-actions">
                          <div className="price">{money(it.price)}</div>
                          <button 
                            onClick={() => addToCart(it)} 
                            className="btn btn-primary add-to-cart-btn"
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
        <aside className="cart-aside">
          <div className="cart-card">
            <h2 className="h2">Your Order</h2>
            {!cart.length && (
              <p className="empty-cart-message">
                Your cart is empty. Add something tasty!
              </p>
            )}

            {!!cart.length && (
              <div className="cart-items">
                {cart.map((l) => (
                  <div
                    key={l.id}
                    className="cart-item"
                  >
                    <div className="cart-item-main">
                      <div className="cart-item-info">
                        <div className="cart-item-name">{l.name}</div>
                        {l.note && (
                          <div className="cart-item-note">Note: {l.note}</div>
                        )}
                      </div>
                      <div className="cart-item-controls">
                        <div className="cart-item-price">{money(l.price * l.qty)}</div>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => changeQty(l.id, -1)} 
                            className="btn quantity-btn"
                          >-</button>
                          <span className="quantity-display">{l.qty}</span>
                          <button 
                            onClick={() => changeQty(l.id, +1)} 
                            className="btn quantity-btn"
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <button 
                        onClick={() => setNoteFor(l.id)} 
                        className="btn-ghost"
                      >
                        {l.note ? "Edit note" : "Add note"}
                      </button>
                      <button 
                        onClick={() => removeFromCart(l.id)} 
                        className="btn-ghost remove-btn"
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
                <div className="cart-totals">
                  <div className="total-line">
                    <span>Subtotal</span><span>{money(subtotal)}</span>
                  </div>
                  <div className="total-line">
                    <span>Tax</span><span>{money(tax)}</span>
                  </div>
                  <div className="total-line final-total">
                    <span>Total</span><span>{money(total)}</span>
                  </div>
                </div>

                {/* Checkout actions */}
                <div className="checkout-actions">
                  {mode === "Delivery" ? (
                    <a
                      href={RESTAURANT.links.uberEats}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary checkout-btn"
                    >
                      Continue on Uber Eats
                    </a>
                  ) : (
                    <button className="btn btn-primary checkout-btn">
                      Place Pickup Order (demo)
                    </button>
                  )}
                  <p className="checkout-disclaimer">
                    * Online checkout not wired in this demo. Link out to delivery partners or add your own API.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="info-card">
            <div className="info-title">Visit us</div>
            <div className="info-address">{RESTAURANT.address}</div>
            <div className="info-phone">{RESTAURANT.phone}</div>
            <div className="hours-grid">
              {RESTAURANT.hours.map((h) => (
                <div key={h.d} className="hour-line">
                  <span className="hour-day">{h.d}</span>
                  <span className="hour-time">{h.h}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-copyright">
            © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
          </div>
          <div className="footer-links">
            <a href={RESTAURANT.links.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={RESTAURANT.links.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            <a href={RESTAURANT.links.doorDash} target="_blank" rel="noreferrer">DoorDash</a>
            <a href={RESTAURANT.links.uberEats} target="_blank" rel="noreferrer">Uber Eats</a>
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
    <div className="toggle-container">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt as T)}
          className={`toggle-option ${value === opt ? 'active' : ''}`}
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
    <div className="category-bar">
      <div className="category-scroll">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => onPick(c)}
            className={`category-btn ${active === c ? 'active' : ''}`}
          >
            {c} {c !== "All" && <span className="category-count">({counts[c] || 0})</span>}
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
    <div className="note-editor">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        className="note-textarea"
        placeholder="Add ketchup, extra onions, no pickles…"
      />
      <div className="note-actions">
        <button onClick={() => onSave(val)} className="btn btn-primary">Save note</button>
        <button onClick={onCancel} className="btn">Cancel</button>
      </div>
    </div>
  );
}
