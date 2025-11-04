export default function RestaurantApp() {
  const [category, setCategory] = useState<MenuItem["category"] | "All">("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");

  const filtered = useMemo(() => {
    let list = MENU;
    if (category !== "All") list = list.filter((m) => m.category === category);
    return list;
  }, [category]);

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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: THEME.bg,
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            gap: 12,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 16,
              background: THEME.black,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            E
          </div>
          <div style={{ flex: 1 }}>
            <h1>{RESTAURANT.name}</h1>
            <p>{RESTAURANT.tagline}</p>
          </div>
          <Toggle value={mode} onChange={setMode} options={["Pickup", "Delivery"]} />
        </div>

        {/* Promo strip */}
        <div
          style={{
            background: THEME.bg,
            borderTop: `1px solid ${THEME.border}`,
            padding: "8px 16px",
          }}
        >
          <a
            href={RESTAURANT.links.doorDash}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            {RESTAURANT.promo.label}
          </a>{" "}
          <span>{RESTAURANT.promo.text}</span>
        </div>
      </header>

      {/* Main */}
      <main className="app-container main-grid">
        <section>
          <CategoryBar
            active={category}
            onPick={setCategory}
            counts={CATEGORIES.reduce((acc, c) => {
              acc[c] = MENU.filter((m) => m.category === c).length;
              return acc;
            }, {} as Record<string, number>)}
          />
          {[...grouped.entries()].map(([cat, items]) =>
            items.length ? (
              <div key={cat}>
                <h2>{cat}</h2>
                <div className="menu-grid">
                  {items.map((it) => (
                    <article key={it.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div>
                          <h3>{it.name}</h3>
                          {it.badge && (
                            <span
                              style={{
                                background: THEME.black,
                                color: "#fff",
                                borderRadius: 999,
                                padding: "4px 8px",
                                fontSize: 12,
                              }}
                            >
                              {it.badge}
                            </span>
                          )}
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

        {/* Cart */}
        <aside className="cart-aside">
          <div className="card">
            <h2>Your Order</h2>
            {!cart.length && <p>Your cart is empty.</p>}
            {cart.map((l) => (
              <div key={l.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    {l.name} ×{l.qty}
                  </span>
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

      {/* Footer */}
      <footer>
        <div>
          © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
