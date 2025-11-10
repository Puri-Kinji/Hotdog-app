import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";
import logo from "./assets/Yellow + Black Logo_Earle_s on Crenshaw.png";

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

const money = (n: number) => `$${n.toFixed(2)}`;

/* -------------------- App -------------------- */
export default function App() {
  const [category, setCategory] = useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [page, setPage] = useState<"menu" | "checkout">("menu");

  const filtered = useMemo(
    () => (category === "All" ? MENU : MENU.filter((m) => m.category === category)),
    [category]
  );

  const grouped = useMemo(() => {
    const m = new Map<MenuItem["category"], MenuItem[]>();
    CATEGORIES.forEach((c) => m.set(c, []));
    filtered.forEach((i) => m.get(i.category)!.push(i));
    return m;
  }, [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = +(subtotal * 0.095).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  function addToCart(item: MenuItem) {
    setCart((c) =>
      c.find((l) => l.id === item.id)
        ? c.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    );
  }

  /* -------- Checkout Page -------- */
  if (page === "checkout") {
    return (
      <div className="checkout-screen">
        <h1>Checkout</h1>

        {cart.map((item) => (
          <div key={item.id} className="checkout-line">
            {item.qty}× {item.name} — {money(item.qty * item.price)}
          </div>
        ))}

        <hr />
        <div className="checkout-total">
          <span>Total:</span>
          <strong>{money(total)}</strong>
        </div>

        <button className="place-order-btn">Place Order</button>
        <button className="back-btn" onClick={() => setPage("menu")}>Back to Menu</button>
      </div>
    );
  }

  /* -------- Menu Page -------- */
  return (
    <div className="app">
      <header className="header">
        <img src={logo} className="logo-image" alt="Earle's Logo" />
        <h1>{RESTAURANT.name}</h1>
      </header>

      <nav className="categories-nav">
        {["All", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat as any)}>
            {cat}
          </button>
        ))}
      </nav>

      <main className="menu">
        {[...grouped.entries()].map(([cat, items]) =>
          items.length ? (
            <section key={cat}>
              <h2>{cat}</h2>
              {items.map((item) => (
                <div key={item.id} className="menu-line">
                  <span>{item.name}</span>
                  <span>{money(item.price)}</span>
                  <button onClick={() => addToCart(item)}>Add</button>
                </div>
              ))}
            </section>
          ) : null
        )}
      </main>

      <aside className="sidebar">
        <h3>Your Order</h3>
        {cart.map((item) => (
          <div key={item.id}>
            {item.qty}× {item.name}
          </div>
        ))}

        <hr />
        <p>Total: {money(total)}</p>

        {cart.length > 0 && (
          <button className="checkout-btn" onClick={() => setPage("checkout")}>
            Go to Checkout
          </button>
        )}
      </aside>
    </div>
  );
}
