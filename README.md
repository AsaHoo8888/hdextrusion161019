# HD Extrusion website

English responsive showroom homepage built with plain HTML, CSS and JavaScript. No build step or production package dependencies.

## Preview

Run `python3 -m http.server 8080 --bind 127.0.0.1` in this folder and open http://127.0.0.1:8080/.

## Check

Run `node --check app.js` and `node --check inquiry.js` and `node tests/inquiry.test.cjs` and `node tests/video.test.cjs`. The focused test checks material selection, diameter transfer and generated inquiry contents. Desktop and mobile were also inspected in a browser.

## Publish

Upload only `index.html`, `about.html`, `contact.html`, `contact-us.html`, `contact.css`, `video.html`, `pvc-pipe-extrusion-line.html`, `pe-pipe-extrusion-line.html`, `ppr-4-layer-co-extrusion-line.html`, `styles.css`, `product.css`, `video.css`, `app.js`, `navigation.js`, `inquiry.js`, `video.js` and `assets/` to your static host. Exclude development records, tests and `.impeccable/` from the published files. Hosting has not been configured.

## Owner-supplied items

- Replace the clearly labeled AI machinery illustration with approved product imagery when available.
- Supply final logo artwork. The current typographic name and favicon are provisional; the confirmed brand accent is `#cb3a56`.
- Supply verified WhatsApp/email details and an inquiry delivery endpoint. Currently the form downloads a local text brief and does not transmit an inquiry or store it remotely.
- Supply actual technical data, factory videos, certificates and references before publishing those as proof.

The local font is Manrope, licensed under the included SIL Open Font License. AI artwork was produced with the built-in imagegen tool; its exact prompt and provenance are recorded alongside the asset.

The video library uses 18 YouTube IDs from the supplied Huade reference page. Metadata/provenance is recorded in `assets/videos.json`. Thumbnails are remotely hosted and players load on demand; playback depends on YouTube availability and network access.

The PVC product page uses original equipment imagery with source sidecars in `assets/pvc/`. The source page’s unrelated PC lamp-tube introduction was excluded; listed configuration values require project confirmation.

The PE page reuses the product layout and shared HDPE inquiry validation. Its original equipment images and source notes are in `assets/pe/`; unrelated PVC boilerplate from the reference was excluded.

The PPR four-layer page uses original source photos and source notes in `assets/ppr/`. No layer recipe or diameter standard is inferred from the source; confirm these during engineering selection.

## Product catalogue

`products.html` lists 38 products in nine categories. Deploy `products-category/`, `product/`, `catalog.css`, `product-detail.js` and `assets/catalog/` with the existing site. All pages are static; no runtime or build service is required.

The source snapshot in `assets/catalog/catalog.json` records each original product URL, image URL, category, description and reference table. To regenerate catalogue HTML after editing this snapshot, run `python3 scripts/build_catalog.py`. It uses the current Contact page header/footer. Run `python3 tests/catalog.test.py` to check catalogue coverage and local links/anchors.

Product inquiry actions open an email draft to sales@hdextrusion.com with the equipment name. Sending remains the visitor’s action. Published specifications should be confirmed for the project.
