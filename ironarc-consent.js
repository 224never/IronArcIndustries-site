(() => {
  "use strict";

  if (window.ironArcAnalyticsInstalled) return;
  window.ironArcAnalyticsInstalled = true;

  const ID = "G-HYSHPGQ8MR";
  const KEY = "ironarc.analytics-consent.v1";
  const PRODUCTION_ORIGIN = "https://ironarcindustries.uk";
  const production = location.origin === PRODUCTION_ORIGIN;

  const denied = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  };

  const french = document.documentElement.lang === "fr";
  const copy = french ? {
    label: "Mesure d’audience facultative",
    message: "IronArc utilise une mesure d’audience limitée pour comprendre et améliorer les performances du site. Cette mesure est facultative.",
    accept: "Accepter la mesure d’audience",
    decline: "Refuser",
    preferences: "Préférences de mesure d’audience"
  } : {
    label: "Optional analytics",
    message: "IronArc uses limited analytics to understand website performance and improve the site. Analytics is optional.",
    accept: "Accept analytics",
    decline: "Decline",
    preferences: "Analytics preferences"
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  const gtag = window.gtag;

  // Consent defaults are set before Google Analytics is loaded.
  gtag("consent", "default", {
    ...denied
  });

  gtag("set", "ads_data_redaction", true);

  let accepted = false;
  let started = false;

  function readChoice() {
    try {
      const value = localStorage.getItem(KEY);
      return value === "accepted" || value === "declined" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function saveChoice(choice) {
    try {
      localStorage.setItem(KEY, choice);
    } catch (_) {}
  }

  function startAnalytics() {
    if (!production || started) return;

    started = true;

    gtag("js", new Date());

    gtag("config", ID, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "ironarcindustries.uk",
      cookie_flags: "SameSite=Lax;Secure"
    });

    if (!document.getElementById("ironarc-google-tag")) {
      const tag = document.createElement("script");
      tag.id = "ironarc-google-tag";
      tag.async = true;
      tag.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(ID);
      document.head.appendChild(tag);
    }
  }

  function buildConsentUI() {
    if (document.getElementById("ia-consent")) return;

    const style = document.createElement("style");

    style.textContent = `
      #ia-consent[hidden] {
        display: none !important;
      }

      #ia-consent {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        max-width: 720px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #97a39d;
        background: #11171b;
        color: #e8ece9;
        font: 16px/1.5 Arial, Helvetica, sans-serif;
      }

      #ia-consent p {
        margin: 0 0 16px;
      }

      #ia-consent .ia-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      #ia-consent button,
      #ia-analytics-preferences {
        min-height: 44px;
        padding: 12px 16px;
        border: 1px solid #97a39d;
        background: #171e23;
        color: #e8ece9;
        font: 700 12px Arial, Helvetica, sans-serif;
        letter-spacing: .06em;
        cursor: pointer;
      }

      #ia-consent button:focus-visible,
      #ia-analytics-preferences:focus-visible {
        outline: 2px solid #e8ece9;
        outline-offset: 4px;
      }

      #ia-analytics-preferences {
        padding: 6px 10px;
        font-size: 13px;
      }

      @media (max-width: 520px) {
        #ia-consent {
          left: 10px;
          right: 10px;
          bottom: 10px;
          padding: 16px;
        }

        #ia-consent .ia-actions {
          flex-direction: column;
        }

        #ia-consent button {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);

    const banner = document.createElement("aside");
    banner.id = "ia-consent";
    banner.hidden = true;
    banner.setAttribute("aria-label", copy.label);

    const message = document.createElement("p");
    message.textContent = copy.message;
    const actions = document.createElement("div");
    actions.className = "ia-actions";
    for (const [id, label] of [["ia-accept", copy.accept], ["ia-decline", copy.decline]]) {
      const button = document.createElement("button");
      button.id = id;
      button.type = "button";
      button.textContent = label;
      actions.appendChild(button);
    }
    banner.append(message, actions);
    document.body.appendChild(banner);

    const preferences = document.createElement("button");
    preferences.id = "ia-analytics-preferences";
    preferences.type = "button";
    preferences.textContent = copy.preferences;
    const footer = document.getElementById("footer-utility") || document.querySelector("footer") || document.body;
    footer.appendChild(preferences);

    return { banner, preferences };
  }

  function applyChoice(choice, persist = true) {
    const banner = document.getElementById("ia-consent");

    accepted = choice === "accepted";

    window["ga-disable-" + ID] = !accepted;

    gtag("consent", "update", {
      ...denied,
      analytics_storage: accepted ? "granted" : "denied"
    });

    if (persist) {
      saveChoice(choice);
    }

    if (banner) {
      banner.hidden = true;
    }

    if (accepted) {
      startAnalytics();
    }
  }

  function init() {
    const ui = buildConsentUI();
    const banner = ui.banner;

    document
      .getElementById("ia-accept")
      .addEventListener("click", () => {
        applyChoice("accepted", true);
      });

    document
      .getElementById("ia-decline")
      .addEventListener("click", () => {
        applyChoice("declined", true);
      });

    ui.preferences.addEventListener("click", () => {
      banner.hidden = false;
    });

    document.addEventListener("click", event => {
      if (
        !accepted ||
        !production ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      const eventName = link.dataset.analyticsEvent || (href === "#contact" ? "contact_click" : undefined);

      if (!eventName) return;

      gtag("event", eventName, {
        send_to: ID
      });
    });

    window.addEventListener("storage", event => {
      if (event.key !== KEY) return;

      const choice = readChoice();

      if (choice) {
        applyChoice(choice, false);
      } else {
        accepted = false;
        window["ga-disable-" + ID] = true;
        banner.hidden = false;
      }
    });

    const saved = readChoice();

    if (saved) {
      applyChoice(saved, false);
    } else {
      window["ga-disable-" + ID] = true;
      banner.hidden = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
