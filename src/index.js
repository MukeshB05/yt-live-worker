// Cloudflare Worker: YouTube live/video player page
// Usage: https://<name>.<account>.workers.dev/?video_id=g4n1ecRt_AQ
// Also works with: /live?video_id=...  or  /web/yt-restream/live.php?video_id=...

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Accept either a raw ID or a full YouTube URL in video_id
    let raw = url.searchParams.get("video_id") || url.searchParams.get("v") || "";
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
    const id = m ? m[1] : raw.replace(/[^A-Za-z0-9_-]/g, "");

    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
      return new Response(
        "Missing or invalid video_id.\nExample: ?video_id=g4n1ecRt_AQ",
        { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    const muted = url.searchParams.get("mute") === "0" ? 0 : 1; // autoplay needs mute in most browsers
    const src =
      `https://www.youtube.com/embed/${id}` +
      `?autoplay=1&mute=${muted}&playsinline=1&rel=0&modestbranding=1`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Live</title>
<style>
  html,body{margin:0;height:100%;background:#000}
  iframe{position:fixed;inset:0;width:100%;height:100%;border:0}
</style>
</head>
<body>
<iframe src="${src}"
  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
  allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
