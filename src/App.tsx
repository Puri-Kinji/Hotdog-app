import { useMemo, useState, useCallback, useReducer, useEffect } from "react";
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
  specialModifiers?: "fritos" | "chips";
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  bread?: string;
  toppings?: ToppingSelection[];
  chipChoice?: string;
  doubleBagged?: boolean;
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
  chipChoice?: string;
  doubleBagged?: boolean;
  selectedCake?: string;
  selectedDrink?: string;
};

type AppState = {
  cart: CartLine[];
  noteFor: string | null;
  showCart: boolean;
  modifierState: ModifierState;
  category: MenuItem["category"] | "All";
  loading: boolean;
  error: string | null;
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
  { id: "chicken-link", name: "Chicken Link (Pork Casing)", price: 9.49, category: "Dogs & Links", badge: "Spicy", hasModifiers: true },
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

  // Sides & Extras
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
  { id: "beef-chili-cheese-fritos", name: "BEEF CHILI CHEESE FRITOS", price: 3.49, category: "Sides & Extras", hasModifiers: true, specialModifiers: "fritos" },
  { id: "vegan-chili-cheese-fritos", name: "VEGAN CHILI CHEESE FRITOS - Regular Cheese", price: 5.49, category: "Sides & Extras", hasModifiers: true, specialModifiers: "fritos" },
  { id: "vegan-chili-vegan-cheese-fritos", name: "VEGAN CHILI VEGAN CHEESE FRITOS", price: 7.74, category: "Sides & Extras", badge: "Vegan", hasModifiers: true, specialModifiers: "fritos" },
  { id: "bag-of-chips", name: "BAG OF CHIPS", price: 1.00, category: "Sides & Extras", hasModifiers: true, specialModifiers: "chips" },
  { id: "jamaican-patties", name: "Jamaican Patties", price: 5.00, category: "Sides & Extras" },
  { id: "side-beef-chili", name: "Side of Beef Chili", price: 1.49, category: "Sides & Extras" },
  { id: "side-cheddar-cheese", name: "Side of Cheddar Cheese", price: 1.29, category: "Sides & Extras" },
  { id: "side-vegan-chili", name: "Side of Vegan Chili", price: 2.49, category: "Sides & Extras", badge: "Vegan" },

  // Drinks
  { id: "can-soda", name: "CAN SODA", price: 3.79, category: "Drinks" },
  { id: "small-playas-punch", name: "SMALL PLAYAS PUNCH", price: 4.49, category: "Drinks" },
  { id: "large-playas-punch", name: "LARGE PLAYAS PUNCH", price: 5.49, category: "Drinks" },
  { id: "half-gallon-playas-punch", name: "1/2 GALLON PLAYAS PUNCH", price: 9.99, category: "Drinks" },
  { id: "playas-punch-special", name: "PLAYAS PUNCH SPECIAL - 2 Half Gallons", price: 17.99, category: "Drinks" },
  { id: "ginger-beer", name: "GINGER BEER", price: 3.79, category: "Drinks" },
  { id: "coconut-water", name: "COCONUT WATER", price: 5.49, category: "Drinks" },
  { id: "bottled-water", name: "BOTTLED WATER", price: 1.49, category: "Drinks" },
  { id: "honey-punch", name: "HONEY PUNCH", price: 7.99, category: "Drinks" },
  { id: "apryl-drink", name: "APRYL'S JUICE", price: 7.99, category: "Drinks", hasModifiers: true },
  { id: "creme-soda", name: "CREME SODA", price: 3.79, category: "Drinks" },
  { id: "root-beer", name: "ROOT BEER", price: 3.79, category: "Drinks" },
  { id: "shirley-temple", name: "SHIRLEY TEMPLE", price: 3.79, category: "Drinks" },
  { id: "jamaican-ginger-beer", name: "JAMAICAN GINGER BEER", price: 3.79, category: "Drinks" },
  { id: "bundaberg-ginger-beer", name: "BUNDABERG GINGER BEER", price: 3.79, category: "Drinks" },
  { id: "blood-orange", name: "BLOOD ORANGE", price: 3.79, category: "Drinks" },
  { id: "snappe-drink", name: "SNAPPLE", price: 3.79, category: "Drinks", hasModifiers: true },
  { id: "welches", name: "GRAPE WELCHES", price: 3.79, category: "Drinks" },

  // Desserts
  { id: "cakes", name: "Cakes", price: 8.49, category: "Desserts", hasModifiers: true },
  { id: "vegan-cakes", name: "Vegan Cakes", price: 7.49, category: "Desserts", badge: "Vegan", hasModifiers: true },
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
  { id: "cheddar", name: "Cheddar Cheese", price: 1.29, category: "paid" },
  { id: "american", name: "American Cheese", price: 1.29, category: "paid" },
  { id: "vegan-cheese", name: "Vegan Cheese", price: 2.99, category: "paid" },
  { id: "beef-chili", name: "Beef Chili Scoop", price: 1.49, category: "paid" },
  { id: "vegan-chili", name: "Vegan Chili Scoop", price: 2.49, category: "paid" },
  { id: "pastrami", name: "Pastrami", price: 5.99, category: "paid" },
];

/* ---------------------------------- Cake Modifiers Data ---------------------------------- */
const CAKE_OPTIONS = {
  regular: [
    { id: "carrot-cake", name: "Carrot Cake", price: 8.49 },
    { id: "yellow-chocolate", name: "Yellow Chocolate", price: 8.49 },
    { id: "red-velvet", name: "Red Velvet", price: 8.49 },
    { id: "german-chocolate", name: "German Chocolate", price: 8.49 }
  ],
  vegan: [
    { id: "lemon-delight", name: "Lemon Delight", price: 7.49 },
    { id: "double-chocolate", name: "Double Chocolate", price: 7.49 }
  ]
};

/* ---------------------------------- Drink Modifiers Data ---------------------------------- */
const DRINK_OPTIONS = {
  apryl: [
    { id: "pineapple-tumeric", name: "Pineapple Tumeric", price: 3.79 },
    { id: "spicy-limeade", name: "Spicy Limeade", price: 3.79 },
    { id: "village-green", name: "Village Green Drink", price: 3.79 }
  ],
  snapple: [
    { id: "peach-tea", name: "Peach Tea", price: 3.79 },
    { id: "kiwi-strawberry", name: "Kiwi Strawberry", price: 3.79 },
    { id: "mango", name: "Mango", price: 3.79 },
    { id: "diet", name: "Diet", price: 3.79 }
  ]
};

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
  const today = new Date().getDay();
  const currentDay = days[today];
  const todayHours = RESTAURANT.hours.find(hour => hour.d === currentDay);
  return {
    day: currentDay,
    hours: todayHours ? todayHours.h : "Closed"
  };
}

// Local storage utilities
const CART_STORAGE_KEY = 'earles-cart';

const loadCartFromStorage = (): CartLine[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartLine[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

/* ---------------------------------- Reducer for State Management ---------------------------------- */
type AppAction =
  | { type: 'SET_CATEGORY'; payload: MenuItem["category"] | "All" }
  | { type: 'ADD_TO_CART'; payload: CartLine }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; delta: number } }
  | { type: 'SET_NOTE'; payload: { id: string; note: string } }
  | { type: 'SET_NOTE_FOR'; payload: string | null }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_MODIFIERS'; payload: ModifierState }
  | { type: 'CLOSE_MODIFIERS' }
  | { type: 'UPDATE_MODIFIER_STATE'; payload: Partial<ModifierState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };

    case 'ADD_TO_CART': {
      const newCart = [...state.cart];
      const exists = newCart.find(item => 
        item.id === action.payload.id && 
        item.name === action.payload.name &&
        item.bread === action.payload.bread &&
        item.chipChoice === action.payload.chipChoice &&
        JSON.stringify(item.toppings) === JSON.stringify(action.payload.toppings)
      );

      if (exists) {
        const updatedCart = newCart.map(item =>
          item.id === exists.id ? { ...item, qty: item.qty + 1 } : item
        );
        saveCartToStorage(updatedCart);
        return { ...state, cart: updatedCart };
      } else {
        const updatedCart = [...newCart, action.payload];
        saveCartToStorage(updatedCart);
        return { ...state, cart: updatedCart };
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cart.filter(item => item.id !== action.payload);
      saveCartToStorage(updatedCart);
      return { ...state, cart: updatedCart };
    }

    case 'UPDATE_QUANTITY': {
      const updatedCart = state.cart
        .map(item =>
          item.id === action.payload.id
            ? { ...item, qty: Math.max(1, item.qty + action.payload.delta) }
            : item
        )
        .filter(item => item.qty > 0);
      saveCartToStorage(updatedCart);
      return { ...state, cart: updatedCart };
    }

    case 'SET_NOTE': {
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id ? { ...item, note: action.payload.note } : item
      );
      saveCartToStorage(updatedCart);
      return { ...state, cart: updatedCart, noteFor: null };
    }

    case 'SET_NOTE_FOR':
      return { ...state, noteFor: action.payload };

    case 'TOGGLE_CART':
      return { ...state, showCart: !state.showCart };

    case 'OPEN_MODIFIERS':
      return { ...state, modifierState: action.payload };

    case 'CLOSE_MODIFIERS':
      return {
        ...state,
        modifierState: {
          isOpen: false,
          item: null,
          selectedBread: "",
          toppings: [],
          tempToppings: [],
          isSideOrExtra: false
        }
      };

    case 'UPDATE_MODIFIER_STATE':
      return {
        ...state,
        modifierState: { ...state.modifierState, ...action.payload }
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_CART':
      saveCartToStorage([]);
      return { ...state, cart: [] };

    default:
      return state;
  }
};

const initialState: AppState = {
  cart: loadCartFromStorage(),
  noteFor: null,
  showCart: false,
  modifierState: {
    isOpen: false,
    item: null,
    selectedBread: "",
    toppings: [],
    tempToppings: [],
    isSideOrExtra: false
  },
  category: "All",
  loading: false,
  error: null
};

/* ---------------------------------- Custom Hooks ---------------------------------- */
const useModifierCalculations = (modifierState: ModifierState) => {
  return useMemo(() => {
    if (!modifierState.item) return { total: 0, breakdown: [] };

    let breadPrice = 0;
    const showBread = !modifierState.isSideOrExtra && 
                     !modifierState.selectedCake && 
                     !modifierState.selectedDrink;
    
    if (showBread) {
      breadPrice = BREAD_OPTIONS.find(b => b.id === modifierState.selectedBread)?.price || 0;
    }
    
    const toppingsTotal = modifierState.tempToppings.reduce(
      (sum, topping) => sum + (topping.price * topping.quantity), 0
    );
    
    const doubleBaggedCharge = modifierState.doubleBagged ? 1.00 : 0;
    
    let basePrice = modifierState.item.price;
    if (modifierState.selectedCake) {
      const cakeOptions = modifierState.item.id === "cakes" ? CAKE_OPTIONS.regular : CAKE_OPTIONS.vegan;
      const selectedCake = cakeOptions.find(cake => cake.id === modifierState.selectedCake);
      basePrice = selectedCake?.price || modifierState.item.price;
    } else if (modifierState.selectedDrink) {
      const drinkOptions = modifierState.item.id === "apryl-drink" ? DRINK_OPTIONS.apryl : DRINK_OPTIONS.snapple;
      const selectedDrink = drinkOptions.find(drink => drink.id === modifierState.selectedDrink);
      basePrice = selectedDrink?.price || modifierState.item.price;
    }
    
    const total = basePrice + breadPrice + toppingsTotal + doubleBaggedCharge;

    const breakdown = [
      { label: 'Base Price', amount: basePrice, isIncrease: false },
      ...(showBread && breadPrice > 0 ? [{ label: 'Bread', amount: breadPrice, isIncrease: true }] : []),
      ...(doubleBaggedCharge > 0 ? [{ label: 'Double Bagged', amount: doubleBaggedCharge, isIncrease: true }] : []),
      ...(toppingsTotal > 0 ? [{ label: 'Toppings', amount: toppingsTotal, isIncrease: true }] : []),
    ];

    return { total, breakdown };
  }, [modifierState]);
};

/* ---------------------------------- Components ---------------------------------- */
interface NoteEditorProps {
  initial: string;
  onCancel: () => void;
  onSave: (val: string) => void;
}

function NoteEditor({ initial, onCancel, onSave }: NoteEditorProps) {
  const [val, setVal] = useState(initial);

  const handleSave = useCallback(() => {
    onSave(val);
  }, [onSave, val]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    }
  }, [handleSave]);

  return (
    <div className="note-editor" role="dialog" aria-label="Add note">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Add ketchup, extra onions, no pickles…"
        className="note-input"
        aria-describedby="note-instructions"
      />
      <small id="note-instructions" className="note-instructions">
        Press Ctrl+Enter to save quickly
      </small>
      <div className="note-actions">
        <button onClick={handleSave} className="btn primary">
          Save note
        </button>
        <button onClick={onCancel} className="btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

interface CartItemProps {
  item: CartLine;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSetNoteFor: (id: string) => void;
  onApplyNote: (id: string, note: string) => void;
  noteFor: string | null;
}

function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onSetNoteFor, 
  onApplyNote, 
  noteFor 
}: CartItemProps) {
  return (
    <div className="cart-item" aria-label={`${item.name}, quantity ${item.qty}`}>
      <div className="cart-item-main">
        <div className="item-details">
          <div className="item-name">{item.name}</div>
          {item.bread && <div className="item-bread">Bread: {item.bread}</div>}
          {item.chipChoice && <div className="item-chip-choice">Chips: {item.chipChoice}</div>}
          {item.doubleBagged && <div className="item-double-bagged">Double Bagged (+$1.00)</div>}
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
          <div className="item-price" aria-label={`Price: ${money(item.price * item.qty)}`}>
            {money(item.price * item.qty)}
          </div>

          <div className="quantity-controls">
            <button 
              onClick={() => onUpdateQuantity(item.id, -1)} 
              className="qty-btn"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span className="qty-display" aria-live="polite">{item.qty}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, 1)} 
              className="qty-btn"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="cart-item-actions">
        <button 
          onClick={() => onSetNoteFor(item.id)} 
          className="action-btn"
          aria-label={item.note ? `Edit note for ${item.name}` : `Add note to ${item.name}`}
        >
          {item.note ? "Edit note" : "Add note"}
        </button>
        <button 
          onClick={() => onRemove(item.id)} 
          className="action-btn remove"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>

      {noteFor === item.id && (
        <NoteEditor
          initial={item.note || ""}
          onCancel={() => onSetNoteFor(null)}
          onSave={(val) => onApplyNote(item.id, val)}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Main App Component ---------------------------------- */
export default function RestaurantApp() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { cart, noteFor, showCart, modifierState, category, loading, error } = state;

  const modifierCalculations = useModifierCalculations(modifierState);

  const filtered = useMemo(
    () => (category === "All" ? MENU : MENU.filter((m) => m.category === category)),
    [category]
  );

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.qty, 0), [cart]);
  const tax = useMemo(() => +(subtotal * 0.095).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const { day, hours } = useMemo(getCurrentDayInfo, []);

  // Memoized action creators
  const setCategory = useCallback((cat: MenuItem["category"] | "All") => {
    dispatch({ type: 'SET_CATEGORY', payload: cat });
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    if (item.hasModifiers || item.specialModifiers || 
        item.id === "cakes" || item.id === "vegan-cakes" || 
        item.id === "apryl-drink" || item.id === "snappe-drink") {
      
      const isCake = item.id === "cakes" || item.id === "vegan-cakes";
      const isDrink = item.id === "apryl-drink" || item.id === "snappe-drink";
      const isSideOrExtra = item.category === "Sides & Extras";
      
      const defaultBread = isSideOrExtra ? "no-bread" : 
                          (BREAD_OPTIONS.find(b => b.isDefault)?.id || BREAD_OPTIONS[0].id);
      
      let defaultChipChoice = "";
      if (item.specialModifiers === "fritos") {
        defaultChipChoice = "Fritos";
      } else if (item.specialModifiers === "chips") {
        defaultChipChoice = "Lays";
      }
      
      let defaultCake = "";
      if (isCake) {
        const cakeOptions = item.id === "cakes" ? CAKE_OPTIONS.regular : CAKE_OPTIONS.vegan;
        defaultCake = cakeOptions[0]?.id || "";
      }
      
      let defaultDrink = "";
      if (isDrink) {
        const drinkOptions = item.id === "apryl-drink" ? DRINK_OPTIONS.apryl : DRINK_OPTIONS.snapple;
        defaultDrink = drinkOptions[0]?.id || "";
      }
      
      dispatch({
        type: 'OPEN_MODIFIERS',
        payload: {
          isOpen: true,
          item,
          selectedBread: defaultBread,
          toppings: [],
          tempToppings: [],
          isSideOrExtra,
          chipChoice: defaultChipChoice,
          doubleBagged: false,
          selectedCake: defaultCake,
          selectedDrink: defaultDrink
        }
      });
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { id: item.id, name: item.name, price: item.price, qty: 1 }
      });
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, delta } });
  }, []);

  const applyNote = useCallback((id: string, note: string) => {
    dispatch({ type: 'SET_NOTE', payload: { id, note } });
  }, []);

  const setNoteFor = useCallback((id: string | null) => {
    dispatch({ type: 'SET_NOTE_FOR', payload: id });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const cancelModifiers = useCallback(() => {
    dispatch({ type: 'CLOSE_MODIFIERS' });
  }, []);

  const updateModifierState = useCallback((updates: Partial<ModifierState>) => {
    dispatch({ type: 'UPDATE_MODIFIER_STATE', payload: updates });
  }, []);

  // Get topping limit based on item category
  const getToppingLimit = useCallback(() => {
    if (!modifierState.item) return 6;
    if (modifierState.item.category === "Dogs & Links") return 5;
    if (modifierState.item.category === "Burgers & Sandwiches") return 6;
    return 6;
  }, [modifierState.item]);

  // Update topping quantity
  const updateToppingQuantity = useCallback((toppingId: string, quantity: number) => {
    const existing = modifierState.tempToppings.find(t => t.id === toppingId);
    const topping = TOPPINGS.find(t => t.id === toppingId);
    
    if (!topping) return;

    const freeToppingsCount = modifierState.tempToppings
      .filter(t => {
        const toppingData = TOPPINGS.find(td => td.id === t.id);
        return toppingData?.category === "free" && t.quantity > 0;
      })
      .length;

    const toppingLimit = getToppingLimit();

    if (quantity === 0) {
      updateModifierState({
        tempToppings: modifierState.tempToppings.filter(t => t.id !== toppingId)
      });
      return;
    }

    if (existing) {
      updateModifierState({
        tempToppings: modifierState.tempToppings.map(t =>
          t.id === toppingId ? { ...t, quantity } : t
        )
      });
      return;
    }

    if (topping.category === "free" && freeToppingsCount >= toppingLimit) {
      dispatch({ type: 'SET_ERROR', payload: `You can choose up to ${toppingLimit} free toppings total. Premium toppings don't count toward this limit.` });
      return;
    }

    updateModifierState({
      tempToppings: [
        ...modifierState.tempToppings,
        {
          id: topping.id,
          name: topping.name,
          quantity,
          price: topping.price
        }
      ]
    });
  }, [modifierState.tempToppings, getToppingLimit, updateModifierState]);

  const confirmModifiers = useCallback(() => {
    if (!modifierState.item) return;
    
    let breadName = "";
    let breadPrice = 0;
    
    if (!modifierState.isSideOrExtra && !modifierState.selectedCake && !modifierState.selectedDrink) {
      const bread = BREAD_OPTIONS.find(b => b.id === modifierState.selectedBread);
      breadName = bread?.name || "";
      breadPrice = bread?.price || 0;
    }
    
    const finalToppings = modifierState.tempToppings.filter(t => t.quantity > 0);
    
    let basePrice = modifierState.item.price;
    let itemName = modifierState.item.name;
    
    if (modifierState.selectedCake) {
      const cakeOptions = modifierState.item.id === "cakes" ? CAKE_OPTIONS.regular : CAKE_OPTIONS.vegan;
      const selectedCake = cakeOptions.find(cake => cake.id === modifierState.selectedCake);
      basePrice = selectedCake?.price || modifierState.item.price;
      itemName = selectedCake?.name || modifierState.item.name;
    } else if (modifierState.selectedDrink) {
      const drinkOptions = modifierState.item.id === "apryl-drink" ? DRINK_OPTIONS.apryl : DRINK_OPTIONS.snapple;
      const selectedDrink = drinkOptions.find(drink => drink.id === modifierState.selectedDrink);
      basePrice = selectedDrink?.price || modifierState.item.price;
      itemName = `${modifierState.item.name} - ${selectedDrink?.name}`;
    } else if (modifierState.chipChoice) {
      itemName = `${modifierState.item.name} (${modifierState.chipChoice})`;
    } else if (!modifierState.isSideOrExtra && breadName && breadName !== "No Bread") {
      itemName = `${modifierState.item.name} (${breadName})`;
    }
    
    const totalBasePrice = basePrice + breadPrice;
    const toppingsTotal = finalToppings.reduce((sum, topping) => 
      sum + (topping.price * topping.quantity), 0
    );
    const doubleBaggedCharge = modifierState.doubleBagged ? 1.00 : 0;
    const totalPrice = totalBasePrice + toppingsTotal + doubleBaggedCharge;
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: modifierState.item.id,
        name: itemName,
        price: totalPrice,
        qty: 1,
        bread: (modifierState.isSideOrExtra || modifierState.selectedCake || modifierState.selectedDrink) ? undefined : breadName,
        toppings: finalToppings,
        chipChoice: modifierState.chipChoice,
        doubleBagged: modifierState.doubleBagged
      }
    });
    
    cancelModifiers();
  }, [modifierState, cancelModifiers]);

  // Get current free topping count for display
  const getCurrentFreeToppingCount = useCallback(() => {
    return modifierState.tempToppings
      .filter(t => {
        const toppingData = TOPPINGS.find(td => td.id === t.id);
        return toppingData?.category === "free" && t.quantity > 0;
      })
      .length;
  }, [modifierState.tempToppings]);

  // Check if confirm button should be disabled
  const isConfirmDisabled = useMemo(() => {
    if (!modifierState.item) return true;

    const isCakeItem = ['cakes', 'vegan-cakes'].includes(modifierState.item.id);
    const isDrinkItem = ['apryl-drink', 'snappe-drink'].includes(modifierState.item.id);
    const hasSpecialModifiers = !!modifierState.item.specialModifiers;

    const requiresCakeSelection = isCakeItem && !modifierState.selectedCake;
    const requiresDrinkSelection = isDrinkItem && !modifierState.selectedDrink;
    const requiresBreadSelection = !modifierState.isSideOrExtra && 
                                  !hasSpecialModifiers && 
                                  !modifierState.selectedCake && 
                                  !modifierState.selectedDrink && 
                                  !modifierState.selectedBread;
    const requiresChipChoice = hasSpecialModifiers && !modifierState.chipChoice;

    return requiresCakeSelection || requiresDrinkSelection || requiresBreadSelection || requiresChipChoice;
  }, [modifierState]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ERROR', payload: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header" role="banner">
        <div className="header-top">
          <div className="header-content">
            <img 
              src={logo} 
              alt="Earle's on Crenshaw" 
              className="logo-image" 
            />
            
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
            <button 
              className="cart-icon-btn" 
              onClick={toggleCart}
              aria-label={`View cart, ${totalItems} items`}
            >
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="cart-counter" aria-live="polite">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
          <button 
            onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
            className="error-close"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Main */}
      <main className="main">
        <div className="container">
          {/* Category Nav */}
          <nav className="categories-nav" aria-label="Menu categories">
            <div className="categories-scroll">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as MenuItem["category"] | "All")}
                  className={`category-tab ${category === cat ? "active" : ""}`}
                  aria-current={category === cat ? "page" : undefined}
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
                <section key={cat} className="menu-section" aria-labelledby={`section-${cat}`}>
                  <h2 id={`section-${cat}`} className="section-title">{cat}</h2>

                  <div className="items-grid">
                    {items.map((item) => (
                      <div key={item.id} className="menu-item">
                        <div className="item-content">
                          <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            {item.badge && (
                              <span 
                                className="badge" 
                                data-badge={item.badge}
                                aria-label={item.badge}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <div className="item-actions">
                            <div className="price">{money(item.price)}</div>
                            <button
                              onClick={() => addToCart(item)}
                              className="add-btn"
                              aria-label={`Add ${item.name} to cart`}
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
                  <button 
                    className="close-cart" 
                    onClick={toggleCart}
                    aria-label="Close cart"
                  >
                    ×
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <p>Your cart is empty. Add something tasty!</p>
                  </div>
                ) : (
                  <div className="cart-content">
                    <div className="cart-items" aria-live="polite">
                      {cart.map((item) => (
                        <CartItem
                          key={`${item.id}-${item.name}-${item.bread}-${item.chipChoice}`}
                          item={item}
                          onUpdateQuantity={changeQty}
                          onRemove={removeFromCart}
                          onSetNoteFor={setNoteFor}
                          onApplyNote={applyNote}
                          noteFor={noteFor}
                        />
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
                      <button 
                        className="checkout-btn"
                        aria-label="Place pickup order"
                      >
                        Place Pickup Order
                      </button>
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
            <div className="modifier-modal" role="dialog" aria-labelledby="modifier-title">
              <div className="modifier-header">
                <h2 id="modifier-title">Customize {modifierState.item.name}</h2>
                <button 
                  className="close-modifier" 
                  onClick={cancelModifiers}
                  aria-label="Close customization"
                >
                  ×
                </button>
              </div>

              <div className="modifier-content">
                {/* Cake Selection */}
                {(modifierState.item.id === "cakes" || modifierState.item.id === "vegan-cakes") && (
                  <div className="modifier-section">
                    <h3>Select Cake Flavor *</h3>
                    <div className="cake-options" role="radiogroup" aria-label="Cake flavors">
                      {(modifierState.item.id === "cakes" ? CAKE_OPTIONS.regular : CAKE_OPTIONS.vegan).map(cake => (
                        <label key={cake.id} className="cake-option">
                          <input
                            type="radio"
                            name="cake"
                            value={cake.id}
                            checked={modifierState.selectedCake === cake.id}
                            onChange={(e) => updateModifierState({ selectedCake: e.target.value })}
                            aria-label={cake.name}
                          />
                          <span className="cake-name">{cake.name}</span>
                          <span className="cake-price">{money(cake.price)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drink Selection */}
                {(modifierState.item.id === "apryl-drink" || modifierState.item.id === "snappe-drink") && (
                  <div className="modifier-section">
                    <h3>Select Flavor *</h3>
                    <div className="drink-options" role="radiogroup" aria-label="Drink flavors">
                      {(modifierState.item.id === "apryl-drink" ? DRINK_OPTIONS.apryl : DRINK_OPTIONS.snapple).map(drink => (
                        <label key={drink.id} className="drink-option">
                          <input
                            type="radio"
                            name="drink"
                            value={drink.id}
                            checked={modifierState.selectedDrink === drink.id}
                            onChange={(e) => updateModifierState({ selectedDrink: e.target.value })}
                            aria-label={drink.name}
                          />
                          <span className="drink-name">{drink.name}</span>
                          <span className="drink-price">{money(drink.price)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Chip Modifiers for Fritos items */}
                {modifierState.item.specialModifiers === "fritos" && (
                  <div className="modifier-section">
                    <h3>Chip & Bag Choice</h3>
                    <div className="chip-options" role="radiogroup" aria-label="Chip choices">
                      <label className="chip-option">
                        <input
                          type="radio"
                          name="chipChoice"
                          value="Fritos"
                          checked={modifierState.chipChoice === "Fritos"}
                          onChange={(e) => updateModifierState({ chipChoice: e.target.value })}
                          aria-label="Fritos"
                        />
                        <span className="chip-name">Fritos</span>
                      </label>
                      <label className="chip-option">
                        <input
                          type="radio"
                          name="chipChoice"
                          value="Doritos"
                          checked={modifierState.chipChoice === "Doritos"}
                          onChange={(e) => updateModifierState({ chipChoice: e.target.value })}
                          aria-label="Doritos"
                        />
                        <span className="chip-name">Doritos</span>
                      </label>
                    </div>
                    <div className="double-bag-option">
                      <label className="double-bag-label">
                        <input
                          type="checkbox"
                          checked={modifierState.doubleBagged || false}
                          onChange={(e) => updateModifierState({ doubleBagged: e.target.checked })}
                          aria-label="Double bagged for an additional $1.00"
                        />
                        <span className="double-bag-name">Double Bagged (+$1.00)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Special Chip Modifiers for Bag of Chips */}
                {modifierState.item.specialModifiers === "chips" && (
                  <div className="modifier-section">
                    <h3>Chip Choice *</h3>
                    <div className="chip-options" role="radiogroup" aria-label="Chip choices">
                      {["Lays", "Doritos", "BBQ", "Fritos"].map(chip => (
                        <label key={chip} className="chip-option">
                          <input
                            type="radio"
                            name="chipChoice"
                            value={chip}
                            checked={modifierState.chipChoice === chip}
                            onChange={(e) => updateModifierState({ chipChoice: e.target.value })}
                            aria-label={chip}
                          />
                          <span className="chip-name">{chip}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bread Selection */}
                {!modifierState.isSideOrExtra && !modifierState.item.specialModifiers && !modifierState.selectedCake && !modifierState.selectedDrink && (
                  <div className="modifier-section">
                    <h3>Bread Selection *</h3>
                    <div className="bread-options" role="radiogroup" aria-label="Bread choices">
                      {BREAD_OPTIONS.map(bread => (
                        <label key={bread.id} className="bread-option">
                          <input
                            type="radio"
                            name="bread"
                            value={bread.id}
                            checked={modifierState.selectedBread === bread.id}
                            onChange={(e) => updateModifierState({ selectedBread: e.target.value })}
                            aria-label={`${bread.name} ${bread.price > 0 ? `for ${money(bread.price)}` : 'at no extra cost'}`}
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
                {!modifierState.item.specialModifiers && !modifierState.selectedCake && !modifierState.selectedDrink && (
                  <div className="modifier-section">
                    <h3>
                      Free Toppings 
                      <span className="topping-limit">
                        ({getCurrentFreeToppingCount()}/{getToppingLimit()} selected)
                      </span>
                    </h3>
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
                                aria-label={`No ${topping.name}`}
                                aria-pressed={quantity === 0}
                              >
                                None
                              </button>
                              <button
                                className={`qty-btn ${quantity === 1 ? 'active' : ''}`}
                                onClick={() => updateToppingQuantity(topping.id, 1)}
                                aria-label={`Normal amount of ${topping.name}`}
                                aria-pressed={quantity === 1}
                              >
                                Normal
                              </button>
                              <button
                                className={`qty-btn ${quantity === 2 ? 'active' : ''}`}
                                onClick={() => updateToppingQuantity(topping.id, 2)}
                                aria-label={`Extra ${topping.name}`}
                                aria-pressed={quantity === 2}
                              >
                                Extra
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Paid Toppings */}
                {!modifierState.item.specialModifiers && !modifierState.selectedCake && !modifierState.selectedDrink && (
                  <div className="modifier-section">
                    <h3>Premium Toppings</h3>
                    <p className="premium-note">Premium toppings don't count toward your free topping limit</p>
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
                                aria-label={`No ${topping.name}`}
                                aria-pressed={quantity === 0}
                              >
                                None
                              </button>
                              <button
                                className={`qty-btn ${quantity === 1 ? 'active' : ''}`}
                                onClick={() => updateToppingQuantity(topping.id, 1)}
                                aria-label={`Normal amount of ${topping.name} for ${money(topping.price)}`}
                                aria-pressed={quantity === 1}
                              >
                                Normal
                              </button>
                              <button
                                className={`qty-btn ${quantity === 2 ? 'active' : ''}`}
                                onClick={() => updateToppingQuantity(topping.id, 2)}
                                aria-label={`Extra ${topping.name} for ${money(totalCost)}`}
                                aria-pressed={quantity === 2}
                              >
                                Extra
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Total and Actions */}
                <div className="modifier-total">
                  {modifierCalculations.breakdown.map((item, index) => (
                    <div key={index} className="total-line">
                      <span>{item.label}:</span>
                      <span className={item.isIncrease ? 'price-increase' : ''}>
                        {item.isIncrease ? '+' : ''}{money(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="total-line final">
                    <span>Total:</span>
                    <span>{money(modifierCalculations.total)}</span>
                  </div>
                </div>

                <div className="modifier-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={cancelModifiers}
                    aria-label="Cancel customization"
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-btn" 
                    onClick={confirmModifiers}
                    disabled={isConfirmDisabled}
                    aria-label={`Confirm customization for ${money(modifierCalculations.total)}`}
                  >
                    Confirm - {money(modifierCalculations.total)}
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
