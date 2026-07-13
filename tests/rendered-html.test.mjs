import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the festival explorer", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /<title>Festyle \| 日本音樂祭探索工具<\/title>/i);
  assert.match(html, /日本音樂祭探索工具/);
  assert.match(html, /京都大作戦/);
  assert.match(html, /NUMBER SHOT2026/);
  assert.match(html, /FUJI ROCK FESTIVAL &#x27;26/);
  assert.match(html, /RISING SUN ROCK FESTIVAL 2026 in EZO/);
  assert.match(html, /SUMMER SONIC 2026/);
  assert.match(html, /福岡/);
  assert.match(html, /PayPay Dome/);
  assert.match(html, /苗場スキー場/);
  assert.match(html, /石狩湾新港/);
  assert.match(html, /ZOZOマリンスタジアム/);
  assert.match(html, /出演者清單/);
  assert.match(html, /10-FEET/);
  assert.match(html, /未來參加音樂祭/);
  assert.match(html, /琵琶湖騎腳踏車/);
  assert.match(html, /食衣住行樂/);
});

test("removes starter preview wiring", async () => {
  const [page, layout, packageJson, css, data] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<FestivalExplorer \/>/);
  assert.match(layout, /title:\s*"Festyle \| 日本音樂祭探索工具"/);
  assert.match(css, /\.regional-map/);
  assert.match(css, /\.travel-item-links/);
  assert.match(data, /官方道案內/);
  assert.match(data, /唐人町駅/);
  assert.match(data, /越後湯沢駅/);
  assert.match(data, /麻生駅/);
  assert.match(data, /海浜幕張駅/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|themeColor|\bViewport\b/);

  await assert.rejects(
    access(new URL("public/_sites-preview", templateRoot)),
  );
});
