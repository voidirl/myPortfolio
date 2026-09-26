# Rishavdeep Singh — Portfolio

Static portfolio for **Rishavdeep Singh** — Full-Stack Developer & AI Integrator.
Single scrolling page: *hero → credentials → work → stack → experience → contact*.

> Live: https://v0idrsh.vercel.app

---

## Design branches

Every design iteration lives on its own branch so you can check out and compare them:

| Branch | Design | Description |
| --- | --- | --- |
| `main` / `master` | **recruiter-first** (current) | Type-driven single page, one indigo accent, dark + light themes, project cards, open-source credentials, print stylesheet. |
| `design-space` | galaxy fly-through | Canvas starfield, cinematic full-screen scenes, orbital toolbox. Dark-only. Superseded by the current design. |
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
- Fonts: Space Grotesk · Inter · JetBrains Mono
- Contact form: Formspree
- Social preview: `assets/og.png`, generated from `assets/og-source.svg`

## Structure

```
index.html          markup + JSON-LD Person schema + pre-paint theme script
style.css           design tokens (dark base, light override), layout, print rules
script.js           theme toggle · scroll reveals · contact form
assets/favicon.svg  monogram
assets/og.png       1200×630 social card (source: assets/og-source.svg)
resume.pdf
```

## Notes

- **Theming** — dark by default, light toggle, persisted to `localStorage`. A tiny blocking
  script in `<head>` applies the stored theme before first paint to avoid a flash. Follows
  `prefers-color-scheme` when nothing is stored.
- **Reveals** — sections fade in via `IntersectionObserver`, then unobserve. If the observer
  is unsupported or `prefers-reduced-motion: reduce` is set, everything renders immediately.
- **Print** — printing forces all reveals visible and drops the sticky header, so saving the
  page as a PDF does not produce blank sections.
- **Accessibility** — single `h1`, ordered headings, visible focus rings, body text ≥ 4.5:1 in
  both themes, no global keyboard hijacking (the space bar works normally in the textarea).
- **Verified** — layout, contrast, tap targets, anchor offsets, theme persistence and print
  output checked in headless Chromium at 1440 / 1024 / 860 / 720 / 640 / 480 / 390px in both
  themes.

## Content to check

One detail still differs between the site and `resume.pdf`:

| Item | Site says | `resume.pdf` says |
| --- | --- | --- |
| Location | Kathua, J&K | Jammu |

Kathua is a district within the Jammu division, so both are defensible — but pick one and
make them match.

The domain was previously wrong here too: the site and this README pointed at
`voidirl.vercel.app`, which returns **404**. The correct live URL is `v0idrsh.vercel.app`
(confirmed against the running deployment), and it is now used in the Open Graph tags,
Twitter tags and JSON-LD.

## Contact

- GitHub: [voidirl](https://github.com/voidirl)
- LinkedIn: [rshv11](https://linkedin.com/in/rshv11)
- Email: rishavrajput204@gmail.com
