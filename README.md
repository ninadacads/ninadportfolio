# Ninad Yadav — Broadcast & Live Operations portfolio

Static portfolio hosted at `https://ninad4hire.netlify.app/`.

## Video gallery

The homepage builds its gallery from event records in `src/data/events.json`. A video is embedded only when its event's `videoLinks` entry has `rightsStatus: "official-embed"` and contains a direct YouTube watch URL. The gallery deduplicates repeated video IDs and embeds from YouTube's privacy-enhanced domain; original video files remain with their publishers.

## RSS desk

- `/rss.html` is the dedicated RSS reading page.
- Edit `src/data/rss-feeds.json` to add, remove, or change publishers. Each source has a stable `id`, name, site URL, and HTTPS feed URL.
- `netlify/functions/rss.cjs` retrieves only configured source IDs, rejects unknown sources, applies a request timeout and 1 MB response limit, and uses Netlify caching headers.
- `netlify.toml` points Netlify at `netlify/functions`.

Because browsers generally block cross-origin RSS requests, the page reads each feed through the same-site Netlify function. It supports RSS and Atom XML; story titles, dates, and excerpts are rendered as text, and full articles open on their publishers' sites.

## Local preview

Serve the repository root over HTTP (not `file://`) to preview the static pages. For full RSS behavior, use `netlify dev` so the Netlify function route is available; a plain static server will render the page but cannot serve `/.netlify/functions/rss`.
