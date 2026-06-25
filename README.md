# Qunke Website

Static English website for Qunke, a focused RFQ and supplier matching platform for overseas buyers sourcing PP woven bag, sack, tape extrusion, circular loom, laminating, printing and bag conversion machinery from China.

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

## Deploy To Cloudflare Workers Static Assets

This repository also includes `wrangler.toml`, so Cloudflare can deploy it with:

```bash
npx wrangler deploy
```

Wrangler will run `npm run build` and upload the generated `dist` directory.

## Deploy To GitHub Pages

This repository does not include a GitHub Actions workflow by default, so it can be pushed with a token that does not have the `workflow` scope. For GitHub Pages, either add a Pages workflow later with a token that includes `workflow`, or deploy the generated `dist` output through another static hosting workflow.

## Before Production

Replace these items in `src/site-data.js`:

- `site.url`
- `site.email`
- `site.whatsapp`
- company address
- supplier onboarding rules
- RFQ privacy and buyer consent text
- real machine videos and supplier categories
- valid lead pricing or supplier cooperation terms
