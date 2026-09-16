// Inactive example: NOT loaded by index.html.
// Set the real GA4 ID and call only after analytics consent; see README.md.
window.enableIronArcAnalytics = function () {
  const measurementId = "";
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return false;
  if (location.hostname !== "ironarcindustries.uk") return false;
  if (window.ironArcAnalyticsStarted) return true;
  window.ironArcAnalyticsStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
  return true;
};
