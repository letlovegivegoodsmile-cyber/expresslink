import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { FREIGHT_MODES } from "@contracts/shipping";

const CONTACT_ICON_PROPS = {
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function QuoteForm() {
  const submit = trpc.quotes.submit.useMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    origin: "",
    destination: "",
    mode: FREIGHT_MODES[0] as string,
    message: "",
  });
  const [invalid, setInvalid] = useState({ name: false, email: false });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (key === "name" || key === "email") {
      setInvalid((v) => ({ ...v, [key]: false }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const badName = form.name.trim().length < 2;
    const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    setInvalid({ name: badName, email: badEmail });
    if (badName || badEmail) return;

    setError("");
    submit.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        origin: form.origin.trim() || undefined,
        destination: form.destination.trim() || undefined,
        mode: form.mode as (typeof FREIGHT_MODES)[number],
        message: form.message.trim() || undefined,
      },
      {
        onSuccess: () => setDone(true),
        onError: (err) =>
          setError(err.message || "Something went wrong — please try again."),
      },
    );
  };

  if (done) {
    return (
      <div className="quote-form quote-success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <h3>Quote request received</h3>
        <p>
          Thanks, {form.name.split(" ")[0]}. Your request is in our system — a
          rated, all-in quote lands in your inbox within one business hour.
        </p>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate data-reveal>
      <div className="form-row">
        <div className="field">
          <label htmlFor="qName">Full name</label>
          <input
            id="qName"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            className={invalid.name ? "is-invalid" : ""}
          />
        </div>
        <div className="field">
          <label htmlFor="qEmail">Work email</label>
          <input
            id="qEmail"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            className={invalid.email ? "is-invalid" : ""}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="qOrigin">Origin</label>
          <input
            id="qOrigin"
            type="text"
            placeholder="City, country"
            value={form.origin}
            onChange={set("origin")}
          />
        </div>
        <div className="field">
          <label htmlFor="qDest">Destination</label>
          <input
            id="qDest"
            type="text"
            placeholder="City, country"
            value={form.destination}
            onChange={set("destination")}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="qMode">Freight mode</label>
        <select id="qMode" value={form.mode} onChange={set("mode")}>
          {FREIGHT_MODES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="qMsg">Shipment details</label>
        <textarea
          id="qMsg"
          rows={4}
          placeholder="Cargo type, weight, dimensions, timeline…"
          value={form.message}
          onChange={set("message")}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={submit.isPending}
      >
        <span className="btn-marker"></span>
        {submit.isPending ? "Sending…" : "Request My Quote"}
      </button>
      <p className={`form-note${error ? " is-error" : ""}`}>
        {error || "Your request goes straight to our quoting desk — replies within one business hour."}
      </p>
    </form>
  );
}

export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <p className="eyebrow eyebrow-light">
            <span className="marker"></span>Get a quote
          </p>
          <h2 data-split>Tell us what needs to move.</h2>
          <p className="contact-lead" data-reveal>
            One business hour. That's how fast a real human — not a bot — comes
            back with a rated, all-in quote.
          </p>

          <ul className="contact-details" data-reveal>
            <li>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" {...CONTACT_ICON_PROPS}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <strong>Head Office</strong>
                <span>1200 Logistics Blvd, Dallas, TX 75201</span>
              </div>
            </li>
            <li>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" {...CONTACT_ICON_PROPS}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <strong>Phone</strong>
                <a href="tel:+13472542428">+1 (347) 254-2428</a>
              </div>
            </li>
            <li>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" {...CONTACT_ICON_PROPS}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
              <div>
                <strong>Email</strong>
                <a href="mailto:expresslink.top@outlook.com">
                  expresslink.top@outlook.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        <QuoteForm />
      </div>
    </section>
  );
}
