# Project-page style notions

Reference page: `epo/index.html` + `epo/static/css/index.css`. New project pages copy this template; existing ones (e.g. `sandesc/`) are refactored toward it.

## Design tokens (`:root` in `static/css/index.css`)

- **Accent**: `--primary-color: #b45309` (warm amber/brown), `--primary-hover: #92400e`.
- **Text**: `--text-primary: #1c1917`, `--text-secondary: #57534e`, `--text-light: #78716c`.
- **Surfaces**: `--background-primary: #fff`, `--background-secondary: #fafaf9`, `--background-accent: #f5f5f4`, `--border-color: #e7e5e4`.
- **Radii**: `--border-radius: 12px`, `--border-radius-lg: 16px`. Shadows `--shadow-sm/md/lg/xl`.
- **Motion**: `--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.

## Typography

- Headings: `Cormorant Garamond` 500, slight negative letter-spacing.
- Body / authors / UI: `Inter` 500–700.
- `.title.is-3` is always followed by a 60×3px amber accent bar via `::after`.

## Page anatomy

1. `section.hero` — title (`.publication-title`), `.publication-authors` (each name `<a>` with hover underline), affiliation line, then a horizontal row of `.pub-icon-link` icons.
2. `section.hero.teaser.is-small` — optional teaser figure (a single `.figure` inside a `.figure-stack`).
3. `section.section.hero.is-light` — Abstract (`<h2 class="title is-3">` + justified prose).
4. Result/method sections — `section.hero.is-small` with a `<h2 class="title is-3 has-text-centered">` plus a short blurb in `.content.has-text-justified` (`max-width: 860px; margin: 0 auto 1.5rem`), then figures/charts/tables.
5. `section.section#BibTeX` — `.bibtex-header` with title + copy button, `<pre><code>` block.
6. `footer.footer` — single centered line, `is-size-7`, `--text-light`.

## Reusable components

### Hero publication links — `.pub-icon-link`
EPO replaces the older `button is-rounded is-dark` bar with vertical icon stacks:
```
<a href="..." class="pub-icon-link" title="Paper">
  <span class="pub-icon-circle"><i class="fas fa-file-pdf"></i></span>
  <span class="pub-icon-label">Paper</span>
</a>
```
48px dark circles, amber on hover with a 3px lift. Use Font Awesome (`fas`/`fab`) or Academicons (`ai ai-arxiv`).

### Figure cards
- `.figure-stack` — single column, gap 2rem, max-width 960px. Default for one item or a vertical run.
- `.figure-row` — auto-stacked on mobile, 2-up on desktop ≥769px. EPO's version sets `align-items: stretch` and forces children to flex so paired figures end up the same height; pull this fix forward into any page using two side-by-side figures.
- Inside, each `<figure class="figure">` has white background, `--border-radius-lg`, soft `--shadow-sm`, 1.5rem padding, centered `<figcaption>` in `--text-secondary`.

### Chart grids — `.chart-grid-2` / `.chart-grid-3`
Single column on mobile; `1fr 1fr` (gap 2.5rem) and `repeat(3, minmax(0,1fr))` (gap 1.75rem) above 769px. Used to host `<canvas>` elements for Chart.js bar/line charts. Chart.js itself is loaded as a deferred `<script src="static/js/chart.umd.min.js">` block at the bottom of the page; one factory per `<canvas id>` wrapped in an `IntersectionObserver` so each chart instantiates only when scrolled into view.

### Numeric results — `.results-table`
Bulma table with extras applied via the `results-table` class:
```
<table class="table is-bordered is-narrow is-hoverable results-table">
```
The class auto-right-aligns every non-first cell and enables `font-variant-numeric: tabular-nums`. Header cells that should be right-aligned carry `class="has-text-right"`. Wrap in `<div class="table-container">` inside a `<div class="content" style="max-width: 620px; margin: 1.75rem auto 0;">`. Use `<b>` for best score, `<i>` for the GT/reference row, an `is-size-7` centered caption below.

### BibTeX block
- `.bibtex-header` flexes title + `.copy-bibtex-btn` (amber button, swaps to green on `.copied`, `copy-text::after` injects "ied!").
- `<pre>` uses `--background-accent`, 12px radius, soft shadow.

## Tables and charts: when to use which

- **Chart.js bar chart** — primary medium when the source artefact in the paper was a chart, or whenever the comparison is across discrete categories with ≤10 series. Defer instantiation with an `IntersectionObserver` (threshold ~0.15) so the canvas only renders when scrolled into view; set `responsive: true, maintainAspectRatio: true` and pick `aspectRatio` per chart density (~1.6 for sparse, ~2.6 for dense like the SANDesc IMC chart). For paired comparisons (e.g. `Method` vs. `Method + Ours`), color each pair with a shared hue (light = original, saturated = +Ours).
- **HTML `.results-table`** — when the table itself is the primary artefact (a numeric supplement under a chart, or many columns × many rows). EPO's NVS section is the canonical example.
- **Never** ship a screenshot/matplotlib export of a chart or table as `<img>`. Render in Chart.js or HTML.

## Asset rules (reaffirms `CLAUDE.md`)

- Figures: `sips -Z 760` before committing.
- Paper PDF: `gs -dPDFSETTINGS=/ebook`.
- GIF teasers: ffmpeg palettegen/paletteuse + `gifsicle -O3 --lossy=600 --colors 24`; gate playback with an `IntersectionObserver` to restart from frame 0 on re-entry (see `epo/index.html` bottom script).
- Source artefacts (`*_latex/`, `figs/`, `gifs/`, raw PDFs) stay in-repo but **gitignored**; only downscaled / compressed copies under `static/` are served.