# IronArc Industries website

Static, dependency-free public site at https://ironarcindustries.uk/.
The existing black-first palette, wordmark, typography and section/card layouts are preserved.
CNAME retains the existing GitHub Pages custom domain.

## Public positioning

- FORGE: command layer.
- TEMPER: intelligence / perception layer.
- KASSCORE: interoperability / shared operational state layer.
- Validate FORGE and TEMPER first. Third-party UAV/UGV/USV and external command-system interoperability is the development direction, not universal compatibility.
- Spain/Europe is the target ecosystem direction. No established office, incorporation or relocation is claimed.
- Invite technical support, pilot partners, validation opportunities, investors and ecosystem partners.

Only update capability statements when supported by current evidence. Keep internal implementation details out of the public site.

## Preview and publish

Run python -m http.server 4173 --bind 127.0.0.1 from this directory, then visit http://127.0.0.1:4173/.
No build step or package installation is needed.

Review and merge the update branch into the branch used by GitHub Pages. Confirm the publishing source in repository Settings > Pages; retain the current source and custom domain.
After publishing, check the HTTPS homepage, /robots.txt, /sitemap.xml and /favicon.svg.
The canonical URL is taken from the existing CNAME. Confirm HTTPS and preferred-host redirects in Pages/DNS settings; static HTML cannot enforce server redirects.

## SEO

The page includes title/description, canonical, robots directive, Open Graph and Twitter summary metadata, and Organization/WebSite JSON-LD.
The sitemap contains the single canonical page, not fragment anchors or duplicate URLs.
There is one H1, section H2s and card H3s. All copy is static, crawlable HTML.
The text wordmark and CSS decoration need no image alt attributes; there are no content images. Give future meaningful images descriptive alt text and decorative images empty alt text.
No social image is claimed because the original repository has no approved image asset. Add an approved public image and absolute og:image/twitter:image URLs plus descriptive image alt metadata when available.

Keyword themes are used naturally: UAV command and control, autonomous systems mission software, interoperability, edge AI perception, drone inspection, UAS operations and multi-domain robotics. No keyword stuffing or meta-keywords tag.

## Google Search Console verification

No verification token has been invented or activated.

1. Open https://search.google.com/search-console/ and add ironarcindustries.uk as a Domain property.
2. Recommended: copy Google's actual TXT record into domain DNS and verify. Keep that record after verification.
3. Alternatively add the URL-prefix property https://ironarcindustries.uk/. Either insert Google's exact google-site-verification meta tag at the marked location in index.html, or place Google's downloaded verification HTML file unchanged beside index.html. Deploy it at the exact root path supplied by Google.
4. Publish, confirm the tag is in page source or the file is publicly accessible, then click Verify. Keep the tag/file after verification.
5. Submit https://ironarcindustries.uk/sitemap.xml in Sitemaps. Inspect the homepage URL and request indexing.
6. Monitor indexing, canonical selection, impressions, queries and clicks. Indexing and rankings are not guaranteed.

Official guide: https://support.google.com/webmasters/answer/9008080
Sitemap guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Google Analytics 4 (inactive until configured)

analytics.example.js is an opt-in integration example, deliberately not included by index.html.
An empty measurement ID and a production-host guard prevent accidental collection.

1. Create/select the actual GA4 property and Web data stream for https://ironarcindustries.uk/. Copy its real G- measurement ID.
2. Copy analytics.example.js to analytics.js and set measurementId to that actual value.
3. Set up a suitable consent choice and privacy notice before activation. Load /analytics.js and call window.enableIronArcAnalytics() only after analytics consent is granted (including a previously saved valid choice). Do not call it on ordinary page load without consent.
4. Connect consent withdrawal to stopping collection; Google supports window['ga-disable-' + measurementId] = true. Respect withdrawal on future visits and handle stored analytics cookies in the consent implementation.
5. Verify in GA4 Realtime/DebugView after consent on production. Confirm one page_view, no duplicate tag, and no Google Analytics requests before consent. For DebugView, temporarily use debug_mode: true in the config call, then remove it.
6. Local previews are deliberately excluded. Do not add contact details or other personal information to event parameters.

Consent UI, an active tracking ID, account access and a completed privacy notice are not supplied by this placeholder.
Official tag guide: https://developers.google.com/tag-platform/gtagjs
