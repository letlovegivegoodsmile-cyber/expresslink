import { Stars } from "@/components/site/Stars";

const STEPS = [
  {
    num: "01",
    title: "Request a quote",
    text: "Send your lanes and cargo details — a rated quote comes back within one business hour.",
  },
  {
    num: "02",
    title: "We book & pick up",
    text: "We secure capacity, collect your freight and handle export paperwork and customs.",
  },
  {
    num: "03",
    title: "Track in real time",
    text: "Milestone updates from pickup to proof of delivery, with a human on call 24/7.",
  },
  {
    num: "04",
    title: "Delivered & billed",
    text: "On-time delivery, digital POD and one consolidated invoice. No surprises.",
  },
];

export function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">
            <span className="marker"></span>How it works
          </p>
          <h2 data-split>Quote to door in four steps.</h2>
        </header>

        <ol className="process-line">
          {STEPS.map((s) => (
            <li data-reveal key={s.num}>
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    quote:
      "Express Link moved our product launch inventory from Shenzhen to Dallas in six days — and quoted us before two other forwarders even replied.",
    name: "Marcus Turner",
    role: "COO, Brightline Electronics",
  },
  {
    quote:
      "Their tracking updates are so precise our warehouse team schedules dock labor around them. Three years, zero lost pallets.",
    name: "Priya Raman",
    role: "Supply Chain Director, Vela Foods",
  },
  {
    quote:
      "A snowstorm closed our usual lane two days before Christmas. One call to Express Link and the freight flew out the same night. Unreal service.",
    name: "Dana Whitfield",
    role: "Founder, Whitfield Home Goods",
  },
];

export function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <header className="section-head section-head-split">
          <div>
            <p className="eyebrow eyebrow-light">
              <span className="marker"></span>Client reviews
            </p>
            <h2 data-split>Rated five stars, shipment after shipment.</h2>
          </div>
          <div className="reviews-aggregate" data-reveal>
            <span className="aggregate-num">4.9</span>
            <Stars large />
            <span className="aggregate-note">2,400+ verified reviews</span>
          </div>
        </header>

        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <blockquote className="review" data-reveal key={r.name}>
              <Stars />
              <p>“{r.quote}”</p>
              <footer>
                <strong>{r.name}</strong>
                <span>{r.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
