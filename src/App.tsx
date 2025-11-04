import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";

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
  const [category, setCategory] = useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");

  const filtered = useMemo(() => {
    if (category === "All") return MENU;
    return MENU.filter((m) => m.category === category);
  }, [category]);

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
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="header-content">
            <div className="logo">E</div>
            <div className="header-text">
              <h1 className="restaurant-name">{RESTAURANT.name}</h1>
              <p className="tagline">{RESTAURANT.tagline}</p>
            </div>
          </div>
        </div>

        {/* Order Type Bar */}
        <div className="order-type-bar">
          <div className="order-type-content">
            <div className="location-time">
              <span className="location">PICKUP ASAP • {RESTAURANT.address}</span>
            </div>
            <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
          </div>
        </div>

        {/* Promo Banner */}
        <div className="promo-banner">
          <div className="promo-content">
            <button className="promo-btn">{RESTAURANT.promo.label}</button>
            <span className="promo-text">{RESTAURANT.promo.text}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Categories Navigation */}
          <nav className="categories-nav">
            <div className="categories-scroll">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`category-tab ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                  {cat !== "All" && <span className="item-count"> ({MENU.filter(m => m.category === cat).length})</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Menu Sections */}
          <div className="menu-sections">
            {[...grouped.entries()].map(([cat, items]) =>
              items.length ? (
                <section key={cat} className="menu-section">
                  <h2 className="section-title">{cat}</h2>
                  <div className="items-grid">
                    {items.map((item) => (
                      <div key={item.id} className="menu-item">
                        <div className="item-content">
                          <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            {item.desc && <p className="item-desc">{item.desc}</p>}
                            {item.badge && <span className="badge">{item.badge}</span>}
                          </div>
                          <div className="item-actions">
                            <div className="price">{money(item.price)}</div>
                            <button 
                              onClick={() => addToCart(item)}
                              className="add-btn"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <aside className="cart-sidebar">
          <div className="cart-card">
            <h2 className="cart-title">Your Order</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty. Add something tasty!</p>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-main">
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          {item.note && <div className="item-note">Note: {item.note}</div>}
                        </div>
                        <div className="item-controls">
                          <div className="item-price">{money(item.price * item.qty)}</div>
                          <div className="quantity-controls">
                            <button onClick={() => changeQty(item.id, -1)} className="qty-btn">−</button>
                            <span className="qty-display">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} className="qty-btn">+</button>
                          </div>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => setNoteFor(item.id)} className="action-btn">
                          {item.note ? "Edit note" : "Add note"}
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="action-btn remove">
                          Remove
                        </button>
                      </div>

                      {noteFor === item.id && (
                        <NoteEditor
                          initial={item.note || ""}
                          onCancel={() => setNoteFor(null)}
                          onSave={(val) => applyNote(item.id, val)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="cart-totals">
                  <div className="total-line">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="total-line">
                    <span>Tax</span>
                    <span>{money(tax)}</span>
                  </div>
                  <div className="total-line final">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="checkout-section">
                  {mode === "Delivery" ? (
                    <a
                      href={RESTAURANT.links.uberEats}
                      target="_blank"
                      rel="noreferrer"
                      className="checkout-btn"
                    >
                      Continue on Uber Eats
                    </a>
                  ) : (
                    <button className="checkout-btn">
                      Place Pickup Order
                    </button>
                  )}
                  <p className="checkout-note">
                    * Online checkout not wired in this demo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="info-card">
            <h3 className="info-title">Visit us</h3>
            <p className="info-address">{RESTAURANT.address}</p>
            <p className="info-phone">{RESTAURANT.phone}</p>
            <div className="hours-grid">
              {RESTAURANT.hours.map((hour) => (
                <div key={hour.d} className="hour-line">
                  <span className="day">{hour.d}</span>
                  <span className="time">{hour.h}</span>
                </div>
              ))}
            </div>
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
    <div className="toggle">
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
        placeholder="Add ketchup, extra onions, no pickles…"
        className="note-input"
      />
      <div className="note-actions">
        <button onClick={() => onSave(val)} className="btn primary">
          Save note
        </button>
        <button onClick={onCancel} className="btn">
          Cancel
        </button>
      </div>
    </div>
  );
}
