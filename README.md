# Common Ground — nonprofit website concept

An independent, fictional nonprofit concept by [Ebin Johnson](https://ebinjohnson.ca/).

**Live demo:** https://ebinjohnson-web.github.io/common-ground-nonprofit-demo/

An image-heavy community nonprofit website in forest green, cream, lime, and terracotta. Six locally hosted documentary photographs support a story about food access, community gardens, and neighbour support.

## Experience

- Crossfading cinematic hero, slow photo movement, rotating badges, continuous moving typography, floating photo prints, scroll reveals, and hover transitions.
- Program detail dialogs, a keyboard-accessible photo story rail, volunteer role preview, and an interactive giving preview with preset/custom amounts and monthly/one-time choices.
- Responsive navigation and layouts, visible keyboard focus, dialog focus return, system reduced-motion support, and a persistent pause/play control.
- All organisation content is illustrative. No donation, signup, or personal information is transmitted or stored. Session storage contains only the motion preference.

## Run locally

Node.js 18 or later; no packages or build step required.

```sh
npm run dev
npm run check
```

Open http://127.0.0.1:4174/common-ground-nonprofit-demo/.

## Publish

GitHub Pages serves `docs/` from `main`. Keep relative asset paths so the project works under its repository URL. Google Fonts is the only external presentation dependency; system fonts provide a fallback. Photographs are served directly from this repository.

Photography sources, authors, and licensing are in [PHOTO-CREDITS.md](PHOTO-CREDITS.md) and linked from the website footer.
