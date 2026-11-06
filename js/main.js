/* ============================================================
   EXPRESS LINK LOGISTICS — main.js
   ============================================================ */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Page load entrance ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("is-loaded");
  });

  /* ---------- Split text into word masks ---------- */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var outer = document.createElement("span");
      outer.className = "word";
      var inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;
      inner.style.transitionDelay = i * 70 + "ms";
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  var splitEls = document.querySelectorAll("[data-split]");
  splitEls.forEach(splitWords);

  /* ---------- IntersectionObserver reveals ---------- */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-reveal], [data-split]").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Animated counters (one-shot) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    var duration = 1600;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach(function (el) {
    countObserver.observe(el);
  });

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll(".main-nav a");
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = sections.indexOf(entry.target);
          navLinks.forEach(function (a, i) {
            a.classList.toggle("is-active", i === idx);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach(function (s) {
    if (s) sectionObserver.observe(s);
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Live shipment tracking ---------- */
  var trackForm = document.getElementById("trackForm");
  var trackInput = document.getElementById("trackInput");
  var trackResult = document.getElementById("trackResult");
  var trackCode = document.getElementById("trackCode");
  var trackStatus = document.getElementById("trackStatus");
  var trackSteps = document.querySelectorAll("#trackTimeline li");
  
  var statusToStep = {
    pending: 1,
    picked_up: 1,
    in_transit: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  function humanize(status) {
    return (status || "").replace(/_/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  if (trackForm) {
    trackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = trackInput.value.trim();
      if (!raw) { trackInput.focus(); return; }
      var code = raw.toUpperCase();

      trackResult.hidden = true;

      // Adjust "/api/trpc" if your tRPC mount path is different
      fetch("/api/trpc/tracking.lookup?input=" + encodeURIComponent(JSON.stringify({ code: code })))
        .then(function (r) {
          return r.json().then(function (j) {
            if (!r.ok) {
              throw new Error((j && j.error && j.error.json && j.error.json.message) || "No shipment found for that tracking number.");
            }
            return j.result.data;
          });
        })
        .then(function (data) {
          trackCode.textContent = data.trackingCode;
          trackStatus.textContent = humanize(data.status);
          trackStatus.classList.toggle("is-delivered", data.status === "delivered");

          var step = statusToStep[data.status] || 1;
          trackSteps.forEach(function (li, i) {
            li.classList.toggle("is-done", i < step);
          });

          // --- BUILD THE DYNAMIC TABLES ---
          var html = `
            <h3 class="table-title">Shipment Details</h3>
            <table class="tracking-table">
              <tr><td>Mode of transport</td><td>${data.modeOfTransport || '—'}</td></tr>
              <tr><td>Airport of departure</td><td>${data.departureAirport || '—'}</td></tr>
              <tr><td>Airport of destination</td><td>${data.destinationAirport || '—'}</td></tr>
              <tr><td>Final delivery address</td><td>${data.finalDeliveryAddress || '—'}</td></tr>
              <tr><td>Consignee EORI number</td><td>${data.consigneeEori || 'Not applicable'}</td></tr>
            </table>
          `;

          if (data.vehicles && data.vehicles.length > 0) {
            html += `<h3 class="table-title">Goods — Vehicles (${data.vehicles.length}x)</h3>
              <table class="tracking-table">
                <thead><tr><th>#</th><th>Vehicle</th><th>VIN</th><th>HS Code</th><th>Origin</th></tr></thead>
                <tbody>`;
            data.vehicles.forEach(function (v, i) {
              html += `<tr>
                <td>${i + 1}</td>
                <td>${v.vehicle}</td>
                <td>${v.vin}</td>
                <td>${v.hsCode}</td>
                <td>${v.origin}</td>
              </tr>`;
            });
            html += `</tbody></table>`;
          }

          if (data.goldInvestment || data.goldJewelry) {
            html += `<h3 class="table-title">Goods — Gold / Jewelry</h3>
              <table class="tracking-table">
                ${data.goldInvestment ? `<tr><td>Investment gold</td><td>${data.goldInvestment}</td></tr>` : ''}
                ${data.goldJewelry ? `<tr><td>Gold jewelry</td><td>${data.goldJewelry}</td></tr>` : ''}
                <tr><td>Customs tariff no.</td><td>${data.customsTariffNo || '—'}</td></tr>
                <tr><td>Exact total weight</td><td>${data.exactWeight || '—'}</td></tr>
                <tr><td>Declared total value</td><td>${data.declaredValue || '—'}</td></tr>
                <tr><td>Payment status</td><td class="paid-text">${data.paymentStatus || '—'}</td></tr>
              </table>
            `;
          }

          if (data.goods) {
            html += `<h3 class="table-title">Additional Notes</h3>
              <div style="padding: 15px; border: 1px solid #d1d5db; background: #fff; margin-bottom: 20px;">${data.goods}</div>`;
          }

          document.getElementById('shipmentDetailsContainer').innerHTML = html;
          // --- END DYNAMIC TABLES ---

          trackResult.hidden = false;
          trackResult.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
        })
        .catch(function (err) {
          trackResult.hidden = true;
          alert(err.message || "Lookup failed. Please try again.");
        });
    });
  }

  /* ---------- Quote form -> pre-filled email ---------- */
  var quoteForm = document.getElementById("quoteForm");
  var formNote = document.getElementById("formNote");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("qName");
      var email = document.getElementById("qEmail");
      var valid = true;

      [name, email].forEach(function (field) {
        var bad = !field.value.trim() || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.classList.toggle("is-invalid", bad);
        if (bad) valid = false;
      });

      if (!valid) {
        formNote.textContent = "Please add your name and a valid work email.";
        formNote.classList.remove("is-success");
        return;
      }

      var lines = [
        "Name: " + name.value.trim(),
        "Email: " + email.value.trim(),
        "Origin: " + (document.getElementById("qOrigin").value.trim() || "—"),
        "Destination: " + (document.getElementById("qDest").value.trim() || "—"),
        "Mode: " + document.getElementById("qMode").value,
        "",
        "Shipment details:",
        document.getElementById("qMsg").value.trim() || "—"
      ];

      var mailto = "mailto:expresslink.top@outlook.com" +
        "?subject=" + encodeURIComponent("Quote request — " + name.value.trim()) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      window.location.href = mailto;

      formNote.textContent = "Your email app should open now — press send and we'll reply within one business hour.";
      formNote.classList.add("is-success");
    });

    ["qName", "qEmail"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () {
          this.classList.remove("is-invalid");
        });
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
