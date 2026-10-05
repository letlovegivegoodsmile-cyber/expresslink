export function Ticker() {
  const items = [
    "Air Freight",
    "Ocean Freight",
    "Ground Transport",
    "Warehousing",
    "Customs Brokerage",
    "Last-Mile Delivery",
  ];
  const row = (key: string) => (
    <span key={key} style={{ display: "contents" }}>
      {items.map((label) => (
        <span key={`${key}-${label}`} style={{ display: "contents" }}>
          <span>{label}</span>
          <i></i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="ticker" id="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

const STATS = [
  { value: 1.2, decimals: 1, suffix: "M+", label: "Shipments delivered" },
  { value: 180, decimals: 0, suffix: "+", label: "Countries served" },
  { value: 99.2, decimals: 1, suffix: "%", label: "On-time delivery rate" },
  { value: 24, decimals: 0, suffix: "/7", label: "Live shipment support" },
];

export function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat" data-reveal key={s.label}>
              <span className="stat-num">
                <span data-count={s.value} data-decimals={s.decimals}>
                  0
                </span>
                {s.suffix}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
