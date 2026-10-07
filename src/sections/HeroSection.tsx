import { trpc } from "@/providers/trpc";
import { Stars } from "@/components/site/Stars";
import {
  SHIPMENT_STATUSES,
  SHIPMENT_STATUS_LABELS,
  type ShipmentStatus,
} from "@contracts/shipping";

type TrackResult = Awaited<
  ReturnType<ReturnType<typeof trpc.useUtils>["tracking"]["lookup"]["fetch"]>
>;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function TrackWidget() {
  const utils = trpc.useUtils();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await utils.tracking.lookup.fetch({ code: trimmed });
      setResult(data);
    } catch {
      setError(
        "No shipment found for that number. Check the code and try again — or ask us for a demo code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const doneCount = result
    ? SHIPMENT_STATUSES.indexOf(result.status as ShipmentStatus) + 1
    : 0;

  return (
    <div className="track-strip reveal-hero">
      <form className="track-form" onSubmit={onSubmit} noValidate>
        <label htmlFor="trackInput" className="track-label">
          <SearchIcon />
          Track a shipment
        </label>
        <input
          id="trackInput"
          type="text"
          placeholder="e.g. EXL-28471-TX"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          <span className="btn-marker"></span>
          {loading ? "…" : "Track"}
        </button>
      </form>

      {error && <div className="track-error">{error}</div>}

      {result && (
        <div className="track-result">
          <div className="track-meta">
            <strong>{result.trackingCode}</strong>
            <span
              className={`track-status${
                result.status === "delivered" ? " is-delivered" : ""
              }`}
            >
              {SHIPMENT_STATUS_LABELS[result.status as ShipmentStatus] ??
                result.status}
            </span>
            <span className="track-route">
              {result.origin} → {result.destination}
              {result.eta ? ` · ETA ${result.eta}` : ""}
            </span>
          </div>
          {result.events.length > 0 && (
            <div className="track-events">
              {[...result.events]
                .reverse()
                .slice(0, 20)
                .map((ev) => (
                  <div className="track-event" key={ev.id}>
                    <time>
                      {new Date(ev.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                    <span>
                      <strong>
                        {SHIPMENT_STATUS_LABELS[ev.status as ShipmentStatus] ??
                          ev.status}
                      </strong>
                      {ev.location ? ` — ${ev.location}` : ""}
                      {ev.note ? ` · ${ev.note}` : ""}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/img/hero-poster.jpg"
        >
          <source src="/assets/video/hero-takeoff.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <p className="eyebrow eyebrow-light reveal-hero">
          <span className="marker"></span>Dallas, TX — Worldwide
        </p>

        <div
          className="hero-rating reveal-hero"
          aria-label="Rated 4.9 out of 5 by more than 2,400 shippers"
        >
          <Stars />
          <span className="rating-text">4.9/5 — trusted by 2,400+ shippers</span>
        </div>

        <div className="hero-ctas reveal-hero">
          <a href="#contact" className="btn btn-primary">
            <span className="btn-marker"></span>Get a Free Quote
          </a>
          <a href="#services" className="btn btn-ghost">
            Explore Services
          </a>
        </div>

        <h1 className="hero-title" aria-label="Global reach. Delivered.">
          <span className="hero-line hero-line-left" data-split>
            GLOBAL REACH.
          </span>
          <span className="hero-line hero-line-right" data-split>
            DELIVERED.
          </span>
        </h1>

        <TrackWidget />
      </div>

      <a className="scroll-hint" href="#ticker" aria-label="Scroll down">
        <span></span>
      </a>
    </section>
  );
}
