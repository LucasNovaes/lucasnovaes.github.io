# lucasnovaes.github.io

Personal site — a digital business card, hosted on GitHub Pages.

Static by design: no build step, no bundler. GitHub Pages serves the files as-is.

- `index.html` — the page
- `css/style.css` — theme and layout
- `js/main.js` — card tilt, scroll reveal, copy-to-clipboard
- `js/scene.js` — Three.js network-sphere background (loaded from CDN, degrades gracefully if unavailable)

## Local preview

```
python3 -m http.server 4173
```

Then open <http://localhost:4173>. The ES modules need a server — opening `index.html` via `file://` will not work.
