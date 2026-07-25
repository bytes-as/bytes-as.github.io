---
name: Architectural Minimalist
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#0041c9'
  on-secondary: '#ffffff'
  secondary-container: '#0356ff'
  on-secondary-container: '#e4e7ff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b3'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.7'
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 24px
  architectural-line: 0.5px
---

## Brand & Style
The brand personality is intellectual, precise, and authoritative. It targets high-level technical recruiters and collaborators by emphasizing "code as craft." The design system adopts a **Minimalist-Brutalist** hybrid style, utilizing radical whitespace to create a gallery-like environment for software projects. 

The aesthetic is characterized by structural integrity, thin architectural lines, and a "blueprint" sensibility. It avoids all decorative softness in favor of sharp technical precision. Emotional response should be one of trust in the developer's mastery and attention to detail.

## Colors
The palette, "Eclipse & Bone," relies on high-contrast neutrals to establish a professional, editorial tone.

- **Primary (Eclipse):** #1A1A1A. Used for primary text, heavy structural blocks, and deep backgrounds in dark sections.
- **Background (Bone):** #F5F5F7. The primary canvas color, providing a soft, sophisticated alternative to pure white.
- **Signature Silver:** #E0E0E0. Used exclusively for 0.5px borders and structural grid lines to define layout zones without adding visual weight.
- **Logic Blue:** #0055FF. A high-chroma accent used sparingly for interactive states, text links, and critical technical indicators.

## Typography
This design system uses a deliberate typographic tension between the editorial elegance of **Playfair Display** and the industrial utility of **JetBrains Mono**.

- **Headlines:** Use Playfair Display for all major headings. It should feel like a high-end magazine masthead.
- **Technical Meta-data:** Use JetBrains Mono in All-Caps for labels, categories, and technical specs to evoke a "blueprint" feel.
- **Body Text:** Use Inter for long-form reading to ensure legibility and a modern, neutral balance to the expressive headlines.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy inspired by architectural drafting. 

- **The Grid:** A 12-column system on desktop with generous 64px external margins.
- **Structural Lines:** Use 0.5px "Signature Silver" lines to separate sections horizontally and vertically. These lines should extend to the edge of the viewport where possible to emphasize the grid.
- **Whitespace:** Use "Radical Whitespace"—doubling standard padding (e.g., 128px or 160px between major sections) to allow the technical content to breathe.
- **Responsive:** On mobile, collapse to a single column but maintain the 0.5px hairline dividers to keep the structural feel.

## Elevation & Depth
This design system rejects shadows and blurs. Depth is achieved through **Tonal Layering** and **Line Work**.

- **Flat Hierarchy:** All elements exist on the same optical plane. 
- **Grain Texture:** Apply a very subtle (1-2% opacity) film grain or noise overlay across the entire UI to give the "Bone" background a tactile, paper-like quality.
- **Inversion:** High-priority sections (like a 'Contact' or 'Featured' area) should use a full-bleed "Eclipse" (#1A1A1A) background with "Bone" text to create a dramatic visual "punch" without using elevation.

## Shapes
The shape language is strictly **Sharp (0px)**. 

Every element—including buttons, input fields, cards, and image containers—must have 90-degree corners. This reinforces the architectural and technical rigor of the design. No exceptions for "softness" are permitted.

## Components
- **Buttons:** Sharp 0.5px borders. Default state is "Bone" background with "Eclipse" text. Hover state is a solid fill of "Logic Blue" with "Bone" text. Use JetBrains Mono for button labels in All-Caps.
- **Inputs:** Simple bottom-border only (0.5px Signature Silver). Label sits above the line in JetBrains Mono 12px. The border turns "Logic Blue" on focus.
- **Cards:** Defined by 0.5px hairlines rather than shadows or background changes. Content inside cards should follow strict internal padding of 32px.
- **Technical Chips:** Rectangular boxes with 0.5px borders and JetBrains Mono text. No background fill unless active.
- **Navigation:** Minimalist text-only links. Use a "Logic Blue" dot (4px) to indicate the active page or section.
- **Project Grid:** Images should have a subtle grayscale filter by default, snapping to full color only on hover to maintain the palette's integrity.