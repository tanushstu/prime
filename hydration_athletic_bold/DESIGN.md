---
name: Hydration Athletic Bold
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#bb0022'
  on-secondary: '#ffffff'
  secondary-container: '#e9002d'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2d'
  on-tertiary-container: '#008dc2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3af'
  on-secondary-fixed: '#410005'
  on-secondary-fixed-variant: '#930018'
  tertiary-fixed: '#c6e7ff'
  tertiary-fixed-dim: '#82cfff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6b'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 110px
    letterSpacing: 0.05em
  display-lg:
    fontFamily: Anton
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  title-md:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  label-bold:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
spacing:
  margin-desktop: 64px
  margin-mobile: 20px
  gutter: 24px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to embody peak athletic performance and premium lifestyle energy. It is defined by a high-intensity aesthetic that pairs stark, high-contrast layouts with vibrant, neon-adjacent color accents. 

Drawing from **Modern Minimalism** and **Bold / High-Contrast** movements, the UI prioritizes clarity and impact. The visual narrative focuses on "Heroic Proportions"—massive typography, generous negative space to let product imagery breathe, and sharp, aggressive edges that suggest precision and speed. The goal is to evoke a sense of urgency, hydration, and elite status.

## Colors

The palette is built on a foundation of absolute high-contrast: Pure White (#FFFFFF) and Deep Black (#000000). This creates a "stadium lighting" effect where content feels bright and focused.

Accents are derived from product flavors:
- **Primary Black:** Used for critical branding, heavy typography, and primary call-to-action backgrounds.
- **Vibrant Red & Electric Blue:** Reserved for secondary accents, status indicators, and flavor-specific thematic sections.
- **Surface Neutrals:** Extremely subtle greys (#F2F2F2) may be used for background depth, but pure white is the preferred canvas for the "clean" premium feel.

## Typography

Typography is the core architectural element of the design system. We use **Anton** for headlines to provide a massive, condensed verticality that feels powerful and authoritative. For body and metadata, **Archivo Narrow** maintains that efficient, industrial aesthetic while ensuring high legibility in data-heavy contexts.

Key rules:
- **All-Caps Execution:** Most headlines and labels should be set in uppercase to reinforce the athletic, commanding tone.
- **Exaggerated Scale:** Don't be afraid to use `display-xl` to break the grid or serve as a background texture.
- **Letter Spacing:** Increase letter-spacing slightly for wide display headers to add a premium, airy feel.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with wide margins to create a high-end editorial feel. 

- **Desktop (1440px+):** 12-column grid with 64px outer margins. Use large vertical gaps (120px+) between sections to maintain a "premium gallery" atmosphere.
- **Mobile:** 4-column grid with 20px margins. Headlines should scale aggressively to ensure they remain impactful on small screens.
- **Rhythm:** Use a strict 8px base grid for internal component padding, but favor "loose" spacing for layout containers to avoid a cluttered "discount" look.

## Elevation & Depth

To maintain the clean, athletic look, this system rejects traditional shadows. Depth is achieved through:

- **High-Contrast Layering:** Dark elements placed directly on light surfaces.
- **Hard Borders:** Use 1px or 2px solid black borders to define containers without using blurs.
- **Flat Surfaces:** Components should feel like they are printed onto the screen. 
- **Z-Index Overlaps:** Use product images that "break" the container boundaries or overlap typography to create a 3D parallax effect without relying on drop shadows.

## Shapes

The shape language is **Sharp (0)**. 

To communicate strength and structural integrity, all buttons, input fields, and containers utilize 90-degree corners. The only exception is the product itself (bottles). This contrast between the organic, rounded forms of the hydration bottles and the rigid, geometric UI frame makes the product stand out as the hero of the composition.

## Components

### Buttons
Primary buttons are solid black rectangles with white all-caps text. Secondary buttons utilize a "Ghost" style: 1px black border, no fill, and black text. Hover states should invert the colors instantly (no slow transitions) to mimic athletic responsiveness.

### Cards
Cards should be borderless with a white background, using typography and high-quality product photography to define the space. Use a subtle grey (#F2F2F2) hover state or a thin black border to indicate interactivity.

### Input Fields
Inputs are simple bottom-borders or full rectangles with sharp corners. Labels must be `label-bold` and positioned above the field.

### Chips/Badges
Small, rectangular badges with solid color fills (Red, Blue, or Black) and white text. These are used for "New," "Limited Edition," or "Zero Sugar" markers.

### Navigation
The header should be minimal and transparent, utilizing the bold logo as the central anchor. Links are all-caps `label-bold` with high tracking.