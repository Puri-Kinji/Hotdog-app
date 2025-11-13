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
  { id: "pastrami-dog", name: "Pastrami Dog", price: 9.99, category: "Dogs & Links", hasModifiers: true
