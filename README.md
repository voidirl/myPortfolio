# void://rsh — Portfolio

Interactive **space-deck** portfolio for **Rishavdeep Singh** — Full-Stack Developer &
AI Integrator. Scroll (or use `↑`/`↓`, `Space`, `M` for the scene map) to fly through
galaxy scenes: *identity → stack → journey → missions → transmit*.

> Live: https://voidirl.vercel.app

---

## Design branches

Every design iteration lives on its own branch so you can check out and compare them:

| Branch | Design | Description |
| --- | --- | --- |
| `main` / `master` | **void://space** (current) | Galaxy fly-through: vanilla canvas starfield, cinematic full-screen scenes, orbital toolbox, mission cards, contact form. Dark-only. |
| `design-terminal` | terminal hybrid | Single scrolling page: mono terminal motifs, aurora glass cards, neo-brutalist accents. Light/dark toggle. |
| `design-gold-anime` | gold & anime (original) | Gold/cream theme with a hand-drawn SVG anime protagonist and typing effect. Light/dark toggle. |
| `demo` | legacy deploy | Earlier deploy line (pre-anime gold). |

## Run locally

```bash
# current design
git checkout main
open index.html

# or view an archived design
git checkout design-gold-anime
open index.html
```

No build step. No dependencies — the starfield is hand-rolled canvas 2D.

## Stack

- HTML · CSS · Vanilla JavaScript (zero libraries)
- Fonts: Space Grotesk · Inter · JetBrains Mono
- Contact form: Formspree

## Notes

- Reduced-motion aware: `prefers-reduced-motion` switches to a static sky and disables animations.
- Touch support: rail + map are hidden on small screens, scenes stack naturally.
- SEO: content lives in real DOM scenes, meta + Open Graph tags included.

## Contact

- GitHub: [voidirl](https://github.com/voidirl)
- LinkedIn: [rshv11](https://linkedin.com/in/rshv11)
- Email: rishavrajput204@gmail.com