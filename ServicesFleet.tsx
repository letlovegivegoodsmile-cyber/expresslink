const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SERVICES = [
  {
    num: "01",
    title: "Air Freight",
    text: "Next-flight-out, consolidated and full charter options with priority handling at DFW and every major gateway worldwide.",
    tag: "Fastest transit",
    icon: (
      <svg viewBox="0 0 48 48" {...ICON_PROPS}>
        <path d="M44 4L22 26" />
        <path d="M44 4L30 44l-8-18-18-8L44 4z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Ocean Freight",
    text: "FCL and LCL sailing schedules on all major trade lanes, with port-to-door coordination and full customs handling.",
    tag: "Best value",
    icon: (
      <svg viewBox="0 0 48 48" {...ICON_PROPS}>
        <path d="M6 30h36l-4 10H12z" />
        <path d="M14 30V18h20v12" />
        <path d="M20 18v-6h8v6" />
        <path d="M4 44c3-2.5 6-2.5 9 0s6 2.5 9 0 6-2.5 9 0 6 2.5 9 0 6-2.5 4 0" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Ground Transport",
    text: "FTL, LTL and dedicated fleets across North America — same-day dispatch, live GPS and proof of delivery on every load.",
    tag: "Door to door",
    icon: (
      <svg viewBox="0 0 48 48" {...ICON_PROPS}>
        <path d="M4 12h24v20H4z" />
        <path d="M28 20h9l7 6v6h-6" />
        <circle cx="12" cy="34" r="4" />
        <circle cx="34" cy="34" r="4" />
        <path d="M16 34h14" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Warehousing & Distribution",
    text: "Climate-controlled storage, pick & pack and cross-dock at our Dallas hub, fully integrated with your sales channels.",
    tag: "Dallas hub",
    icon: (
      <svg viewBox="0 0 48 48" {...ICON_PROPS}>
        <path d="M6 20L24 8l18 12" />
        <path d="M10 22v18h28V22" />
        <path d="M18 40v-10h12v10" />
        <path d="M18 30h12" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">
            <span className="marker"></span>What we move
          </p>
          <h2 data-split>Every mode. One partner.</h2>
          <p className="section-sub" data-reveal>
            From a single pallet to a full charter, Express Link Logistics
            plans, books and tracks your freight door to door — air, ocean,
            ground and everything in between.
          </p>
        </header>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article className="service" data-reveal key={s.num}>
              <span className="service-num">{s.num}</span>
              <div className="service-icon" aria-hidden="true">
                {s.icon}
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="service-tag">{s.tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FleetVideo() {
  return (
    <section className="fleet-video" id="fleet">
      <div className="fleet-media" aria-hidden="true">
        <video autoPlay muted loop playsInline poster="/assets/img/ground-poster.jpg">
          <source src="/assets/video/ground-fleet.mp4" type="video/mp4" />
        </video>
        <div className="fleet-overlay"></div>
      </div>
      <div className="container fleet-video-content">
        <p className="eyebrow eyebrow-light">
          <span className="marker"></span>Our fleet in motion
        </p>
        <h2 data-split>A fleet that never sleeps.</h2>
        <p className="fleet-lead" data-reveal>
          Owned trucks, partner aircraft and contracted vessel capacity —
          coordinated from one control tower in Dallas, around the clock.
        </p>
        <div className="fleet-chips" data-reveal>
          <span>120+ tractor units</span>
          <span>38 airline partners</span>
          <span>12 ocean carriers</span>
        </div>
      </div>
    </section>
  );
}

export function FleetGallery() {
  return (
    <section className="fleet-gallery">
      <div className="container">
        <div className="gallery-grid">
          <figure className="gallery-item gallery-item-video" data-reveal>
            <video autoPlay muted loop playsInline>
              <source src="/assets/video/fleet-truck.mp4" type="video/mp4" />
            </video>
            <figcaption>
              <span className="gallery-kicker">Ground</span>
              <span className="gallery-title" data-split>
                On the road, on schedule
              </span>
            </figcaption>
          </figure>
          <figure className="gallery-item" data-reveal>
            <img
              src="/assets/img/fleet-ship.png"
              alt="Express Link container vessel at sea during sunset, loaded with containers"
              loading="lazy"
            />
            <figcaption>
              <span className="gallery-kicker">Ocean</span>
              <span className="gallery-title" data-split>
                Capacity on every trade lane
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
