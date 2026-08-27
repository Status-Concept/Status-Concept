# Product catalogue audit

The product browsing experience now uses one normalized category vocabulary:

- Lounge: Upholstered, Rope, Aluminium
- Dining
- Sun Loungers & Day Beds
- Shade Solutions: Pergolas, Parasols, Awnings
- Outdoor Kitchens: Modular kitchens, Built-in kitchens, Attachments & accessories, BBQs

The current catalogue data is generated from source datasets and contains product-specific specifications, materials, and dimensions. Those values should not be rewritten from inference. Before publishing a final catalogue, the business team should verify every product against the latest manufacturer source or supplier sheet.

## Required verification fields

For each product, confirm:

- Product name and collection
- Category and subcategory
- Description and product type
- Materials and finishes
- Dimensions and units
- Available configurations or sizes
- Image/product match
- Manufacturer and technical documentation

## Known implementation behavior

- Missing imagery falls back to the existing showroom placeholder.
- Existing product specifications are displayed as provided by the source data.
- Search and subcategory filters search across product names, collections, descriptions, materials, and specifications.
- No specifications have been invented or silently changed as part of the redesign.

The next content pass should attach a verified source reference to each product record, then normalize any remaining unit, spelling, or material inconsistencies in the generated data pipeline.
