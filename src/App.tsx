import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";
import logo from "./assets/Yellow + Black Logo_Earle_s on Crenshaw.png";

/* ---------------------------------- Types ---------------------------------- */
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

/* -------------------------------- Restaurant Info ------------------------------- */
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

/* ---------------------------------- Menu Data ---------------------------------- */
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

  // Desserts
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

const CATEGORIES: MenuItem["category"][] = [
  "Dogs & Links",
  "Burgers & Sandwiches",
  "Sides & Extras",
  "Drinks",
  "Desserts",
];

/* ---------------------------------- Utilities --------------------------------- */
const money = (n: number) => `$${n.toFixed(2)}`;

function groupByCategory(items: MenuItem[]) {
  const m = new Map<MenuItem["category"], MenuItem[]>();
  for (const c of CATEGORIES) m.set(c, []);
  for (const it of items) m.get(it.category)!.push(it);
  return m;
}

/* ---------------------------------- App ---------------------------------- */
export default function RestaurantApp() {
  const [category, setCategory] =
    useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [noteFor, setNoteFor] = useState<string | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? MENU : MENU.filter((m) => m.category === category)),
    [category]
  );

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

  function removeFromCart(id: string) {
    setCart((c) => c.filter((l) => l.id !== id));
  }

  function changeQty(id: string, delta: number) {
    setCart((c) =>
      c
        .map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l))
        .filter((l) => l.qty > 0)
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
            <img src={logo} alt="Earle's on Crenshaw" className="logo-image" />
            <div className="header-text">
              <h1 className="restaurant-name">{RESTAURANT.name}</h1>
              <p className="tagline">{RESTAURANT.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="container">

          {/* Category Nav */}
          <nav className="categories-nav">
            <div className="categories-scroll">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`category-tab ${category === cat ? "active" : ""}`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className="item-count">
                      ({MENU.filter((m) => m.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

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
        </div>

        {/* Cart */}
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
                            <button onClick={() => changeQty(item.id, -1)} className="qty-btn">
                              −
                            </button>
                            <span className="qty-display">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} className="qty-btn">
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="cart-item-actions">
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

                <div className="checkout-section">
                  <button className="checkout-btn">Place Pickup Order</button>
                  <p className="checkout-note">* Online checkout not wired in this demo</p>
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

/* -------------------------------- Note Editor Component ------------------------------- */
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

  border-radius: 6px;
  width: fit-content;
}
