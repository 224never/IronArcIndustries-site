# IronArc Industries public website

Static bilingual website at https://ironarcindustries.uk/. English is served at the root and French at /fr/. Both pages have their own metadata and reciprocal alternate-language links. Netlify serves the production site from GitHub main.

## Editing and preview

Update both locales in site-source/content.json. The pages share a template at site-source/page.html and styling in ironarc.css.

1. Run `python3 scripts/render.py` to regenerate both checked-in HTML pages.
2. Run `python3 scripts/render.py --check` to verify the output is current.
3. Run `python3 -m http.server 4173 --bind 127.0.0.1` from the repository root to preview both locales.

Netlify can serve the checked-in HTML without a build step. Keep the two canonical URLs in sitemap.xml and verify both routes and language links after a production deployment.

## Public content

IronArc is a pre-incorporation R&D venture developing software, TEMPER sensing nodes and integrated IronArc carrier systems for human-operated missions. AI is advisory. CIVIL is the near-term focus. Keep evidence scoped and reviewed before updating maturity or capability claims. Internal details and restricted material belong in their approved repositories.

## Analytics

The existing ironarc-consent.js handles optional Google Analytics on the production origin. Its controls use the current page language and share the existing consent preference across both pages. Controls can be tested locally, where analytics collection stays disabled. The analytics.example.js file is an unloaded reference.
