# Qunke Website

Static English website for Qunke, a plastic recycling and extrusion machinery brand targeting overseas B2B buyers.

## Run Locally

```bash
npm run build
npm run dev
```

Open `http://localhost:4173`.

## Deploy To Cloudflare Pages

Use these settings:

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

## Deploy To GitHub Pages

This repository does not include a GitHub Actions workflow by default, so it can be pushed with a token that does not have the `workflow` scope. For GitHub Pages, either add a Pages workflow later with a token that includes `workflow`, or deploy the generated `dist` output through another static hosting workflow.

## Before Production

Replace these items in `src/site-data.js`:

- `site.url`
- `site.email`
- `site.whatsapp`
- company address
- product photos and videos
- verified product specifications
- real case studies
