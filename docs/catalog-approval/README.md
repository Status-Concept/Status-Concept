# Catalogue approval workflow

`status-concept-catalog-approval.xlsx` is the content approval template for the new catalogue shape. It has one tab for `Products`, `Specifications`, `Dimensions`, `Materials` and `Images`, plus `Instructions`.

The workbook is intentionally a template: product facts must be checked against an official source before they are marked `approved`. The site currently keeps the existing catalogue visible while records are migrated; missing structured fields are not replaced with invented values.

The application-side validator lives in `src/data/catalogValidation.js` and is covered by `src/data/productTaxonomy.test.js`. Generated catalogue files remain generated and should be refreshed through the scripts in `scripts/`.
