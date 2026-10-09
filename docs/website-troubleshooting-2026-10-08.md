# Website troubleshooting — 8 October 2026

Local audit of the existing Status Concept React/Vite website. Existing photography and other working-tree changes were preserved. No commit, push or deployment was performed. No customer enquiry was submitted and no database records were changed.

## Fixed

| Issue | Correction |
| --- | --- |
| Skip-to-content link could overwrite the HashRouter route | Prevent the hash navigation, focus the content target and scroll to it. |
| Navigation exposed disabled Projects, After Care and account flows | Respect existing feature flags; login/registration show the staged-feature screen while accounts are disabled. Remove inert mobile links. |
| Contact fields lacked associated labels | Associate all five labels, add appropriate input types and length limits. |
| No local enquiry backend configuration | Offer an explicitly labelled email-composer fallback. Visitors must review and send the email themselves; no false success message. |
| Product Back could leave the website on a direct entry | Use the router history index; otherwise fall back to Products. Browser-tested return to the previous Lounge category URL. |
| Product state could survive a change of product | Reset image, tab, lightbox and size selection when the product ID changes. |
| Kitchen size choices were dropped from detail data and buttons were inert | Preserve size options, make selection interactive, include selected size/SKU in quotation and WhatsApp enquiries. Browser-tested DRACARSET2 and the prefilled contact message. |
| Product list exposed items absent from approved detail pages | Use the same frozen demonstration catalogue for listing/search and product detail pages. Preserve unreviewed inventory rather than silently publishing it. Lounge now shows five available demonstration models, not 51 links to mostly unavailable pages. |
| Image overlays lacked modal keyboard behaviour | Shared native dialog for product and image-library viewers. Product viewer tested for modal focus containment and Escape dismissal. |
| Browser preference storage failures could crash consent/favourites | Guard reads, writes, deletion and JSON parsing; add regression tests for blocked storage and malformed favourites. |
| Missing Portuguese homepage and footer copy | Add translations for the current authentic-photography homepage and footer. |
| Client-origin images were present in the public image library | Archive 28 WhatsApp-source records and files outside the public folder, retain 774 public records, and check both original folder and source-reference path during future import. |
| Showroom areas used enhanced alternatives despite available photographs | Use existing Almancil photography and the sourced Quinta do Lago photograph; no new generated showroom image. |

## Still needs attention

1. **Product accuracy and completeness:** supplier-approved dimensions, frame materials, colourways, stock availability and current collections remain unverified. Sicily has manually authored specifications; some dimensions lack explicit units and kitchen dimension tables combine a complete measurement string into one column. Do not treat these as supplier-validated technical sheets.
2. **Catalogue approval:** the public catalogue is deliberately limited to five demonstration items per non-kitchen category. Carpets, Decor, Statues and Built-in Kitchens need approved product data and photographs; exposing drafts is not a troubleshooting fix.
3. **Enquiry backend:** no local Supabase environment configuration was found. Email fallback works, but automatic enquiry persistence/delivery and live authentication require configuration and end-to-end testing. Email delivery was not tested.
4. **Feature completion:** projects, after-care pages, accounts, favourites and staff delivery workflows are staged/disabled. Real project photographs, customer consent and service details are needed before enabling relevant features.
5. **Portuguese coverage:** some supplier descriptions, image alternatives and carousel accessibility labels remain English. A complete translation/content review is still needed.
6. **Performance:** the image-library JavaScript chunk is approximately 541 kB minified and triggers the build warning. Its large manifest and extensive PNG library need a lean public manifest, pagination and optimised image variants. No field Core Web Vitals assessment was performed.
7. **Search visibility:** HashRouter URLs and client-rendered metadata do not constitute a complete SEO strategy. Verify the intended production domain, crawlable product/category URLs, sitemap and structured data before deployment.
8. **Business/content verification:** confirm showroom phone numbers, opening hours, response-time promises, historical claims, image usage rights and product-photo associations with the business. These were not invented or silently changed.

## Verification

- `npm test`: 17 test files, 72 passing tests.
- `npm run lint`: passed.
- `npm run build`: passed, with the image-library chunk-size warning noted above.
- `git diff --check`: no whitespace errors (Windows line-ending notices only).
- Desktop route checks: Products, kitchen collection/accessory filters, Glatz, Contact, About, disabled Projects, Privacy, Cookies, Terms, disabled Login/Register, Portuguese homepage/catalogue.
- Mobile 390 × 844 checks: homepage, kitchen/accessories, Glatz, Contact and Portuguese homepage. No horizontal page overflow or broken completed images at the sampled views; no unlabelled form controls in these samples. Mobile menu opened and closed correctly.
- Product configuration enquiry, product Back and product image-modal checks performed in browser.
- 532 unique catalogue image paths checked for filesystem existence. This does not certify that every image depicts the correct product or that all offscreen lazy images render.
- Public image manifest: 774 records, zero remaining WhatsApp-origin records.
- Recovery archive: `C:/Users/Santi/Documents/Codex/2026-08-15/so/work/status-client-image-quarantine/`, including `excluded-records.json`. Files are recoverable and were not permanently deleted.

These are sampled browser checks plus source/build/regression checks, not a certification of every device, supplier specification, external link, WCAG conformance or production delivery service.

## Second pass: deeper troubleshooting and new functions

### Additional fixes

- Search now respects category, collection, subcategory and product-type filters instead of bypassing refinements.
- Switching kitchen ranges retains the current Browse by selection. Clearing its single chip retains the chosen range.
- Kitchen classification uses product names rather than whole-range descriptions, preventing sink/storage modules from becoming BBQs just because their descriptions mention grills. Parasol matching no longer treats any shade description as a parasol.
- Legacy Day Beds/Coffee Tables/Bar category links retain a product-type refinement instead of displaying their entire parent category.
- Disabled favourites no longer expose heart controls leading toward an unavailable feature; selected state is accessible when enabled in future.
- Image search now has a stable associated label, separate from its clear button.
- Fixed public image URLs containing encoded plus signs, ampersands and commas. This was an actual HTTP-serving failure despite files existing on disk. All 774 public URLs checked with HTTP HEAD now return successful image responses. A representative repaired image decoded in the browser at 1448 pixels wide. No photo contents were changed.

### New functions

- Collection dropdown on non-kitchen category pages where multiple collections exist.
- Share selection copies the current filtered URL, including category, range, Browse by, search, view and sort; if clipboard access is blocked, a selectable URL is shown instead. Nothing is sent externally.
- Image library loads 36 items initially, with Load more adding another 36. Filter changes reset the batch size.
- Image viewer supports previous/next buttons and left/right arrow keys within the filtered image set, alongside Escape dismissal. Controls have 44-pixel targets.
- Separate lean public image manifest removes local source paths, hashes and file-size metadata from the gallery bundle. Source provenance remains in the original local manifest. Run `npm run generate:image-library` after source-manifest changes; the source importer also invokes it.

### Performance and scope

The image-library bundle dropped from approximately 541 kB to 306 kB minified (about 43% smaller), with compressed size approximately 30 kB. The previous 500 kB chunk warning is gone. Original PNG photo optimisation remains outstanding; this change reduces metadata/DOM cost, not photograph download sizes. No field Core Web Vitals claim is made. Final second-pass checks: 19 test files and 79 tests pass; lint and production build pass.

Browser verification covered copied selection feedback, combined kitchen search/refinement, collection dropdown, range-preserving reset, 36-to-72 image batching, keyboard image browsing, and mobile collection/gallery layouts at 390 × 844 with no measured horizontal overflow. The local Vite server remains on port 5173. No push/deployment, enquiry submission, supplier-data invention or new backend access was performed. Outstanding backend, approved-inventory and content-verification requirements above still apply.
