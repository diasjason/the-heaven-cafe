# The Heaven Cafe

A Sites application using React/Vinext, Cloudflare D1 and R2. The original brief is implemented as a customer website and connected ordering, counter, kitchen and owner workspace. The original nine-page menu supplies the exact logo, food artwork, 144 menu products and seven category-specific add-on rows. Fourteen rows have no printed price and remain unavailable with explicit null prices. Cafe address, phone, opening hours and restaurant platform links are not invented.

## Activation

Visit `/manage` while signed in with ChatGPT. Use the one-time owner activation code supplied separately. This connects the authenticated account as the owner. Staff members are authorised by their unique ChatGPT account email, bound to their stable platform subject on first sign-in. Owner, manager and kitchen permissions are checked in server APIs. Passwords and recovery stay with ChatGPT; no standalone password store is created.

Supply the official logo and nine-page menu. Verify every item, size, price, diet marker and add-on against that original before opening orders. Upload product photos through Menu management. Original gallery, hero, about images and logo are replaceable. Complete cafe contacts, direct restaurant platform links, opening hours, fulfilment settings, serviceable delivery pincodes, taxes and table numbers. Ordering is off by default.

## Payments

Server runtime secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`. No secrets belong in the source repository or frontend. Configure the Razorpay `payment.captured` webhook at `/api/payment/webhook`. It verifies the raw-body HMAC and queries Razorpay to confirm the expected order, amount, INR currency and captured status. Browser checkout responses are signature-verified and then independently queried server-side. Customer order requests and payment verification are idempotent. Unpaid online orders cannot enter preparation.

The site is initially owner-private. Live payment webhooks and customer ordering require the owner to request public Site access before launch. Configure and test merchant test-mode payments, payment failure/retry and signed webhook delivery before enabling live merchant credentials. Live merchant payments have not been tested because credentials were not supplied. Online refunds are deliberately handled in the merchant dashboard and are not falsely presented as automated. Cash collection and full cash refund records are permission-controlled and audited.

## Operations

Orders persist centrally, with unique autoincrement order codes, secure customer tracking tokens, immutable item snapshots, timestamped status history and optimistic concurrency checks. Counter, kitchen and customer tracking poll at six/seven-second intervals. This is near-live polling, not WebSockets. Kitchen API responses omit prices, totals, payment information and customer contact details. The kitchen receives only paid online tickets. Menu availability and serviceability are checked on the server at checkout; totals use integer paise.

Owner reports include date filters in Asia/Kolkata, category/item sales, payment and source breakdowns, customers, order history, CSV exports and browser print-to-PDF. Gross values, discounts, tax, delivery fees, refunds and collections are distinct; no profit figure is fabricated. Receipt print views cover A4, 80mm and 58mm. Printer hardware has not been tested. Table QR codes are generated locally; no customer information is sent to a QR service. Owner and manager interfaces use the latest 200 orders; owner date-range reports query full history. Gallery removal removes the website entry; historical R2 objects remain retained until explicit cleanup.

Advanced inventory/cost accounting, automated online refund reconciliation, loyalty points, marketing, multiple kitchen stations and platform order ingestion are not enabled. No Zomato/Swiggy API integration is claimed; configured buttons link directly to the owner's restaurant URLs. Refunds performed externally are not automatically reflected in the current reports.

## Validation

`node tests/integration.mjs` exercises persisted orders, price tampering, taxes, coupons, variants, add-ons, idempotency, guest tracking tokens, server role boundaries, staff deactivation, sold-out items, delivery pincode checks, status transitions, cash collections/refunds, payment signature rejection and captured-payment verification using a mocked payment provider. Synthetic test data stays in an in-memory database and is not deployed.

`npx tsc --noEmit`

Build and publication follow the Sites repository workflow. Generated SQL migrations in `drizzle/` are schema-only. D1 and R2 are provisioned by the tracked hosting manifest.


## Original menu import (16 November 2026)

`data/heaven-menu.json` records every reviewed table row, its physical PDF page, exact spelling and price. Milk-based tea has Small/Large variants; the supplied single-topping choices and explicitly named preparation alternatives are selectable at the printed prices. The source category spelling "Smoothy" is retained. `scripts/create-menu-data.py` reproduces this transcription. `scripts/prepare-menu.py /path/to/The_HeavenCafe_Complete_Menu.pdf` extracts the original logo and category artwork without redrawing it, and creates the optimised nine-page PDF offered by the website.

A one-time, atomic D1 data import runs when the catalog is first requested. It inserts source products and branding outside schema migrations. The persisted marker prevents a later visit or deployment from resurrecting deleted products or overwriting owner edits. Existing owner contacts, logo, hero and ordering preferences are preserved. Orders remain closed by default. The importer creates no users and changes no role permissions.

The PDF contains no cafe contact details or opening hours. Fourteen prices are absent: Croutons; the four Lemonades; the six Non Alcoholic entries; Water Bottle, Soft Drink, and Energy Drink. These are displayed as "Price on request" and cannot be activated until a price is supplied. Kurkure Coating (₹199), combo component choices and pizza sizes still require owner clarification before accepting live orders. Original item descriptions are used only where printed. Category pictures are labelled representative menu artwork.

`node tests/menu-import.mjs` verifies all 151 source rows, exact variants and add-ons, null-price guards, atomic concurrent import, idempotency and preservation of owner edits/deletions.


## Individual photography and readability update

Each of 144 menu products has a distinct licensed, locally hosted WebP photograph at a 1600-pixel longest edge, with public source, photographer and licence attribution at `/photo-credits`. Photographs are representative, not representations of actual cafe servings. Proprietary flavours, hidden fillings, meat species and exact portions cannot be verified from stock imagery; these limits are documented per product in `data/product-photos.json`. The momo combo uses a two-panel photo treatment to include its fries side. The menu’s names, prices, variations and add-ons are unchanged. Missing prices stay null and unavailable.

The high-resolution transparent logo is supplied as PNG and lossless WebP. The background and corner decoration have been removed. The header uses warm cream so the original emerald lettering remains visible without a white logo patch; emerald and gold remain throughout the site. Large existing display headings are unchanged; navigation, supporting text, controls, food cards, forms, contact information and footer text are larger. Navigation collapses at laptop/tablet widths before links can wrap. Food cards include quantity controls, add-to-cart, and a larger photograph preview.

`lib/visual-assets.js` performs a one-time atomic data update of source-owned image paths and the former default logo. It never changes prices, availability, staff, ordering, contacts, owner-uploaded images or custom gallery photographs. The marker preserves later owner edits. `node tests/visual-assets.mjs` verifies those boundaries. Catalogue and ordering tests continue to pass. The original menu preparation script overlays the current individual photo manifest when rerun.

## Official contact update — 16 November 2026

`lib/contact-details.js` is the single WhatsApp destination and message formatter. All WhatsApp links use +91 8767846783. +91 7219487686 is calling only; both numbers have valid `tel:` links. The catalog applies an atomic, once-only contact settings patch, preserving ordering, payment settings, menu data and owner uploads. The owner settings API rejects a different WhatsApp destination. Email and the remaining contact fields remain editable.

Order sharing retrieves the saved order by its tracking token before opening WhatsApp, and includes current payment status, quantities, variants, add-ons, total and fulfilment details. Sharing does not send the message or mark it confirmed.

Google Maps verification found that the exact supplied address directions URL resolves to K Movie Star Multiplex. A Maps listing named The heaven cafe exists at 4, Bhabola Chulna Road, but has no phone, hours or website to establish it is this business. No coordinates or Place ID were inferred. The provided directions URL remains, the embedded map is explicitly labelled an address search, and the UI asks visitors to call to confirm the entrance. A verified owner-provided cafe pin is needed to finish precise pin verification.

Instagram preview uses only owner-uploaded `/api/media/` gallery photographs. Until those exist, it displays a direct link to the official profile, not a fabricated feed or stock photographs described as cafe photographs.

## Development and source maintenance

Maintained source: https://github.com/diasjason/the-heaven-cafe (public, as requested by the project owner).
Hosting remains the existing Sites project at https://the-heaven-cafe.clientscaleiq.chatgpt.site.
This GitHub handoff is based on saved Site version 12, source commit `839c8da7d1c628ba1ef5b87faa8e31f529aa706f`.

Use Node.js 22.13 or later and the checked-in npm lockfile:

```sh
npm run install:ci
npm run dev
node --test tests/*.mjs
npx tsc --noEmit
npm run build
```

`npm run dev` starts the framework preview; `npm run build` emits the Worker bundle to `dist/server/`. Local identity emulation is for development only. Keep the existing Sites authentication integration in production.

For publishing, retain `.openai/hosting.json` and the managed Sites source remote. Sync the reviewed GitHub revision into the Sites checkout and publish that same revision through Sites. GitHub stores source; a push there alone does not deploy the site or transfer live D1/R2 data, accounts, or runtime secrets. Runtime values such as `OWNER_SETUP_TOKEN` and optional payment-provider secrets must be configured securely outside Git.

Direct merchant UPI QR quotes and order references are included in version 12. They do not prove receipt of payment: direct UPI orders remain unpaid and out of the kitchen until a supported verification flow is implemented. Existing optional gateway and cash paths are retained.
