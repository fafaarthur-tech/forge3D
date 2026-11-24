**English** · [Português](README.pt-BR.md)

# forge3D

Online store and quote tool for a custom 3D printing business in Goiânia, Brazil, that I am building with friends. The business is in development and has not launched yet. The site is a static site in plain HTML, CSS and JavaScript: no framework, no server and no build step.

## What it does

- **Catalog and cart.** Ready-made pieces by category, with a slide-out cart where customers change quantities.
- **3D configurator.** The customer chooses size, material (PLA, Silk, PETG Pro or 8K resin), color and detail level, watches a Three.js model rotate, and gets a price estimate. The estimate comes from filament weight, machine hours and a margin set in `data/config.js`.
- **WhatsApp checkout.** "Finish order" turns the cart into a structured WhatsApp message (items, materials, subtotal), so the owner needs no backend or paid dashboard to receive orders.
- **Scroll story.** A scroll-driven scene shows how a part is printed, from digital model to slicing, printing, finishing and delivery.

## Built with

HTML5, CSS3 and vanilla JavaScript, Three.js (r128), GSAP with ScrollTrigger, and Lenis for smooth scrolling. About 4,000 lines of code.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The libraries and fonts load from CDNs, so an internet connection is needed.

## Edit the content

| What | Where |
|---|---|
| WhatsApp number, price per gram and per hour, margin, sizes | `data/config.js` |
| Product catalog (name, category, color, base price) | `data/produtos.js` |
| Data for the ideas list and the credits | `data/ideias.js`, `data/creditos.js` |
| Colors and layout | `assets/css/style.css` |

`ADMIN.md` explains how the owner receives and handles orders (in Portuguese).

## Publish

It is a static site, so GitHub Pages works: Settings → Pages → branch `main`, folder `/ (root)`.
