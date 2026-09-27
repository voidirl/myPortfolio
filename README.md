# Rishavdeep Singh — Portfolio

Static portfolio for **Rishavdeep Singh** — Full-Stack Developer & AI Integrator.
A dark, cinematic single page built as a *space deck*: six full-height scenes you fly
through, with a live starfield and orbital diagrams behind the content.

> Live: https://v0idrsh.vercel.app

---

## Design branches

Every design iteration lives on its own branch so you can check out and compare them:

| Branch | Design | Description |
| --- | --- | --- |
| `main` | **space-deck** (current) | Dark-only starfield, six snap scenes (launch → identity → stack → journey → missions → transmit), rail navigation, orbital stack diagram, print stylesheet. |
| `design-v4-ray` | recruiter-first | Archived: type-driven single page, indigo accent, light + dark themes, project cards, ray-canvas pass. |
| `design-space` | galaxy fly-through | Original branch of the current design; `main` carries it forward plus the layout/accessibility fixes. |
| `design-terminal` | terminal hybrid | Single scrolling page: mono terminal motifs, aurora glass cards, neo-brutalist accents. Light/dark toggle. |
| `design-gold-anime` | gold & anime | Gold/cream theme with a hand-drawn SVG anime protagonist and typing effect. Light/dark toggle. |
| `demo` | legacy deploy | Earlier deploy line (pre-anime gold). |

## Run locally

```bash
git clone <this repo> && cd Portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

No build step, no dependencies. Opening `index.html` directly from the filesystem also
works — the résumé link is relative.

## Stack

- HTML · CSS · Vanilla JavaScript (zero libraries, zero build)
- Canvas 2D starfield with pointer parallax and a depth-of-field blur pass
- Fonts: Space Grotesk · Inter · JetBrains Mono
- Contact form: Formspree (`https://formspree.io/f/mgopaawp`)
- Social preview: `assets/og.png`, generated from `assets/og-source.svg`

## Structure

```
index.html           six scenes + site map overlay + JSON-LD Person schema
style.css            design tokens (dark only), scene layout, rail, print rules
script.js            starfield canvas · scene controller · rail + map · form
icons8-anime-48.png  browser tab icon (pink girl, 48×48)
assets/favicon.svg   monogram, kept for reference
assets/apple-touch-icon.png   180×180 home-screen icon, upscaled from the same art
assets/og.png        1200×630 social card (source: assets/og-source.svg)
resume.pdf
```

Scenes: `#scene-launch` · `#scene-identity` · `#scene-stack` · `#scene-journey` ·
`#scene-missions` · `#scene-transmit`, plus `#map` for the site-map overlay.

## Notes

- **Navigation** — right-hand rail dots jump between scenes; the launch screen has quick
  jump chips (`who i am` / `stack` / `see the work` / `contact` / `résumé`). Keyboard:
  `↓` `→` `PageDown` `Space` forward, `↑` `←` `PageUp` back, `Home` / `End` to jump to
  either end. Keys are ignored while you are typing in the contact form or focused on a
  button or link, so the space bar still scrolls from a link and still activates a
  focused control.
- **Site map** — opened with the nav button, closed with `Escape`. There is deliberately
  no single-key shortcut for it any more, so it can never shadow a key a visitor expects
  to type.
- **Scenes** — each scene is at least one viewport tall and grows with its content, so the
  four project cards are never clipped. The launch block is vertically centred in the
  viewport, and the project grid uses the original three-up basis (382px cards at 1440px,
  two-up at 720px, one-up on phones). Scroll snapping is `proximity` on wide screens and
  off below 720px, where the page becomes a normal single column.
- **Reveals** — an `IntersectionObserver` watches the middle band of the viewport and
  reveals scenes as they arrive; already-visited scenes stay revealed, so scrolling back
  never shows a blank slide. With JavaScript blocked, `html:not(.js)` renders everything
  visible. `prefers-reduced-motion: reduce` drops the canvas and reveals all content
  immediately.
- **Print** — printing (or "Save as PDF") forces every scene visible, collapses the scenes
  to their content height with a page break between them, and drops the canvas, rail, map
  and nav in favour of ink-on-paper colours.
- **Accessibility** — single `h1`, ordered headings, visible focus rings, 24px minimum
  targets, `aria-label`s on the icon buttons, no global keyboard hijacking, and a visible
  text alternative to the custom cursor (which is removed on coarse pointers).
- **Verified** — checked in headless Chromium at 1440, 1280, 1024, 860, 720, 640, 480 and
  390px, plus a 1280×600 laptop (the case that used to clip the 4th project), with
  `script.js` blocked, with `prefers-reduced-motion: reduce`, and in print emulation.

## Content notes

The location is **Jammu, J&K** everywhere: the identity scene, the JSON-LD
`addressLocality`, and `resume.pdf` all agree.

The domain was previously wrong here too: the site and this README pointed at
`voidirl.vercel.app`, which returns **404**. The correct live URL is `v0idrsh.vercel.app`
(confirmed against the running deployment), and it is now used in the Open Graph tags,
Twitter tags and JSON-LD.

The transmit scene links to email, GitHub and LinkedIn only. The JSON-LD `sameAs` list also
carries the LeetCode and Codeforces profiles; add them as visible links if you want them
public.

## Contact

- GitHub: [voidirl](https://github.com/voidirl)
- LinkedIn: [rshv11](https://linkedin.com/in/rshv11)
- Email: rishavrajput204@gmail.com
