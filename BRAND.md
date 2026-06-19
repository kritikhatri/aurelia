# Aurelia — Brand Identity Guidelines

Welcome to the brand identity guide for **Aurelia**, a premium, luxury-tier beauty e-commerce startup. 

---

## 1. Brand Concept & Naming
- **Brand Name**: Aurelia
- **Derivation**: From the Latin *aureus* (meaning "golden"). It conveys warmth, prestige, light, and timeless luxury.
- **Tagline**: *Elevate Your Essence. Infinite Beauty, Scientifically Curated.*
- **Brand Positioning**: High-performance botanical science meets couture aesthetic. Aurelia target consumers value clean formulations, sensory luxury, and personalized routine building.

---

## 2. Color Palette
The Aurelia color palette represents a striking contrast between deep, dramatic luxury and soft, clean purity.

| Color Role | Name | Hex Code | Visual Representation |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | Deep Plum | `#3B1824` | Rich, sensual, sophisticated depth |
| **Secondary Accent** | Champagne Gold | `#D4AF37` | Radiance, quality, premium detail |
| **Neutral Base (Light)** | Soft Ivory | `#FAF9F6` | Air, light, premium cream paper texture |
| **Neutral Base (Dark)** | Obsidian Black | `#121212` | Midnight, mystery, minimalist modern base |
| **Slate Gray** | Charcoal Slate | `#2B2B2B` | Borders, subtle text, and depth shading |

---

## 3. Typography
Aurelia pairs a stately editorial Serif with a high-readability modern Sans-Serif.

- **Display & Headings**: `Playfair Display` (Google Fonts)
  - *Weights*: SemiBold (600), Bold (700)
  - *Feel*: Editorial, confident, classic luxury.
- **Body & Controls**: `Inter` (Google Fonts)
  - *Weights*: Light (300), Regular (400), Medium (500), SemiBold (600)
  - *Feel*: Clean, highly readable, scientific, neutral.

---

## 4. Logo Concept & Wordmark
The logo features an elegant, high-contrast SVG wordmark that can be embedded dynamically in the header and footer:

```xml
<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="38" font-family="'Playfair Display', serif" font-size="32" font-weight="bold" fill="#3B1824" letter-spacing="1">AURELIA</text>
  <circle cx="175" cy="28" r="8" fill="none" stroke="#D4AF37" stroke-width="2"/>
  <circle cx="179" cy="24" r="3" fill="#3B1824"/>
</svg>
```

---

## 5. Copywriting Tone & Voice
- **Confident & Expert**: We back our claims with cosmetic science and clear ingredients disclosure.
- **Sensorial & Inviting**: We describe textures, aromas, and application feel in vivid, elegant detail.
- **Inclusive**: Skincare is personal. Our tone is warm, understanding, and tailored to all skin tones and concerns.

---

## 6. Iconography
We use thin, balanced line icons via `lucide-react` with a consistent `stroke-width` of `1.5` or `2` to maintain a spacious, refined luxury feel.
