# STATVS Design System

## Direction

STATVS uses a restrained, light visual system inspired by a quiet Algarve
showroom in daylight: warm white surfaces, charcoal type, natural bronze
details and large, truthful imagery. The design should feel calm and precise,
never ornamental for its own sake.

## Color

| Role | Token | Value |
| --- | --- | --- |
| Main surface | `--white` | `#ffffff` |
| Warm surface | `--off-white` | `#f8f7f4` |
| Quiet section | `--light-grey` | `#f1efea` |
| Divider | `--mid-grey` | `#e3e0d9` |
| Secondary text | `--text-grey` | `#756f63` |
| Body text | `--text-body` | `#3d3b35` |
| Primary text | `--text-dark` | `#1c1b18` |
| Bronze accent | `--accent` | `#82704f` |
| Accent hover | `--accent-hover` | `#6f5e44` |
| Dark surface | `--black` | `#1a1815` |

Bronze is an accent, not a background theme. Use it for the STATVS A,
short labels, selected states and high-value details.

## Typography

- Interface and display: Outfit
- Brand wordmark only: Cormorant Garamond
- Body copy: 14 to 16 pixels with generous line height
- Page titles: fluid `clamp()` scale, usually 38 to 60 pixels
- Short labels: 10 to 12 pixels, uppercase, with generous tracking
- Body line length: no more than 70 characters

The wordmark treatment is fixed: `STATVS` with the A in bronze and
`OUTDOOR FURNITURE SPECIALISTS` below it.

## Layout

- Content width: `--max-width: 1240px`
- Wide imagery: up to `--max-width-wide: 1800px`
- Section rhythm: `--section-padding: clamp(60px, 10vw, 120px)`
- Desktop horizontal padding: 48 pixels
- Mobile horizontal padding: 20 to 24 pixels
- Corners remain precise: 0 to 3 pixels for normal surfaces
- Cards are used only for products, projects and clearly repeated items

Pages should alternate image-led and text-led sections. Avoid repeated boxed
sections and avoid placing cards inside cards.

## Components

### Header

Fixed light header with direct contact details, social links, the wordmark,
primary public navigation and language selection. Account entry points are
reserved for Phase 3.

### Buttons

Primary actions use the dark surface with light text. Secondary actions use a
thin neutral border on a transparent background. Buttons are at least 44 pixels
high and use concise action copy.

### Imagery

Use real STATVS products, showrooms and installed settings whenever available.
Hero images are wide and decisive. Product imagery should be consistent in
angle, background and crop. Until approved photography exists, use the shared
showroom placeholder rather than mixed temporary images.

### Product Cards

Media first, followed by category and product name. No prices are shown unless
the commercial policy changes. Favourites are reserved for Phase 3.

### Forms

Every field has a persistent visible label linked to its control. Required,
error, loading and success states must be explicit. Enquiry submission becomes
public only after delivery is verified end to end.

## Motion

Use `--ease-out-expo` for interface transitions. Motion should support
orientation and image changes, not decorate static content. Respect
`prefers-reduced-motion` and avoid animating layout dimensions.

## Responsive Rules

- Desktop navigation changes to the menu button at the established breakpoint
- All content must fit without horizontal scrolling
- Product grids reduce columns without shrinking text below readable sizes
- Interactive controls remain at least 44 by 44 pixels on touch screens
- Long headings wrap naturally and never overlap adjacent content

## Phase 1 Boundary

The Phase 1 preview includes the brand system, responsive shell, homepage
direction and representative public-page treatments. Accounts, favourites,
newsletter capture, CMS controls and unfinished placeholder destinations are
kept out of the visible navigation until their own phases are complete.
