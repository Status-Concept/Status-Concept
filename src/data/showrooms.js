// Canonical showroom & contact data — single source of truth.
// NOTE: the two showrooms are also mirrored in index.html's JSON-LD; update
// both when addresses, phones or hours change. Per-page marketing descriptions
// stay inline in each page (they differ by page and are translated copy).

export const CONTACT = {
  phone: "+351 289 030 179",
  phoneHref: "tel:+351289030179",
  email: "info@statusconcept.com",
  emailHref: "mailto:info@statusconcept.com",
  whatsapp: "351937573600",
};

const mapsUrl = (query) =>
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(query);

export const SHOWROOMS = [
  {
    key: "quinta-do-lago",
    name: "Quinta do Lago",
    address: "Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil",
    phone: "+351 289 030 179",
    maps: mapsUrl("Status Concept, Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil"),
  },
  {
    key: "almancil",
    name: "Almancil",
    address: "Avenida 5 de Outubro 298, 8135-103 Almancil",
    phone: "+351 289 092 890",
    maps: mapsUrl("Status Concept, Avenida 5 de Outubro 298, 8135-103 Almancil"),
  },
];

export const HOURS = [
  { label: "Mon – Sat", value: "09:30 – 18:00" },
  { label: "Sunday", value: "Closed" },
];
