## Worship Viewer Landing

Static Next.js (App Router) landing page for Worship Viewer. It includes a hero section, ShadCN UI cards, a login CTA (linking to `https://app.worshipviewer.com`), and placeholder pages for Imprint (Impressum), Privacy Policy (Datenschutzerklärung), and Terms & Conditions (AGB) that you can fill in later.

## Local development

```bash
corepack enable
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to preview the site. Update content in `src/app/page.tsx` or the legal pages under `src/app/*/page.tsx`.

## Static export

The project is configured with `output: "export"`, so `next build` emits static HTML into `out/`.

```bash
pnpm build:static
# resulting static assets live in ./out
```

You can deploy the contents of `out/` alongside your main application on any static host (Vercel, S3, static nginx, etc.). Use `pnpm dlx serve out` locally if you want a quick static preview.

## Docker

The repository includes a multi-stage `Dockerfile` that builds the static export and serves it with `nginx:alpine`.

CI publishes the image to GitHub Container Registry on pushes to `main` (`:main`) and on git tags (`:<tag>` and `:latest`):

```bash
docker pull ghcr.io/xilefmusics/worshipviewer-landing:main
docker run --rm -p 3000:80 ghcr.io/xilefmusics/worshipviewer-landing:main
```

To build locally instead:

```bash
docker build -t worship-viewer-landing .
docker run --rm -p 3000:80 worship-viewer-landing
```

Visit [http://localhost:3000](http://localhost:3000) to verify the container. Adjust the image tag/port mapping as needed for deployment.
