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
  hasModifiers?: boolean;
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  bread?: string;
  toppings?: ToppingSelection[];
};

type Topping = {
  id: string;
  name: string;
  price: number;
  category: "bread" | "free" | "paid";
  isDefault?: boolean;
};

type ToppingSelection = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type ModifierState = {
  isOpen: boolean;
  item: MenuItem | null;
  selectedBread: string;
  toppings: ToppingSelection[];
  tempToppings: ToppingSelection[];
  isSideOrExtra?: boolean;
};

/* -------------------------------- Restaurant Info ------------------------------- */
const RESTAURANT = {
  name: "Earle's on Crenshaw",
  tagline: "Save time by ordering online!",
  address: "3864 Crenshaw BLVD",
  phone: "(323) 299-2867",
  hours: [
    { d: "Sunday", h: "Closed" },
    { d: "Monday", h: "11:00 AM – 9:00 PM" },
    { d: "Tuesday", h: "11:00 AM – 9:00 PM" },
    { d: "Wednesday", h: "11:00 AM – 9:00 PM" },
    { d: "Thursday", h: "11:00 AM – 9:00 PM" },
    { d: "Friday", h: "11:00 AM – 9:00 PM" },
    { d: "Saturday", h: "11:00 AM – 9:00 PM" },
  ],
};

/* ---------------------------------- Menu Data ---------------------------------- */
const MENU: MenuItem[] = [
  // Dogs & Links
  { id: "turkey-dog", name: "Turkey Dog", price: 4.99, category: "Dogs & Links", hasModifiers: true },
  { id: "beef-dog", name: "Beef Dog (Kosher)", price: 6.49, category: "Dogs & Links", badge: "Kosher", hasModifiers: true },
  { id: "beef-jumbo", name: "Beef Jumbo (Kosher)", price: 7.99, category: "Dogs & Links", badge: "Kosher", hasModifiers: true },
  { id: "spicy-beef-link", name: "Spicy Beef Link", price: 9.49, category: "Dogs & Links", badge: "Spicy", hasModifiers: true },
  { id: "chicken-link", name: "Chicken Link (Pork Casing)", price: 9.49, category: "Dogs & Links", hasModifiers: true },
  { id: "vegan-dog", name: "Vegan Dog", price: 7.99, category: "Dogs & Links", badge: "Vegan", hasModifiers: true },
  { id: "vegan-link", name: "Vegan Link", price: 9.49, category: "Dogs & Links", badge: "Vegan", hasModifiers: true },
  { id: "pastrami-dog", name: "Pastrami Dog", price: 9.99, category: "Dogs & Links", hasModifiers: true },

  // Burgers & Sandwiches
  { id: "turkey-burger", name: "Turkey Burger", price: 9.99, category: "Burgers & Sandwiches", hasModifiers: true },
  { id: "salmon-burger", name: "Salmon Burger", price: 9.99, category: "Burgers & Sandwiches", hasModifiers: true },
  { id: "vegan-burger", name: "Vegan Burger", price: 13.99, category: "Burgers & Sandwiches", badge: "Vegan", hasModifiers: true },
  { id: "pastrami-burger", name: "Pastrami Burger", price: 9.99, category: "Burgers & Sandwiches", hasModifiers: true },
  { id: "double-turkey-burger", name: "Double Turkey Burger", price: 13.99, category: "Burgers & Sandwiches", hasModifiers: true },
  { id: "double-salmon-burger", name: "Double Salmon Burger", price: 13.99, category: "Burgers & Sandwiches", hasModifiers: true },
  { id: "double-vegan-burger", name: "Double Vegan Burger", price: 16.99, category: "Burgers & Sandwiches", badge: "Vegan", hasModifiers: true },

  // Sides & Extras - Updated items
  { id: "french-fries", name: "FRENCH FRIES", price: 5.49, category: "Sides & Extras", hasModifiers: true },
  { id: "beef-chili-fries", name: "BEEF CHILI FRIES", price: 6.99, category: "Sides & Extras", hasModifiers: true },
  { id: "beef-chili-cheese-fries", name: "BEEF CHILI CHEESE FRIES", price: 7.49, category: "Sides & Extras", hasModifiers: true },
  { id: "vegan-chili-fries", name: "VEGAN CHILI FRIES", price: 8.49, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "vegan-chili-reg-cheese-fries", name: "VEGAN CHILI REG CHEESE FRIES", price: 8.99, category: "Sides & Extras", hasModifiers: true },
  { id: "vegan-chili-vegan-cheese-fries", name: "VEGAN CHILI VEGAN CHEESE FRIES", price: 11.99, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "small-beef-chili-bowl", name: "SMALL BEEF CHILI BOWL", price: 4.49, category: "Sides & Extras", hasModifiers: true },
  { id: "small-vegan-chili-bowl", name: "SMALL VEGAN CHILI BOWL", price: 7.99, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "medium-beef-chili-bowl", name: "MEDIUM BEEF CHILI BOWL", price: 6.49, category: "Sides & Extras", hasModifiers: true },
  { id: "medium-vegan-chili-bowl", name: "MEDIUM VEGAN CHILI BOWL", price: 11.99, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "large-beef-chili-bowl", name: "LARGE BEEF CHILI BOWL", price: 8.49, category: "Sides & Extras", hasModifiers: true },
  { id: "large-vegan-chili-bowl", name: "LARGE VEGAN CHILI BOWL", price: 15.99, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "beef-chili-cheese-fritos", name: "BEEF CHILI CHEESE FRITOS", price: 3.49, category: "Sides & Extras", hasModifiers: true },
  { id: "vegan-chili-cheese-fritos", name: "VEGAN CHILI CHEESE FRITOS - Regular Cheese", price: 5.49, category: "Sides & Extras", hasModifiers: true },
  { id: "vegan-chili-vegan-cheese-fritos", name: "VEGAN CHILI VEGAN CHEESE FRITOS", price: 7.74, category: "Sides & Extras", badge: "Vegan", hasModifiers: true },
  { id: "bag-of-chips", name: "BAG OF CHIPS", price: 1.00, category: "Sides & Extras" },

 // Drinks
{ id: "small-playas-punch", name: "SMALL PLAYAS PUNCH", price: 4.49, category: "Drinks" },
{ id: "large-playas-punch", name: "LARGE PLAYAS PUNCH", price: 5.49, category: "Drinks" },
{ id: "half-gallon-playas-punch", name: "1/2 GALLON PLAYAS PUNCH", price: 9.99, category: "Drinks" },
{ id: "playas-punch-special", name: "PLAYAS PUNCH SPECIAL - 2 Half Gallons", price: 17.99, category: "Drinks" },
{ id: "ginger-beer", name: "GINGER BEER", price: 3.79, category: "Drinks" },
{ id: "coconut-water", name: "COCONUT WATER", price: 5.49, category: "Drinks" },
{ id: "bottled-water", name: "BOTTLED WATER", price: 1.49, category: "Drinks" },
{ id: "honey-punch", name: "HONEY PUNCH", price: 7.99, category: "Drinks" },

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

/* ---------------------------------- Modifiers Data ---------------------------------- */
const BREAD_OPTIONS: Topping[] = [
  { id: "no-bread", name: "No Bread", price: 0.00, category: "bread", isDefault: false },
  { id: "white", name: "White", price: 0.00, category: "bread", isDefault: true },
  { id: "wheat", name: "Wheat", price: 0.00, category: "bread", isDefault: false },
  { id: "gluten-free", name: "Gluten Free", price: 0.50, category: "bread", isDefault: false },
];

const TOPPINGS: Topping[] = [
  // Free toppings
  { id: "mustard", name: "Mustard", price: 0.00, category: "free" },
  { id: "ketchup", name: "Ketchup", price: 0.00, category: "free" },
  { id: "relish", name: "Relish", price: 0.00, category: "free" },
  { id: "mayo", name: "Mayo", price: 0.00, category: "free" },
  { id: "vegan-mayo", name: "Vegan Mayo", price: 0.00, category: "free" },
  { id: "raw-onion", name: "Raw Onion", price: 0.00, category: "free" },
  { id: "ny-onions", name: "NY Onions (Sauteed)", price: 0.00, category: "free" },
  { id: "lettuce", name: "Lettuce", price: 0.00, category: "free" },
  { id: "tomato", name: "Tomato", price: 0.00, category: "free" },
  { id: "pickle", name: "Pickle", price: 0.00, category: "free" },
  { id: "jalapeno", name: "Jalapeno", price: 0.00, category: "free" },
  { id: "chipotle", name: "Chipotle", price: 0.00, category: "free" },
  { id: "hot-mustard", name: "Hot Mustard", price: 0.00, category: "free" },
  { id: "bbo", name: "BBQ", price: 0.00, category: "free" },
  { id: "vegan-chipotle", name: "Vegan Chipotle", price: 0.00, category: "free" },
  { id: "sauerkraut", name: "Sauerkraut", price: 0.00, category: "free" },
  { id: "tarter-sauce", name: "Tarter Sauce", price: 0.00, category: "free" },
  { id: "ranch", name: "Ranch", price: 0.00, category: "free" },
  { id: "hot-pepper", name: "Hot Pepper", price: 0.00, category: "free" },
  
  // Paid toppings
  { id: "cheddar", name: "Cheddar Cheese", price: 1.00, category: "paid" },
  { id: "american", name: "American Cheese", price: 1.00, category: "paid" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "paid" },
  { id: "beef-chili", name: "Beef Chili Scoop", price: 1.00, category: "paid" },
  { id: "vegan-chili", name: "Vegan Chili Scoop", price: 2.49, category: "paid" },
  { id: "pastrami", name: "Pastrami", price: 5.99, category: "paid" },
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

// Get current day and hours
function getCurrentDayInfo() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDay = days[today];
  const todayHours = RESTAURANT.hours.find(hour => hour.d === currentDay);
  return {
    day: currentDay,
    hours: todayHours ? todayHours.h : "Closed"
  };
}

/* ---------------------------------- App ---------------------------------- */
export default function RestaurantApp() {
  const [category, setCategory] =
    useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [modifierState, setModifierState] = useState<ModifierState>({
    isOpen: false,
    item: null,
    selectedBread: "",
    toppings: [],
    tempToppings: [],
    isSideOrExtra: false
  });

  const filtered = useMemo(
    () => (category === "All" ? MENU : MENU.filter((m) => m.category === category)),
    [category]
  );

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = +(subtotal * 0.095).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const { day, hours } = getCurrentDayInfo();

  // Calculate total price with modifiers
  const calculateModifierTotal = () => {
    if (!modifierState.item) return 0;
    
    let breadPrice = 0;
    // Only include bread price if it's NOT a side/extra
    if (!modifierState.isSideOrExtra) {
      breadPrice = BREAD_OPTIONS.find(b => b.id === modifierState.selectedBread)?.price || 0;
    }
    
    const toppingsTotal = modifierState.tempToppings.reduce((sum, topping) => 
      sum + (topping.price * topping.quantity), 0
    );
    
    return modifierState.item.price + breadPrice + toppingsTotal;
  };

  function addToCart(item: MenuItem) {
    if (item.hasModifiers) {
      // Check if it's a Sides & Extras item
      const isSideOrExtra = item.category === "Sides & Extras";
      
      // Open modifier modal with appropriate configuration
      const defaultBread = isSideOrExtra ? "no-bread" : (BREAD_OPTIONS.find(b => b.isDefault)?.id || BREAD_OPTIONS[0].id);
      
      setModifierState({
        isOpen: true,
        item,
        selectedBread: defaultBread,
        toppings: [],
        tempToppings: [],
        isSideOrExtra: isSideOrExtra
      });
    } else {
      // Add directly to cart for items without modifiers
      setCart((c) => {
        const exists = c.find((l) => l.id === item.id);
        return exists
          ? c.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
          : [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
      });
    }
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

  function toggleCart() {
    setShowCart(!showCart);
  }

  // Cancel modifiers
  const cancelModifiers = () => {
    setModifierState({
      isOpen: false,
      item: null,
      selectedBread: "",
      toppings: [],
      tempToppings: [],
      isSideOrExtra: false
    });
  };

  // Update topping quantity
  const updateToppingQuantity = (toppingId: string, quantity: number) => {
    setModifierState(prev => {
      const existing = prev.tempToppings.find(t => t.id === toppingId);

      // Count each topping as 1, even if extra
      const selectedCount = prev.tempToppings.filter(t => t.quantity > 0).length;

      // --- Remove topping ---
      if (quantity === 0) {
        return {
          ...prev,
          tempToppings: prev.tempToppings.filter(t => t.id !== toppingId)
        };
      }

      // --- Already selected (Normal → Extra allowed) ---
      if (existing) {
        return {
          ...prev,
          tempToppings: prev.tempToppings.map(t =>
            t.id === toppingId ? { ...t, quantity } : t
          )
        };
      }

      // --- NEW topping added ---
      if (selectedCount >= 6) {
        alert("You can choose up to 6 toppings total.");
        return prev;
      }

      const topping = TOPPINGS.find(t => t.id === toppingId);
      if (topping) {
        return {
          ...prev,
          tempToppings: [
            ...prev.tempToppings,
            {
              id: topping.id,
              name: topping.name,
              quantity,
              price: topping.price
            }
          ]
        };
      }

      return prev;
    });
  };

  const confirmModifiers = () => {
    if (!modifierState.item) return;
    
    let breadName = "";
    let breadPrice = 0;
    
    // Only include bread if it's NOT a side/extra
    if (!modifierState.isSideOrExtra) {
      const bread = BREAD_OPTIONS.find(b => b.id === modifierState.selectedBread);
      breadName = bread?.name || "";
      breadPrice = bread?.price || 0;
    }
    
    const finalToppings = modifierState.tempToppings.filter(t => t.quantity > 0);
    
    setCart((c) => {
      const basePrice = modifierState.item!.price + breadPrice;
      const toppingsTotal = finalToppings.reduce((sum, topping) => 
        sum + (topping.price * topping.quantity), 0
      );
      const totalPrice = basePrice + toppingsTotal;
      
      // Create appropriate item name
      let itemName = modifierState.item!.name;
      if (!modifierState.isSideOrExtra && breadName && breadName !== "No Bread") {
        itemName = `${modifierState.item!.name} (${breadName})`;
      }
      
      const exists = c.find((l) => 
        l.id === modifierState.item!.id && 
        l.bread === breadName &&
        JSON.stringify(l.toppings) === JSON.stringify(finalToppings)
      );
      
      if (exists) {
        return c.map((l) => 
          l.id === exists.id ? { ...l, qty: l.qty + 1 } : l
        );
      } else {
        return [...c, { 
          id: modifierState.item!.id, 
          name: itemName, 
          price: totalPrice, 
          qty: 1,
          bread: modifierState.isSideOrExtra ? undefined : breadName,
          toppings: finalToppings
        }];
      }
    });
    
    cancelModifiers();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="header-content">
            <img src={logo} alt="Earle's on Crenshaw" className="logo-image" />
            
            <div className="header-main-info">
              <div className="restaurant-info">
                <h1 className="restaurant-name">{RESTAURANT.name}</h1>
                <p className="tagline">{RESTAURANT.tagline}</p>
              </div>
              
              <div className="header-details">
                <div className="hours-info">
                  <span className="current-day">{day}:</span>
                  <span className="current-hours">{hours}</span>
                </div>
                <div className="contact-info">
                  <span className="address">{RESTAURANT.address}</span>
                  <span className="phone">{RESTAURANT.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Cart Icon */}
            <button className="cart-icon-btn" onClick={toggleCart}>
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="cart-counter">{totalItems}</span>
              )}
            </button>
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
                  onClick={() => setCategory(cat as MenuItem["category"] | "All")}
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
                            {item.badge && <span className="badge" data-badge={item.badge}>{item.badge}</span>}
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
        {showCart && (
          <div className="cart-overlay">
            <div className="cart-sidebar">
              <div className="cart-card">
                <div className="cart-header">
                  <h2 className="cart-title">Your Order</h2>
                  <button className="close-cart" onClick={toggleCart}>×</button>
                </div>

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
                              {item.bread && <div className="item-bread">Bread: {item.bread}</div>}
                              {item.toppings && item.toppings.length > 0 && (
                                <div className="item-toppings">
                                  Toppings: {item.toppings.map(t => 
                                    `${t.name}${t.quantity > 1 ? ` (x${t.quantity})` : ''}`
                                  ).join(', ')}
                                </div>
                              )}
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
            </div>
          </div>
        )}

        {/* Modifier Modal */}
        {modifierState.isOpen && modifierState.item && (
          <div className="modifier-overlay">
            <div className="modifier-modal">
              <div className="modifier-header">
                <h2>Customize {modifierState.item.name}</h2>
                <button className="close-modifier" onClick={cancelModifiers}>×</button>
              </div>

              <div className="modifier-content">
                {/* Bread Selection - Only show for non-sides/extras */}
                {!modifierState.isSideOrExtra && (
                  <div className="modifier-section">
                    <h3>Bread Selection *</h3>
                    <div className="bread-options">
                      {BREAD_OPTIONS.map(bread => (
                        <label key={bread.id} className="bread-option">
                          <input
                            type="radio"
                            name="bread"
                            value={bread.id}
                            checked={modifierState.selectedBread === bread.id}
                            onChange={(e) => setModifierState(prev => ({
                              ...prev,
                              selectedBread: e.target.value
                            }))}
                          />
                          <span className="bread-name">{bread.name}</span>
                          <span className={`bread-price ${bread.price > 0 ? 'has-cost' : ''}`}>
                            {bread.price > 0 ? `+${money(bread.price)}` : money(bread.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Free Toppings */}
                <div className="modifier-section">
                  <h3>Free Toppings</h3>
                  <div className="toppings-grid">
                    {TOPPINGS.filter(t => t.category === "free").map(topping => {
                      const currentTopping = modifierState.tempToppings.find(t => t.id === topping.id);
                      const quantity = currentTopping?.quantity || 0;
                      
                      return (
                        <div key={topping.id} className="topping-item">
                          <div className="topping-info">
                            <span className="topping-name">{topping.name}</span>
                            <span className="topping-price">{money(topping.price)}</span>
                          </div>
                          <div className="topping-controls">
                            <button
                              className={`qty-btn ${quantity === 0 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 0)}
                            >
                              None
                            </button>
                            <button
                              className={`qty-btn ${quantity === 1 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 1)}
                            >
                              Normal
                            </button>
                            <button
                              className={`qty-btn ${quantity === 2 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 2)}
                            >
                              Extra
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Paid Toppings */}
                <div className="modifier-section">
                  <h3>Premium Toppings</h3>
                  <div className="toppings-grid">
                    {TOPPINGS.filter(t => t.category === "paid").map(topping => {
                      const currentTopping = modifierState.tempToppings.find(t => t.id === topping.id);
                      const quantity = currentTopping?.quantity || 0;
                      const totalCost = topping.price * quantity;
                      
                      return (
                        <div key={topping.id} className="topping-item paid">
                          <div className="topping-info">
                            <span className="topping-name">{topping.name}</span>
                            <span className="topping-price has-cost">
                              +{money(topping.price)} {quantity > 1 ? `× ${quantity} = +${money(totalCost)}` : ''}
                            </span>
                          </div>
                          <div className="topping-controls">
                            <button
                              className={`qty-btn ${quantity === 0 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 0)}
                            >
                              None
                            </button>
                            <button
                              className={`qty-btn ${quantity === 1 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 1)}
                            >
                              Normal
                            </button>
                            <button
                              className={`qty-btn ${quantity === 2 ? 'active' : ''}`}
                              onClick={() => updateToppingQuantity(topping.id, 2)}
                            >
                              Extra
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="modifier-total">
                  <div className="total-line">
                    <span>Base Price:</span>
                    <span>{money(modifierState.item.price)}</span>
                  </div>
                  
                  {/* Only show bread line for non-sides/extras */}
                  {!modifierState.isSideOrExtra && (
                    <div className="total-line">
                      <span>Bread:</span>
                      {(() => {
                        const bread = BREAD_OPTIONS.find(b => b.id === modifierState.selectedBread);
                        const price = bread?.price ?? 0;
                        return (
                          <span className={price > 0 ? 'price-increase' : ''}>
                            {price > 0 ? '+' : ''}
                            {money(price)}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                  
                  <div className="total-line">
                    <span>Toppings:</span>
                    {(() => {
                      const toppingsTotal = modifierState.tempToppings.reduce(
                        (sum, t) => sum + t.price * t.quantity,
                        0
                      );
                      return (
                        <span className={toppingsTotal > 0 ? 'price-increase' : ''}>
                          {toppingsTotal > 0 ? '+' : ''}
                          {money(toppingsTotal)}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="total-line final">
                    <span>Total:</span>
                    <span>{money(calculateModifierTotal())}</span>
                  </div>
                </div>

                <div className="modifier-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={cancelModifiers}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-btn" 
                    onClick={confirmModifiers}
                    disabled={!modifierState.isSideOrExtra && !modifierState.selectedBread}
                  >
                    Confirm - {money(calculateModifierTotal())}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
