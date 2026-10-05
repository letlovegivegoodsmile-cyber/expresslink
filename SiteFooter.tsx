import { Brand } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#top" className="brand" aria-label="Express Link Logistics home">
            <Brand />
          </a>
          <p className="footer-tag">Global reach. Delivered.</p>
          <img
            src="/assets/img/banner.png"
            alt="Express Link Logistics — air, ocean and ground freight"
            className="footer-banner"
            loading="lazy"
          />
        </div>

        <nav className="footer-col" aria-label="Services">
          <h4>Services</h4>
          <a href="#services">Air Freight</a>
          <a href="#services">Ocean Freight</a>
          <a href="#services">Ground Transport</a>
          <a href="#services">Warehousing</a>
        </nav>

        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <a href="#fleet">Our Fleet</a>
          <a href="#process">How It Works</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Get a Quote</a>
        </nav>

        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+13472542428">+1 (347) 254-2428</a>
          <a href="mailto:expresslink.top@outlook.com">
            expresslink.top@outlook.com
          </a>
          <span>
            1200 Logistics Blvd
            <br />
            Dallas, TX 75201
          </span>
        </div>
      </div>
      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <span>
            © {new Date().getFullYear()} Express Link Logistics. All rights
            reserved.
          </span>
          <span>Licensed &amp; insured freight forwarder — Dallas, Texas</span>
        </div>
      </div>
    </footer>
  );
}
