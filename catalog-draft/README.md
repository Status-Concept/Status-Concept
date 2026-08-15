# Status Concept private catalogue draft

This directory contains the versioned tooling and schemas for a local, private
catalogue draft. It is deliberately separate from the public demo catalogue.

The source workbook, inventory rows, stock, selection photographs, research
images and generated draft data live in .catalog-private/, which is ignored by
Git and must not be copied into public/, src/assets/ or a production bundle.

## Workflow

1. Run the read-only Excel extractor with the original .XLS path.
2. Build the private photograph manifest.
3. Create the selection review matrix.
4. Have a human reviewer decide every visible row. Ambiguous marks remain
   needs_review; unseen rows remain unreviewed.
5. Validate the selection, grouping and draft records.
6. Use the DEV-only preview at #/__dev/catalog-draft.
7. Run the approval workbook builder and review the private workbook.

The initial review matrix is intentionally conservative. It does not infer
candidate or excluded products from stock, OCR, circles or unclear handwriting.
No draft product is generated until a row has an explicit reviewed selection and
an approved grouping.

## Commands

From the repository root:

    powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\catalog-draft\extract-inventory.ps1 -InputPath "C:\path\inventory.XLS"
    node .\scripts\catalog-draft\build-photo-manifest.mjs -InputDir "C:\path\photos"
    node .\scripts\catalog-draft\create-selection-review.mjs
    node .\scripts\catalog-draft\validate-selection.mjs
    node .\scripts\catalog-draft\group-products.mjs
    node .\scripts\catalog-draft\build-draft-products.mjs
    node .\scripts\catalog-draft\validate-drafts.mjs
    node .\scripts\catalog-draft\research-report.mjs

The public catalogue remains based on src/data/demoProducts.js. Publication
is intentionally not part of this workflow and requires a separate approved
task.
