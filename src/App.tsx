import { useMemo, useState } from "react";
import "./index.css";
import "./App.css";

/* -------------------- Types -------------------- */
type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "Dogs & Links" | "Burgers & Sandwiches" | "Chips" | "Fries" | "Chili Bowls" | "Extras" | "Drinks" | "Desserts";
  desc?: string;
  badge?: "Vegan" | "Spicy" | "Kosher" | "New" | "Popular";
  options?: ItemOption[];
};

type ItemOption = {
  name: string;
  required: boolean;
  multiSelect: boolean;
  minSelections?: number;
  maxSelections?: number;
  choices: OptionChoice[];
};

type OptionChoice = {
  name: string;
  price: number;
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  customizations?: { [optionName: string]: string[] };
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

/* -------------------- Option Data -------------------- */
const BREAD_CHOICES: OptionChoice[] = [
  { name: "Regular Bun", price: 0 },
  { name: "Whole Wheat Bun", price: 0 },
  { name: "Lettuce Wrap", price: 0 },
  { name: "Gluten-Free Bun", price: 1.00 },
];

const TOPPING_CHOICES: OptionChoice[] = [
  { name: "Lettuce", price: 0 },
  { name: "Tomato", price: 0 },
  { name: "Onion", price: 0 },
  { name: "Pickles", price: 0 },
  { name: "Jalapeños", price: 0 },
  { name: "Ketchup", price: 0 },
  { name: "Mustard", price: 0 },
  { name: "Mayonnaise", price: 0 },
];

const PAID_TOPPING_CHOICES: OptionChoice[] = [
  { name: "Cheese", price: 0.75 },
  { name: "Bacon", price: 1.50 },
  { name: "Avocado", price: 1.50 },
  { name: "Grilled Onions", price: 0.50 },
  { name: "Grilled Mushrooms", price: 1.00 },
  { name: "Fried Egg", price: 1.50 },
  { name: "Extra Patty", price: 4.00 },
];

const HOT_DOG_OPTIONS: ItemOption[] = [
  {
    name: "Bread Choice",
    required: true,
    multiSelect: false,
    choices: BREAD_CHOICES
  },
  {
    name: "Toppings",
    required: false,
    multiSelect: true,
    minSelections: 0,
    maxSelections: 8,
    choices: TOPPING_CHOICES
  },
  {
    name: "Paid Toppings",
    required: false,
    multiSelect: true,
    minSelections: 0,
    maxSelections: 5,
    choices: PAID_TOPPING_CHOICES
  }
];

const BURGER_OPTIONS: ItemOption[] = [
  {
    name: "Bread Choice",
    required: true,
    multiSelect: false,
    choices: BREAD_CHOICES
  },
  {
    name: "Toppings",
    required: false,
    multiSelect: true,
    minSelections: 0,
    maxSelections: 8,
    choices: TOPPING_CHOICES
  },
  {
    name: "Paid Toppings",
    required: false,
    multiSelect: true,
    minSelections: 0,
    maxSelections: 5,
    choices: PAID_TOPPING_CHOICES
  }
];

/* -------------------- Data -------------------- */
const MENU: MenuItem[] = [
  // Dogs & Links - with options
  { id: "turkey-dog", name: "Turkey Dog", price: 4.99, category: "Dogs & Links", options: HOT_DOG_OPTIONS },
  { id: "beef-dog", name: "Beef Dog (Kosher)", price: 6.49, category: "Dogs & Links", badge: "Kosher", options: HOT_DOG_OPTIONS },
  { id: "beef-jumbo", name: "Beef Jumbo (Kosher)", price: 7.99, category: "Dogs & Links", badge: "Kosher", options: HOT_DOG_OPTIONS },
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 9.49, category: "Dogs & Links", badge: "Spicy", options: HOT_DOG_OPTIONS },
  { id: "chicken-link", name: "Chicken Link (Pork Casing)", price: 9.49, category: "Dogs & Links", options: HOT_DOG_OPTIONS },
  { id: "vegan-dog", name: "Vegan Dog", price: 7.99, category: "Dogs & Links", badge: "Vegan", options: HOT_DOG_OPTIONS },
  { id: "vegan-link", name: "Vegan Link", price: 9.49, category: "Dogs & Links", badge: "Vegan", options: HOT_DOG_OPTIONS },
  { id: "pastrami-dog", name: "Pastrami Dog", price: 9.99, category: "Dogs & Links", options: HOT_DOG_OPTIONS },

  // Burgers & Sandwiches - with options
  { id: "turkey-burger", name: "Turkey Burger", price: 9.99, category: "Burgers & Sandwiches", options: BURGER_OPTIONS },
  { id: "salmon-burger", name: "Salmon Burger", price: 9.99, category: "Burgers & Sandwiches", options: BURGER_OPTIONS },
  { id: "vegan-burger", name: "Vegan Burger", price: 13.99, category: "Burgers & Sandwiches", badge: "Vegan", options: BURGER_OPTIONS },
  { id: "pastrami-burger", name: "Pastrami Burger", price: 9.99, category: "Burgers & Sandwiches", options: BURGER_OPTIONS },
  { id: "double-turkey-burger", name: "Double Turkey Burger", price: 13.99, category: "Burgers & Sandwiches", options: BURGER_OPTIONS },
  { id: "double-salmon-burger", name: "Double Salmon Burger", price: 13.99, category: "Burgers & Sandwiches", options: BURGER_OPTIONS },
  { id: "double-vegan-burger", name: "Double Vegan Burger", price: 13.99, category: "Burgers & Sandwiches", badge: "Vegan", options: BURGER_OPTIONS },
  { id: "just-bun", name: "Just Bun", price: 1.00, category: "Burgers & Sandwiches" },

  // Other categories (no options)
  { id: "chips", name: "Chips", price: 1.25, category: "Chips" },
  { id: "beef-chili-fritos", name: "Beef Chili Fritos", price: 3.99, category: "Chips" },
  { id: "beef-chili-cheese-fritos", name: "Beef Chili Cheese Fritos", price: 5.49, category: "Chips" },
  { id: "vegan-chili-fritos", name: "Vegan Chili Fritos", price: 6.49, category: "Chips", badge: "Vegan" },
  { id: "vegan-chili-fritos-regular-cheese", name: "Vegan Chili Fritos w/Regular Cheese", price: 7.49, category: "Chips" },
  { id: "vegan-chili-fritos-vegan-cheese", name: "Vegan Chili Fritos w/Vegan Cheese", price: 8.49, category: "Chips", badge: "Vegan" },

  { id: "fries", name: "Fries", price: 5.49, category: "Fries" },
  { id: "beef-chili-fries", name: "Beef Chili Fries", price: 6.99, category: "Fries" },
  { id: "beef-chili-fries-regular-cheese", name: "Beef Chili Fries w/Regular Cheese", price: 7.49, category: "Fries" },
  { id: "vegan-chili-fries", name: "Vegan Chili Fries", price: 8.49, category: "Fries", badge: "Vegan" },
  { id: "vegan-chili-fries-regular-cheese", name: "Vegan Chili Fries w/Regular Cheese", price: 8.99, category: "Fries" },
  { id: "vegan-chili-fries-vegan-cheese", name: "Vegan Chili Fries w/Vegan Cheese", price: 11.99, category: "Fries", badge: "Vegan" },

  { id: "beef-chili-bowl-small", name: "Beef Chili Bowl Small", price: 4.49, category: "Chili Bowls" },
  { id: "beef-chili-bowl-medium", name: "Beef Chili Bowl Medium", price: 6.49, category: "Chili Bowls" },
  { id: "beef-chili-bowl-large", name: "Beef Chili Bowl Large", price: 8.49, category: "Chili Bowls" },
  { id: "vegan-chili-bowl-small", name: "Vegan Chili Bowl Small", price: 7.99, category: "Chili Bowls", badge: "Vegan" },
  { id: "vegan-chili-bowl-medium", name: "Vegan Chili Bowl Medium", price: 11.99, category: "Chili Bowls", badge: "Vegan" },
  { id: "vegan-chili-bowl-large", name: "Vegan Chili Bowl Large", price: 15.99, category: "Chili Bowls", badge: "Vegan" },

  { id: "jamaican-patty", name: "Jamaican Patty", price: 5.00, category: "Extras" },
  { id: "cheese", name: "Cheese (American, Cheddar)", price: 0.75, category: "Extras" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "Extras", badge: "Vegan" },
  { id: "beef-chili-scoop", name: "Beef Chili Scoop", price: 1.0, category: "Extras" },
  { id: "vegan-chili-scoop", name: "Vegan Chili Scoop", price: 2.49, category: "Extras", badge: "Vegan" },

  { id: "cakes", name: "Cakes", price: 8.49, category: "Desserts" },
  { id: "vegan-cakes", name: "Vegan Cakes", price: 7.49, category: "Desserts", badge: "Vegan" },
  { id: "cheese-cake", name: "Cheese Cake", price: 7.99, category: "Desserts" },
  { id: "cobbler", name: "Cobbler", price: 4.99, category: "Desserts" },
  { id: "coffee-cake", name: "Coffee Cake", price: 4.99, category: "Desserts" },
  { id: "banana-pudding", name: "Banana Pudding", price: 6.99, category: "Desserts" },
  { id: "pecan-pie", name: "Pecan Pie", price: 4.99, category: "Desserts" },
  { id: "bean-pie", name: "Bean Pie", price: 4.99, category: "Desserts" },
  { id: "sweet-potato-pie", name: "Sweet Potato Pie", price: 4.99, category: "Desserts" },

  { id: "small-drink", name: "Small Drink", price: 4.49, category: "Drinks" },
  { id: "large-drink", name: "Large Drink", price: 5.49, category: "Drinks" },
  { id: "bottled-water", name: "Bottled Water", price: 1.49, category: "Drinks" },
  { id: "can-soda", name: "Can Soda", price: 2.49, category: "Drinks" },
  { id: "snapple", name: "Snapple", price: 3.79, category: "Drinks" },
  { id: "welches", name: "Welches", price: 3.79, category: "Drinks" },
  { id: "playas-punch-half-gallon", name: "Playa's Punch 1/2 Gallon", price: 9.99, category: "Drinks" },
  { id: "playas-punch-two-half-gallons", name: "Playa's Punch 2 Half Gallons", price: 17.99, category: "Drinks" },
  { id: "coconut-water", name: "Coconut Water", price: 5.49, category: "Drinks" },
  { id: "honey-punch", name: "Honey Punch", price: 7.99, category: "Drinks" },
  { id: "shirley-temple-soda", name: "Shirley Temple Soda", price: 3.79, category: "Drinks" },
  { id: "root-beer", name: "Root Beer", price: 3.79, category: "Drinks" },
  { id: "creme-soda", name: "Creme Soda", price: 3.79, category: "Drinks" },
  { id: "ginger-beer", name: "Ginger Beer", price: 3.79, category: "Drinks" },
  { id: "blood-orange", name: "Blood Orange", price: 3.79, category: "Drinks" },
  { id: "apryls-juice", name: "Apryl's Juice", price: 7.99, category: "Drinks" },
  { id: "large-ice-cup", name: "Large Ice Cup", price: 1.00, category: "Drinks" },
  { id: "large-cup-water", name: "Large Cup of Water", price: 1.00, category: "Drinks" },
  { id: "water-cup", name: "Water Cup", price: 0.00, category: "Drinks" },
  { id: "playas-punch-to-go", name: "Playas Punch to go (16 Oz)", price: 4.79, category: "Drinks" },
];

const CATEGORIES: MenuItem["category"][] = [
  "Dogs & Links",
  "Burgers & Sandwiches",
  "Chips",
  "Fries", 
  "Chili Bowls",
  "Extras",
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
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<{ [optionName: string]: string[] }>({});

  const filtered = useMemo(() => {
    if (category === "All") return MENU;
    return MENU.filter((m) => m.category === category);
  }, [category]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const taxRate = 0.095;
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  function startCustomizing(item: MenuItem) {
    if (item.options) {
      setCustomizingItem(item);
      // Initialize customizations with empty arrays
      const initialCustomizations: { [optionName: string]: string[] } = {};
      item.options.forEach(option => {
        initialCustomizations[option.name] = [];
      });
      setCustomizations(initialCustomizations);
    } else {
      // If no options, add directly to cart
      addToCart(item);
    }
  }

  function handleCustomization(optionName: string, choiceName: string, isSelected: boolean) {
    setCustomizations(prev => {
      const newCustomizations = { ...prev };
      
      if (isSelected) {
        // Add the choice
        if (!newCustomizations[optionName].includes(choiceName)) {
          newCustomizations[optionName] = [...newCustomizations[optionName], choiceName];
        }
      } else {
        // Remove the choice
        newCustomizations[optionName] = newCustomizations[optionName].filter(name => name !== choiceName);
      }
      
      return newCustomizations;
    });
  }

  function addCustomizedItem() {
    if (!customizingItem) return;

    const customizationsWithNames: { [optionName: string]: string[] } = {};
    Object.keys(customizations).forEach(optionName => {
      customizationsWithNames[optionName] = [...customizations[optionName]];
    });

    // Calculate additional price from paid toppings
    let additionalPrice = 0;
    if (customizingItem.options) {
      customizingItem.options.forEach(option => {
        if (option.name === "Paid Toppings") {
          option.choices.forEach(choice => {
            if (customizations[option.name]?.includes(choice.name)) {
              additionalPrice += choice.price;
            }
          });
        }
      });
    }

    const cartItem: CartLine = {
      id: customizingItem.id,
      name: customizingItem.name,
      price: customizingItem.price + additionalPrice,
      qty: 1,
      customizations: customizationsWithNames
    };

    setCart((c) => {
      const exists = c.find((l) => 
        l.id === cartItem.id && 
        JSON.stringify(l.customizations) === JSON.stringify(cartItem.customizations)
      );
      return exists
        ? c.map((l) => 
            l.id === cartItem.id && 
            JSON.stringify(l.customizations) === JSON.stringify(cartItem.customizations)
              ? { ...l, qty: l.qty + 1 }
              : l
          )
        : [...c, cartItem];
    });

    setCustomizingItem(null);
    setCustomizations({});
  }

  function addToCart(item: MenuItem) {
    setCart((c) => {
      const exists = c.find((l) => l.id === item.id && !l.customizations);
      return exists
        ? c.map((l) => (l.id === item.id && !l.customizations ? { ...l, qty: l.qty + 1 } : l))
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
                              onClick={() => startCustomizing(item)}
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
                    <div key={item.id + JSON.stringify(item.customizations)} className="cart-item">
                      <div className="cart-item-main">
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="customizations">
                              {Object.entries(item.customizations).map(([optionName, choices]) => 
                                choices.length > 0 && (
                                  <div key={optionName} className="customization-line">
                                    <strong>{optionName}:</strong> {choices.join(", ")}
                                  </div>
                                )
                              )}
                            </div>
                          )}
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

      {/* Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          customizations={customizations}
          onCustomizationChange={handleCustomization}
          onAddToCart={addCustomizedItem}
          onClose={() => {
            setCustomizingItem(null);
            setCustomizations({});
          }}
        />
      )}
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

function CustomizationModal({
  item,
  customizations,
  onCustomizationChange,
  onAddToCart,
  onClose,
}: {
  item: MenuItem;
  customizations: { [optionName: string]: string[] };
  onCustomizationChange: (optionName: string, choiceName: string, isSelected: boolean) => void;
  onAddToCart: () => void;
  onClose: () => void;
}) {
  const [currentPrice, setCurrentPrice] = useState(item.price);

  // Calculate current price including customizations
  useMemo(() => {
    let price = item.price;
    if (item.options) {
      item.options.forEach(option => {
        if (option.name === "Paid Toppings") {
          option.choices.forEach(choice => {
            if (customizations[option.name]?.includes(choice.name)) {
              price += choice.price;
            }
          });
        }
      });
    }
    setCurrentPrice(price);
  }, [customizations, item]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Customize {item.name}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          {item.options?.map((option) => (
            <div key={option.name} className="option-section">
              <div className="option-header">
                <h3 className="option-name">{option.name}</h3>
                <div className="option-requirements">
                  {option.required && <span className="required-badge">Required</span>}
                  {option.multiSelect && (
                    <span className="multi-select-badge">
                      {option.minSelections || 0}-{option.maxSelections || '∞'} selections
                    </span>
                  )}
                </div>
              </div>
              
              <div className="option-choices">
                {option.choices.map((choice) => {
                  const isSelected = customizations[option.name]?.includes(choice.name);
                  return (
                    <label key={choice.name} className="choice-label">
                      <input
                        type={option.multiSelect ? "checkbox" : "radio"}
                        name={option.name}
                        checked={isSelected}
                        onChange={(e) => onCustomizationChange(option.name, choice.name, e.target.checked)}
                        className="choice-input"
                      />
                      <span className="choice-text">
                        {choice.name}
                        {choice.price > 0 && (
                          <span className="choice-price">+{money(choice.price)}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-footer">
          <div className="modal-price">{money(currentPrice)}</div>
          <button onClick={onAddToCart} className="modal-add-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
