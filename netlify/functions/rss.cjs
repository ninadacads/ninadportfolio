const FEEDS = require("../../src/data/rss-feeds.json");

const respond = (statusCode, body, contentType = "application/json; charset=utf-8") => ({
  statusCode,
  headers: {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
    "X-Content-Type-Options": "nosniff"
  },
  body
});

exports.handler = async event => {
  if (event.httpMethod !== "GET") return respond(405, JSON.stringify({ error: "Method not allowed" }));
  const sourceId = event.queryStringParameters?.source;
  const feed = FEEDS.find(item => item.id === sourceId);
  if (!feed) return respond(404, JSON.stringify({ error: "Unknown RSS source" }));

  try {
    const feedUrl = new URL(feed.feedUrl);
    if (feedUrl.protocol !== "https:") return respond(400, JSON.stringify({ error: "RSS sources must use HTTPS" }));
    const upstream = await fetch(feedUrl.href, {
      headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9", "User-Agent": "NinadPortfolioRSS/1.0 (+https://ninad4hire.netlify.app/)" },
      redirect: "error",
      signal: AbortSignal.timeout(12000)
    });
    if (!upstream.ok) return respond(502, JSON.stringify({ error: `Source returned ${upstream.status}` }));
    const maxBytes = 1_000_000;
    const declaredLength = Number(upstream.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return respond(502, JSON.stringify({ error: "RSS response exceeded the size limit" }));
    const reader = upstream.body.getReader();
    const chunks = [];
    let byteLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maxBytes) {
        await reader.cancel();
        return respond(502, JSON.stringify({ error: "RSS response exceeded the size limit" }));
      }
      chunks.push(Buffer.from(value));
    }
    const xml = Buffer.concat(chunks, byteLength).toString("utf8");
    if (!/<(?:rss|feed|rdf:RDF)\b/i.test(xml)) return respond(502, JSON.stringify({ error: "Source did not return a recognizable RSS or Atom document" }));
    return respond(200, xml, "application/xml; charset=utf-8");
  } catch (error) {
    console.error("RSS source fetch failed", feed.id, error?.name || "Error");
    return respond(502, JSON.stringify({ error: "RSS source is temporarily unavailable" }));
  }
};
