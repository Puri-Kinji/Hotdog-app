// ✅ App.tsx — Original layout restored, Checkout button updated

import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";
import logo from "./assets/Yellow + Black Logo_Earle_s on Crenshaw.png";

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
};

/* -------------------- Menu Data -------------------- */
const MENU: MenuItem[] = [
  // Dogs & Links
  { id: "turkey-dog", name: "Turkey Dog", price: 4.99, category: "Dogs & Links" },
  { id: "beef-dog", name: "Beef Dog (Kosher)", price: 6.49, category: "Dogs & Links", badge: "Kosher" },
  { id: "beef-jumbo", name: "Beef Jumbo (Kosher)", price: 7.99, category: "Dogs & Links", badge: "Kosher" },
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 9.49, category: "Dogs & Links", badge: "Spicy" },
  { id: "chicken-link", name: "Chicken Link (Pork Casing)", price: 9.49, category: "Dogs & Links" },
  { id: "vegan-dog", name: "Vegan Dog", price: 7.99, category: "Dogs & Links", badge: "Vegan" },
  { id: "vegan-link", name: "Vegan Link", price: 9.49, category: "Dogs & Links", badge: "Vegan" },
  { id: "pastrami-dog", name: "Pastrami Dog", price: 9.99, category: "Dogs & Links" },

  // Burgers & Sandwiches
  { id: "turkey-burger", name: "Turkey Burger", price: 9.99, category: "Burgers & Sandwiches" },
  { id: "salmon-burger", name: "Salmon Burger", price: 9.99, category: "Burgers & Sandwiches" },
  { id: "vegan-burger", name: "Vegan Burger", price: 13.99, category: "Burgers & Sandwiches", badge: "Vegan" },
  { id: "pastrami-burger", name: "Pastrami Burger", price: 9.99, category: "Burgers & Sandwiches" },
  { id: "double-turkey-burger", name: "Double Turkey Burger", price: 13.99, category: "Burgers & Sandwiches" },
  { id: "double-salmon-burger", name: "Double Salmon Burger", price: 13.99, category: "Burgers & Sandwiches" },
  { id: "double-vegan-burger", name: "Double Vegan Burger", price: 16.99, category: "Burgers & Sandwiches", badge: "Vegan" },

  // Sides & Extras
  { id: "cheese", name: "Cheese (American, Cheddar)", price: 0.75, category: "Sides & Extras" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "Sides & Extras", badge: "Vegan" },
  { id: "beef-chili-scoop", name: "Beef Chili Scoop", price: 1.0, category: "Sides & Extras" },
  { id: "vegan-chili-scoop", name: "Vegan Chili Scoop", price: 2.49, category: "Sides & Extras", badge: "Vegan" },

  // Drinks
  { id: "small-cup", name: "Small Cup (Lemonade, Playas Punch)", price: 3.99, category: "Drinks" },
  { id: "large-cup", name: "Large Cup (Lemonade, Playas Punch)", price: 4.99, category: "Drinks" },
  { id: "soda-can", name: "Soda Can", price: 2.25, category: "Drinks" },

  // ✅ Desserts Added
  { id: "cakes", name: "Cakes", price: 8.49, category: "Desserts" },
  { id: "vegan-cakes", name: "Vegan Cakes", price: 7.49, category: "Desserts", badge: "Vegan" },
  { id: "cheese-cake", name: "Cheese Cake", price: 7.99, category: "Desserts" },
  { id: "cobbler", name: "Cobbler", price: 4.99, category: "Desserts" },
  { id: "coffee-cake", name: "Coffee Cake", price: 4.99, category: "Desserts" },
  { id: "banana-pudding", name: "Banana Pudding", price: 6.99, category: "Desserts" },
  { id: "pecan-pie", name: "Pecan Pie", price: 4.99, category: "Desserts" },
  { id: "bean-pie", name: "Bean Pie", price: 4.99, category: "Desserts" },
  { id: "sweet-potato-pie", name: "Sweet Potato Pie", price: 4.99, category: "Desserts" },
];

/* -------------------- Helpers -------------------- */
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

/* -------------------- App Component -------------------- */
export default function RestaurantApp() {
  const [category, setCategory] =
    useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [showNoteEditor, setShowNoteEditor] =
    useState<string | null>(null);
  const [mode, setMode] = useState("Pickup");

  const filtered = useMemo(() => {
    if (category === "All") return MENU;
    return MENU.filter((m) => m.category === category);
  }, [category]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = +(subtotal * 0.095).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  function addToCart(item: MenuItem) {
    setCart((c) => {
      const exists = c.find((l) => l.id === item.id);
      return exists
        ? c.map((l) =>
            l.id === item.id ? { ...l, qty: l.qty + 1 } : l
          )
        : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCart((c) => c.filter((l) => l.id !== id));
  }

  function changeQty(id: string, delta: number) {
    setCart((c) =>
      c
        .map((l) =>
          l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l
        )
        .filter((l) => l.qty > 0)
    );
  }

  function applyNote(id: string, note: string) {
    setCart((c) =>
      c.map((l) => (l.id === id ? { ...l, note } : l))
    );
    setShowNoteEditor(null);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="header-content">
            <img src={logo} alt="Earle's on Crenshaw" className="logo-image" />
            <div className="header-text">
              <h1 className="restaurant-name">{RESTAURANT.name}</h1>
              <p className="tagline">{RESTAURANT.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main">
        {/* Category Tabs */}
        <nav className="categories-nav">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`category-tab ${category === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="menu-and-cart">
          {/* Menu */}
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

          {/* Cart */}
          <aside className="cart-sidebar">
            <div className="cart-card">
              <h2 className="cart-title">Your Order</h2>

              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        {item.note && <p className="item-note">Note: {item.note}</p>}
                      </div>

                      <div className="item-controls">
                        <button onClick={() => changeQty(item.id, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </div>

                      <button onClick={() => setShowNoteEditor(item.id)}>
                        {item.note ? "Edit note" : "Add note"}
                      </button>

                      {showNoteEditor === item.id && (
                        <NoteEditor
                          initial={item.note || ""}
                          onCancel={() => setShowNoteEditor(null)}
                          onSave={(val) => applyNote(item.id, val)}
                        />
                      )}
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="cart-totals">
                    <p>Subtotal: {money(subtotal)}</p>
                    <p>Tax: {money(tax)}</p>
                    <h3>Total: {money(total)}</h3>
                  </div>

                  {/* ✅ NEW CHECKOUT BUTTON */}
                  <button
                    className="checkout-btn"
                    onClick={() => (window.location.href = "/checkout")}
                  >
                    Go to Checkout
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* -------------------- Note Editor Component -------------------- */
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
      />
      <button onClick={() => onSave(val)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
