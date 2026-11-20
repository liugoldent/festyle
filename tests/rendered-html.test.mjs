import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const templateRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
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

test("festival pages have their own crawlable metadata and links", async () => {
  const response = await render("/festivals/2027/mega-vegas-2027/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1[^>]*>MEGA VEGAS 2027<\/h1>/);
  assert.match(html, /<title>MEGA VEGAS 2027｜日期、地點與演出陣容/);
  assert.match(html, /rel="canonical" href="https:\/\/festyle-jp\.netlify\.app\/festivals\/2027\/mega-vegas-2027\/"/);
  assert.match(html, /3\/20-3\/21/);
  assert.match(html, /官方網站/);
});

test("concert performances have distinct crawlable pages and official links", async () => {
  const response = await render("/concerts/2027/aina-the-end-0307/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AiNA THE END LIVE TOUR 2027/);
  assert.match(html, /3\/7/);
  assert.match(html, /神戸国際会館こくさいホール/);
  assert.match(html, /ainatheend\.jp\/news\/detail\.php\?id=1136806/);
  assert.match(html, /Japan Concerts/);

  const zutomayo = await render("/concerts/2027/zutomayo-0115/");
  assert.equal(zutomayo.status, 200);
  const zutomayoHtml = await zutomayo.text();
  assert.match(zutomayoHtml, /アピクラ電機/);
  assert.match(zutomayoHtml, /広島文化学園HBGホール/);
  assert.match(zutomayoHtml, /zutomayo\.net\/apicula\//);
});

test("server-renders the festival explorer", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /<title>Festyle \| 2026・2027 日本音樂祭與專場指南<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/festyle-jp\.netlify\.app\/"/);
  assert.match(html, /property="og:image" content="https:\/\/festyle-jp\.netlify\.app\/og-image\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /日本音樂祭與專場指南/);
  assert.match(html, /返回頂部/);
  assert.match(html, /全站搜尋表演人員/);
  assert.match(html, /用年份與地區找音樂祭、專場/);
  assert.match(html, /顯示：(?:<!-- -->)?全部/);
  assert.match(html, /event-filter-toggle/);
  assert.match(html, /日本全國/);
  assert.match(html, /2027(?:<!-- -->)? 年/);
  assert.doesNotMatch(html, /2018(?:<!-- -->)? 年/);
  assert.match(html, /placeholder="例如：10-FEET、あいみょん"/);
  assert.match(html, /京都大作戦/);
  assert.match(html, /售票資訊/);
  assert.match(html, /NUMBER SHOT2026/);
  assert.match(html, /FUJI ROCK FESTIVAL &#x27;26/);
  assert.match(html, /RISING SUN ROCK FESTIVAL 2026 in EZO/);
  assert.match(html, /SUMMER SONIC 2026/);
  assert.match(html, /SPACE SHOWER SWEET LOVE SHOWER 2026/);
  assert.match(html, /DEAD POP FESTiVAL 2026/);
  assert.match(html, /ROCK IN JAPAN FESTIVAL 2026/);
  assert.match(html, /BLARE FEST\. 2026/);
  assert.match(html, /神戸周遊フェス 2026/);
  assert.match(html, /LuckyFes&#x27;26/);
  assert.match(html, /Talking Rock! FES\.2026 Kobe/);
  assert.match(html, /笑福絶唱FESTIVAL 2026/);
  assert.match(html, /CANNONBALL外伝/);
  assert.match(html, /Exciting Summer in WAJIKI&#x27;26/);
  assert.match(html, /SUKIYAKI MEETS THE WORLD 2026/);
  assert.match(html, /Earth Celebration 2026/);
  assert.match(html, /WILD BUNCH FEST\. 2026/);
  assert.match(html, /神戸音学祭2026/);
  assert.match(html, /MONSTER baSH 2026/);
  assert.match(html, /Sky Jamboree 2026/);
  assert.match(html, /ハイエストマウンテン2026/);
  assert.match(html, /山水人 YAMAUTO 2026/);
  assert.match(html, /Slow LIVE’26 in 池上本門寺/);
  assert.match(html, /ONE PARK FESTIVAL 2026/);
  assert.match(html, /DIG FEST 2026/);
  assert.match(html, /SHINE UP FES！ 2026/);
  assert.match(html, /TREASURE05X 2026 LAND OF THE FREE -LAGUNA FINAL-/);
  assert.match(html, /マグロック＆ポップ 2026/);
  assert.match(html, /AIR JAM 2026/);
  assert.match(html, /COUNTDOWN JAPAN 26\/27/);
  assert.match(html, /id="festival-card-festival_slow_live_2026"/);
  assert.ok(
    html.indexOf('id="festival-card-festival_slow_live_2026"') <
      html.indexOf('id="festival-card-festival_one_park_fes_2026"'),
  );
  assert.ok(
    html.indexOf('id="festival-card-festival_save_the_birthday_2026"') <
      html.indexOf('id="festival-card-festival_tomakomai_mirai_fest_2026"'),
  );
  assert.ok(
    html.indexOf('id="festival-card-festival_kyoto_ultra_express_2026"') <
      html.indexOf('id="festival-card-festival_countdown_japan_2026"'),
  );
  assert.match(html, /響都超特急2026/);
  assert.match(html, /JAPAN JAM 2026/);
  assert.match(html, /1CHANCE FESTIVAL 2026/);
  assert.match(html, /OSAKA HAZIKETEMAZARE FESTIVAL 2026/);
  assert.match(html, /MONGOL800 ga FESTIVAL What a Wonderful World!!26/);
  assert.match(html, /福岡/);
  assert.match(html, /PayPay Dome/);
  assert.match(html, /苗場スキー場/);
  assert.match(html, /石狩湾新港/);
  assert.match(html, /ZOZOマリンスタジアム/);
  assert.match(html, /千葉市蘇我スポーツ公園/);
  assert.match(html, /熊本県農業公園 カントリーパーク/);
  assert.match(html, /泉大津フェニックス/);
  assert.match(html, /宜野湾港マリーナ/);
  assert.match(html, /東扇島東公園特設会場/);
  assert.match(html, /ポートメッセなごや/);
  assert.match(html, /京都パルスプラザ/);
  assert.match(html, /国営ひたち海浜公園/);
  assert.match(html, /神戸ワールド記念ホール/);
  assert.match(html, /有明アリーナ/);
  assert.match(html, /山口きらら博記念公園/);
  assert.match(html, /国営讃岐まんのう公園/);
  assert.match(html, /稲佐山公園野外ステージ/);
  assert.match(html, /出演者清單/);
  assert.match(html, /placeholder="搜尋表演人員"/);
  assert.match(html, /查看更多藝人（還有/);
  assert.match(html, /10-FEET/);
  assert.match(html, /KUZIRA/);
  assert.match(html, /サンボマスター/);
  assert.doesNotMatch(html, />#KUZIRA</);
  assert.doesNotMatch(html, />#10-FEET</);
  assert.match(html, /相似音樂祭/);
  assert.match(html, /每張卡片會列出相似原因/);
  assert.match(html, /食衣住行樂/);
  assert.match(html, /收起資訊/);
});

test("removes starter preview wiring", async () => {
  const [page, layout, packageJson, css, data, explorer] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/FestivalExplorer.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<FestivalExplorer \/>/);
  assert.match(layout, /title:\s*"Festyle \| 2026・2027 日本音樂祭與專場指南"/);
  assert.match(css, /\.regional-map/);
  assert.match(css, /\.detail-panel-summary\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(css, /\.travel-item-links/);
  assert.match(data, /官方道案內/);
  assert.match(data, /唐人町駅/);
  assert.match(data, /越後湯沢駅/);
  assert.match(data, /麻生駅/);
  assert.match(data, /海浜幕張駅/);
  assert.match(data, /BUMP OF CHICKEN/);
  assert.match(data, /The xx/);
  assert.match(data, /Creepy Nuts/);
  assert.match(data, /festival_sweet_love_shower_2026/);
  assert.match(data, /festival_japan_jam_2026/);
  assert.match(data, /festival_dead_pop_2026/);
  assert.match(data, /festival_rock_in_japan_2026/);
  assert.match(data, /festival_blare_fest_2026/);
  assert.match(data, /ticketUrl/);
  assert.match(data, /eplus\.jp\/numbershot/);
  assert.match(data, /blarefest\.com\/tickets/);
  assert.match(data, /kue\.rotten-g\.com\/26\/ticket/);
  assert.match(data, /主票券 SOLD OUT/);
  assert.match(data, /全券種 SOLD OUT/);
  assert.match(data, /festival_kyoto_ultra_express_2026/);
  assert.match(data, /伏水酒蔵小路/);
  assert.match(data, /月桂冠大倉記念館/);
  assert.match(data, /伏見稲荷大社/);
  assert.match(data, /氣志團/);
  assert.match(data, /JUN SKY WALKER\(S\)/);
  assert.match(data, /festival_1chance_2026/);
  assert.match(data, /festival_haziketemazare_2026/);
  assert.match(data, /festival_www_2026/);
  assert.match(data, /festival_kobe_shuyu_2026/);
  assert.match(data, /festival_luckyfes_2026/);
  assert.match(data, /festival_talking_rock_kobe_2026/);
  assert.match(data, /festival_shofuku_zessho_2026/);
  assert.match(data, /festival_cannonball_gaiden_2026/);
  assert.match(data, /festival_wajiki_2026/);
  assert.match(data, /festival_sukiyaki_2026/);
  assert.match(data, /festival_earth_celebration_2026/);
  assert.match(data, /festival_wild_bunch_2026/);
  assert.match(data, /festival_kobe_ongakusai_2026/);
  assert.match(data, /festival_monster_bash_2026/);
  assert.match(data, /festival_sky_jamboree_2026/);
  assert.match(data, /festival_highest_mountain_2026/);
  assert.match(data, /festival_yamauto_2026/);
  assert.match(data, /出演辞退（官方公告）/);
  assert.match(data, /6\/24付：出演キャンセル/);
  assert.match(data, /公開來自 9 所大學的 15 個團體與 timetable/);
  assert.match(data, /augustFestivalTravelSeeds\.flatMap\(makeFestivalTravelItems\)/);
  assert.equal((data.match(/\{"sourceSlug":/g) ?? []).length, 110);
  assert.match(data, /lateYearFestivalSeeds\.map\(makeLateYearFestival\)/);
  assert.match(data, /lateYearFestivalSeeds\.flatMap\(makeLateYearTravelItems\)/);
  assert.match(data, /lateYearGeneratedAreas/);
  assert.match(data, /"sourceSlug":"slow_live_2026"/);
  assert.match(data, /red-hot\.ne\.jp\/slow\/ticket/);
  assert.match(data, /Original Love Acoustic Session/);
  assert.match(data, /SOIL&”PIMP”SESSIONS/);
  assert.match(data, /Milstone for 10 years/);
  assert.match(data, /r\.funity\.jp\/shineupfes2026/);
  assert.match(data, /ODAKEi/);
  assert.match(data, /treasure05x\.jp\/ticket\.html/);
  assert.match(data, /reGretGirl/);
  assert.match(data, /kusanonefes\.com/);
  assert.match(data, /ticketdive\.com\/event\/knf_26_2days/);
  assert.match(data, /I to U \$CREAMing!!/);
  assert.match(data, /くさのねアイドルフェスティバル/);
  assert.match(data, /入場免費、募金制/);
  assert.match(data, /JR 河瀬駅提供免費接駁巴士/);
  assert.match(data, /asutomusicpark\.com\/tickets\.html/);
  assert.match(data, /街人/);
  assert.match(data, /8\/14付：出演見送り/);
  assert.match(data, /miraifest-tomakomai\.jp\/ticket\.html/);
  assert.match(data, /新しい学校のリーダーズ/);
  assert.match(data, /モナキ/);
  assert.match(data, /ゼビオアリーナ仙台／あすと長町杜の広場公園/);
  assert.match(data, /"sourceSlug":"one_only_fes_2026"/);
  assert.match(data, /"sourceSlug":"oborock_2026"/);
  assert.match(data, /"sourceSlug":"umk_seagaia_jamnight_2026"/);
  assert.match(data, /"sourceSlug":"jstreet_jazz_2026"/);
  assert.match(data, /"sourceSlug":"kamuro_music_fest_2026"/);
  assert.match(data, /HIKKA/);
  assert.match(data, /稲沢番楽保存会/);
  assert.match(data, /"sourceSlug":"magrock_pop_2026"/);
  assert.match(data, /"sourceSlug":"air_jam_2026"/);
  assert.match(data, /"sourceSlug":"countdown_japan_2026"/);
  assert.match(data, /Lucky Space/);
  assert.match(data, /SUKIYAKI STEEL ORCHESTRA/);
  assert.match(data, /Miyake-jima Geino Doshi-kai/);
  assert.match(data, /JAH WORKS/);
  assert.match(data, /SoundS（神戸大学）/);
  assert.match(data, /24h Munchies Session/);
  assert.match(data, /前售已截止/);
  assert.match(data, /year: 2026/);
  assert.match(data, /5\/4 中止/);
  assert.match(data, /ONE OK ROCK/);
  assert.match(data, /LESS THAN JAKE/);
  assert.match(data, /ACIDMAN/);
  assert.match(data, /しけもくロッカーズ/);
  assert.match(data, /JasonAndrew/);
  assert.match(data, /FUNKY MONKEY BΛBY'S/);
  assert.match(data, /トゲナシトゲアリ/);
  assert.match(data, /THE STROKES/);
  assert.match(data, /JENNIE/);
  assert.match(data, /7\/14付：キャンセル/);
  assert.match(data, /RED STAR CAFE/);
  assert.match(data, /PROVO/);
  assert.match(data, /KATSINA SESSION/);
  assert.match(data, /MIDNIGHT SONIC DIESEL TAKEOVER/);
  assert.match(data, /HOUSE OF PROTECTION/);
  assert.match(data, /Memphis May Fire/);
  assert.match(data, /山中湖交流プラザ きらら/);
  assert.match(data, /あいみょん/);
  assert.match(data, /レキシ VS オシャレキシ/);
  assert.match(data, /琵琶湖騎腳踏車/);
  assert.match(data, /祇園祭｜把整座京都當成舞台/);
  assert.match(data, /前祭・宵山/);
  assert.match(data, /祇園祭 2026 完整攻略/);
  assert.doesNotMatch(data, /performerTags/);
  assert.match(explorer, /role="dialog"/);
  assert.match(explorer, /event\.key === "Escape"/);
  assert.match(explorer, /未來參加音樂祭/);
  assert.match(explorer, /initialPerformerCount = 12/);
  assert.match(explorer, /GlobalPerformerSearch/);
  assert.match(explorer, /getFestivalSortDate/);
  assert.match(explorer, /pendingFestivalId/);
  assert.match(explorer, /document\.getElementById\(`festival-card-/);
  assert.match(explorer, /scrollIntoView\(\{ behavior: "smooth", block: "center" \}\)/);
  assert.match(explorer, /new Set\(festivals\.map\(\(festival\) => festival\.year\)\)/);
  assert.match(explorer, /getFestivalPrefectures/);
  assert.match(explorer, /detail-panel-summary-collapsed/);
  assert.match(explorer, /aria-expanded=\{!isSummaryCollapsed\}/);
  assert.match(explorer, /resultsByMonth/);
  assert.match(explorer, /查看\{eventType\(result\.festival\)\} →/);
  assert.match(explorer, /找到 \{filteredPerformers\.length\} 筆符合/);
  assert.match(explorer, /performance\.note/);
  assert.match(explorer, /performer\.note/);
  assert.match(explorer, /aria-expanded=\{showAll\}/);
  assert.doesNotMatch(explorer, />\s*關聯音樂祭\s*</);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|themeColor|\bViewport\b/);

  await assert.rejects(
    access(new URL("public/_sites-preview", templateRoot)),
  );
});

test("official festival updates keep venue, cancellation and artist relationships consistent", async () => {
  const { festivals, areas, artists, performances, travelItems } = await import("../app/data.ts");
  const festivalById = new Map(festivals.map((festival) => [festival.id, festival]));
  const artistById = new Map(artists.map((artist) => [artist.id, artist]));
  const areaById = new Map(areas.map((area) => [area.id, area]));
  const izumo = festivalById.get("festival_izumoo_rochi_2026");
  assert.match(izumo.venue, /松江市総合体育館/);
  assert.ok(izumo.areaIds.some((id) => areaById.get(id)?.name === izumo.venue));
  assert.equal(izumo.ticketUrl, "https://izumoorochifes.jp/ticket/");
  for (const performance of performances) {
    assert.ok(festivalById.has(performance.festivalId));
    assert.ok(artistById.has(performance.artistId));
  }
  for (const item of travelItems) {
    assert.ok(areaById.has(item.areaId));
    assert.ok(item.relatedFestivalIds.every((id) => festivalById.has(id)));
  }
  for (const [festivalId, name] of [
    ["festival_full_metal_japan_2026", "RAGE"],
    ["festival_minami_wheel_2026", "もさを。"],
  ]) {
    const appearances = performances.filter((performance) =>
      performance.festivalId === festivalId && artistById.get(performance.artistId)?.name === name,
    );
    assert.equal(appearances.length, 1);
    assert.match(appearances[0].note, /出演キャンセル/);
  }
  for (const name of ["平井 大", "山内総一郎", "THE SPELLBOUND × BOOM BOOM SATELLITES"]) {
    const key = (value) => value.replace(/\s+/g, "").toLowerCase();
    assert.equal(artists.filter((artist) => key(artist.name) === key(name)).length, 1);
  }
  const tori = festivalById.get("festival_tori_rock_fes_2026");
  assert.equal(tori.startsOn, "2026-12-04");
  assert.equal(tori.endsOn, "2026-12-05");
  const boro = performances.filter((performance) => performance.festivalId === "festival_borofesta_2026");
  assert.ok(boro.length > 0);
  for (const performance of boro) {
    assert.doesNotMatch(artistById.get(performance.artistId).name, /[\t\r\n]|\sNEW$/);
  }
  const ultra = performances.filter((performance) => performance.festivalId === "festival_ultra_japan_2026");
  assert.equal(ultra.length, 59);
  assert.ok(ultra.every((performance) => ["9/19", "9/20"].includes(performance.dateLabel) && performance.stageLabel));
  const tomakomai = performances.filter((performance) =>
    performance.festivalId === "festival_tomakomai_mirai_fest_2026" && !performance.note?.startsWith("MC"),
  );
  assert.ok(tomakomai.every((performance) => ["9/12", "9/13"].includes(performance.dateLabel)));
});

test("2027 announced festivals have verified dates and only announced performers", async () => {
  const { festivals, areas, artists, performances, travelItems } = await import("../app/data.ts");
  const ids = [
    "festival_fukuoka_music_fes_2027",
    "festival_gmo_sonic_2027",
    "festival_hibiya_music_fes_2027",
    "festival_ultra_japan_2027",
  ];
  const byId = new Map(festivals.map((festival) => [festival.id, festival]));
  const areaIds = new Set(areas.map((area) => area.id));
  const artistById = new Map(artists.map((artist) => [artist.id, artist.name]));

  for (const id of ids) {
    const festival = byId.get(id);
    assert.ok(festival);
    assert.equal(festival.year, 2027);
    assert.ok(festival.startsOn.startsWith("2027-"));
    assert.ok(festival.areaIds.every((areaId) => areaIds.has(areaId)));
    assert.deepEqual(
      new Set(travelItems.filter((item) => item.relatedFestivalIds.includes(id)).map((item) => item.category)),
      new Set(["food", "clothes", "stay", "transport", "fun"]),
    );
  }

  assert.equal(byId.get(ids[0]).startsOn, "2027-01-30");
  assert.equal(byId.get(ids[1]).startsOn, "2027-04-03");
  assert.equal(byId.get(ids[2]).startsOn, "2027-06-05");
  assert.equal(byId.get(ids[3]).startsOn, "2027-09-18");
  const fukuokaRows = performances.filter((row) => row.festivalId === ids[0]);
  assert.equal(fukuokaRows.length, 22);
  assert.ok(fukuokaRows.some((row) => row.dateLabel === "1/30" && artistById.get(row.artistId) === "Suchmos"));
  assert.ok(fukuokaRows.some((row) => row.dateLabel === "1/31" && artistById.get(row.artistId) === "Kis-My-Ft2"));
  assert.equal(performances.filter((row) => ids.slice(1).includes(row.festivalId)).length, 0);
});

test("MEGA VEGAS 2027 keeps the announced lineup separate from unknown day splits", async () => {
  const { festivals, artists, performances, travelItems, areas } = await import("../app/data.ts");
  const id = "festival_mega_vegas_2027";
  const festival = festivals.find((entry) => entry.id === id);
  assert.ok(festival);
  assert.equal(festival.startsOn, "2027-03-20");
  assert.equal(festival.endsOn, "2027-03-21");
  assert.equal(festival.venue, "神戸ワールド記念ホール");
  assert.equal(festival.ticketUrl, "https://eplus.jp/sf/detail/4203630001-P0030003");
  assert.ok(festival.areaIds.every((areaId) => areas.some((area) => area.id === areaId)));

  const rows = performances.filter((row) => row.festivalId === id);
  const artistById = new Map(artists.map((artist) => [artist.id, artist.name]));
  assert.equal(rows.length, 6);
  assert.deepEqual(
    rows.filter((row) => artistById.get(row.artistId) === "Fear, and Loathing in Las Vegas")
      .map((row) => row.dateLabel),
    ["3/20", "3/21"],
  );
  assert.equal(rows.filter((row) => !row.dateLabel).length, 4);
  assert.deepEqual(
    new Set(travelItems.filter((item) => item.relatedFestivalIds.includes(id)).map((item) => item.category)),
    new Set(["food", "clothes", "stay", "transport", "fun"]),
  );
});

test("September source imports preserve artist names, dates and venue grouping", async () => {
  const { festivals, artists, performances, areas, travelItems } = await import("../app/data.ts");
  const artistById = new Map(artists.map((artist) => [artist.id, artist]));
  const rows = (festivalId) => performances.filter((row) => row.festivalId === festivalId);
  for (const artist of artists) assert.ok(artist.name.trim(), `Empty artist: ${artist.id}`);
  const rij = rows("festival_rock_in_japan_2026");
  assert.equal(rij.filter((row) => artistById.get(row.artistId).name === "[Alexandros]").length, 1);
  assert.ok(rij.some((row) => artistById.get(row.artistId).name === "WorryHeart" && row.dateLabel === "9/12"));
  const jazz = rows("festival_jstreet_jazz_2026");
  assert.ok(jazz.length > 800);
  assert.ok(jazz.every((row) => ["9/12", "9/13"].includes(row.dateLabel) && row.stageLabel));
  assert.ok(jazz.some((row) => artistById.get(row.artistId).name === "沢野源裕" && row.note.includes("Swing Carnival")));
  assert.ok(jazz.every((row) => !artistById.get(row.artistId).name.startsWith("特別企画")));
  const oboro = rows("festival_oborock_2026");
  assert.equal(oboro.length, 28);
  assert.ok(oboro.every((row) => /氣比の舞台|角鹿の舞台/.test(row.stageLabel)));
  const pmam = festivals.find((festival) => festival.id === "festival_pit_me_against_myself_2026");
  assert.match(pmam.venue, /4〜5ホール/);
  assert.ok(pmam.areaIds.some((id) => areas.find((area) => area.id === id)?.name === pmam.venue));
  assert.equal(rows(pmam.id).length, 15);
  assert.ok(travelItems.some((item) => item.relatedFestivalIds.includes(pmam.id) && item.links?.some((link) => link.href === "https://www.m-messe.co.jp/access/")));
  for (const name of ["Novelbright", "THE JET BOY BANGERZ"]) {
    assert.ok(rows("festival_a_nation_2026").some((row) => artistById.get(row.artistId).name === name && row.dateLabel === "10/4"));
  }
});

test("current announcements distinguish cancellation and unresolved dates", async () => {
  const { festivals, performances } = await import("../app/data.ts");
  const cancelled = festivals.find((festival) => festival.id === "festival_fsg_caltivent_2026");
  assert.ok(cancelled.moodTags.includes("2026 開催中止"));
  assert.match(cancelled.description, /9\/30/);
  const sweet = performances.filter((row) => row.festivalId === "festival_sweet_fes_2026");
  assert.equal(sweet.length, 22);
  assert.ok(sweet.every((row) => row.dateLabel === "出演日確認中"));
  const seen = new Set();
  for (const row of performances.filter((row) => row.festivalId === "festival_meli_melo_osaka_2026")) {
    const key = [row.artistId, row.dateLabel, row.stageLabel].join("|");
    assert.ok(!seen.has(key), `Duplicate appearance ${key}`);
    seen.add(key);
  }
});

test("festival date display supports an announced rest day", async () => {
  const { festivals, performances } = await import("../app/data.ts");
  const cdj = festivals.find((festival) => festival.id === "festival_countdown_japan_2026");
  assert.equal(cdj.dateLabel, "12/26–27、12/29–31");
  assert.equal(cdj.startsOn, "2026-12-26");
  assert.equal(cdj.endsOn, "2026-12-31");
  assert.match(cdj.description, /12\/28.*休止/);
  const viva = festivals.find((festival) => festival.id === "festival_viva_wonderland_fes_2026");
  assert.equal(viva.dateLabel, "10/11");
  const vivaRows = performances.filter((row) => row.festivalId === viva.id);
  assert.equal(vivaRows.length, 16);
  assert.equal(vivaRows.filter((row) => !/保留待主辦確認/.test(row.note)).length, 15);
  assert.match(viva.ticketUrl, /^https:\/\/eplus\.jp\//);
});

test("festival metadata overrides reach the public data for hyphenated slugs", async () => {
  const { festivals, travelItems } = await import("../app/data.ts");
  const meli = festivals.find((festival) => festival.id === "festival_meli_melo_osaka_2026");
  assert.equal(meli.ticketUrl, "https://www.melimelo-osaka.com/ticket");
  assert.match(meli.description, /5,800/);
  assert.ok(travelItems.some((item) => item.relatedFestivalIds.includes(meli.id) && item.category === "food" && item.description.includes("B.B.CURRY")));
  const neighbor = festivals.find((festival) => festival.id === "festival_neighborgood_music_fes_2026");
  assert.match(neighbor.description, /10:00–17:00/);
  const tomakomaiFood = travelItems.find((item) => item.id === "festival_tomakomai_mirai_fest_2026_food");
  assert.match(tomakomaiFood.description, /免費.*ハスカップ/);
  assert.match(tomakomaiFood.description, /食券/);
  assert.ok(travelItems.some((item) => item.id === "1chance-food" && item.description.includes("PREMIUM WATER") && item.links?.some((link) => link.href === "https://1chancefes.com/")));
});

test("newly resolved official schedules preserve dates and participant grouping", async () => {
  const { festivals, performances } = await import("../app/data.ts");
  const kansai = festivals.find((festival) => festival.id === "festival_kansai_lovers_2026");
  assert.equal(kansai.startsOn, "2026-09-26");
  assert.equal(kansai.endsOn, "2026-09-26");
  const rows = (slug) => performances.filter((row) => row.festivalId === `festival_${slug}_2026`);
  assert.equal(rows("kansai_lovers").length, 10);
  assert.ok(rows("kansai_lovers").every((row) => row.dateLabel === "9/26"));
  assert.equal(rows("music_city_tenjin").length, 74);
  assert.ok(rows("music_city_tenjin").every((row) => ["9/26", "9/27"].includes(row.dateLabel) && row.stageLabel && row.note.includes("官方時刻表")));
  assert.equal(rows("wake_some_noise").length, 65);
  assert.equal(rows("wake_some_noise").filter((row) => row.note?.startsWith("官方聯合演出")).length, 8);
  assert.equal(rows("kazenorhythm_circuit").length, 27);
});

test("official timetables keep shared artists and separate same-stage programs", async () => {
  const { festivals, artists, performances, travelItems } = await import("../app/data.ts");
  const artistById = new Map(artists.map((artist) => [artist.id, artist]));
  const rows = (slug, name) => performances.filter((row) =>
    row.festivalId === `festival_${slug}_2026` && artistById.get(row.artistId)?.name === name,
  );
  const ringo = rows("ringo_music_fes", "りんご娘");
  assert.equal(new Set(ringo.map((row) => row.artistId)).size, 1);
  const kimori = ringo.filter((row) => row.dateLabel === "9/19" && row.stageLabel === "KIMORI AREA");
  assert.equal(kimori.length, 2);
  assert.ok(kimori.some((row) => row.note.startsWith("11:00–11:30")));
  assert.ok(kimori.some((row) => row.note.startsWith("12:00–13:00")));
  assert.equal(rows("minami_wheel", "INIS")[0].dateLabel, "10/10");
  assert.equal(rows("minami_wheel", "JŪJI")[0].dateLabel, "10/11");
  assert.equal(rows("minami_wheel", "Meaningful Stone")[0].dateLabel, "10/12");
  assert.equal(rows("pit_me_against_myself", "TIVE")[0].stageLabel, "TRUCK STAGE");
  assert.match(rows("pit_me_against_myself", "TIVE")[0].note, /11:00–11:20/);
  assert.equal(rows("pit_me_against_myself", "SHADOWS")[0].stageLabel, "RIOT STAGE");
  assert.match(rows("magrock_pop", "電気グルーヴ")[0].note, /19:20/);
  assert.ok(travelItems.find((item) => item.id === "rijf-wear").links.some((link) => link.href === "https://rijfes.jp/2026/news/3953/"));
  const inazumaCulture = travelItems.find((item) => item.id === "festival_fest_inazuma_2026_culture_20260909");
  assert.ok(festivals.find((festival) => festival.id === inazumaCulture.relatedFestivalIds[0]).areaIds.includes(inazumaCulture.areaId));
});

test("September timetable updates retain cancellations and repeated crew appearances", async () => {
  const { festivals, artists, performances, travelItems } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = (slug, name) => performances.filter((row) =>
    row.festivalId === `festival_${slug}_2026` && names.get(row.artistId) === name,
  );
  const inis = rows("minami_wheel", "INIS");
  assert.equal(inis.length, 1);
  assert.equal(inis[0].stageLabel, "ANIMA");
  assert.match(inis[0].note, /18:00/);
  assert.match(rows("minami_wheel", "もさを。")[0].note, /キャンセル/);
  const pushpull = rows("neyagawa_drive_rock", "プッシュプルポット");
  assert.equal(pushpull.length, 2);
  assert.equal(new Set(pushpull.map((row) => row.artistId)).size, 1);
  assert.deepEqual(new Set(pushpull.map((row) => row.stageLabel)), new Set(["屋外メインステージ", "館内LIVEトークゾーン"]));
  assert.equal(rows("neyagawa_drive_rock", "FROM KANAGAWA").length, 0);
  const crew = rows("masterpiece_fes", "YAGI");
  assert.equal(crew.length, 2);
  assert.equal(new Set(crew.map((row) => row.artistId)).size, 1);
  assert.ok(crew.some((row) => row.note.startsWith("13:20–14:10")));
  assert.ok(crew.some((row) => row.note.startsWith("16:10–17:00")));
  const miyako = festivals.find((festival) => festival.id === "festival_miyako_island_2026");
  assert.equal(miyako.endsOn, "2026-10-17");
  assert.ok(travelItems.some((item) => item.relatedFestivalIds.includes(miyako.id) && item.description.includes("2026/10/18（日）16:30 開場")));
});

test("new day splits preserve separate guest appearances and shared artist identities", async () => {
  const { festivals, artists, performances, travelItems } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = (slug, name) => performances.filter((row) =>
    row.festivalId === `festival_${slug}_2026` && names.get(row.artistId) === name,
  );
  const asai = rows("nakatsugawa_wild_wood", "浅井健一");
  assert.deepEqual(new Set(asai.map((row) => row.dateLabel)), new Set(["9/19", "9/20"]));
  assert.equal(new Set(asai.map((row) => row.artistId)).size, 1);
  assert.match(asai.find((row) => row.dateLabel === "9/19").note, /東京スカパラダイスオーケストラ.*嘉賓/);
  const kotori = rows("tori_rock_fes", "KOTORI");
  assert.deepEqual(new Set(kotori.map((row) => row.dateLabel)), new Set(["12/4", "12/5"]));
  assert.equal(new Set(kotori.map((row) => row.artistId)).size, 1);
  assert.equal(rows("ringo_ongakusai", "CHOPPA→").length, 1);
  assert.equal(rows("ringo_ongakusai", "CHOPPA→")[0].dateLabel, "9/26");
  assert.equal(rows("ringo_ongakusai", "KIO HAYAKAWA")[0].dateLabel, "9/26");
  assert.match(rows("ringo_ongakusai", "KIO HAYAKAWA")[0].note, /BMX FLATLAND/);
  assert.equal(rows("super_rock_cityh", "Mighty Cats")[0].stageLabel, "4.14");
  assert.match(rows("super_rock_cityh", "Mighty Cats")[0].note, /11:30–11:55.*O.A/);
  assert.equal(rows("akigase_fes", "PB JB KENY").length, 1);
  assert.equal(rows("akigase_fes", "伽乱堂").length, 1);
  const tomakomaiFood = travelItems.find((item) => item.category === "food" && item.relatedFestivalIds.includes("festival_tomakomai_mirai_fest_2026"));
  assert.match(tomakomaiFood.description, /既有餐飲設施只收現金/);
  assert.ok(tomakomaiFood.links.some((link) => link.href === "https://miraifest-tomakomai.jp/news/news_21.html"));
  const tori = festivals.find((festival) => festival.id === "festival_tori_rock_fes_2026");
  assert.equal(tori.startsOn, "2026-12-04");
  assert.equal(tori.endsOn, "2026-12-05");
});

test("official set times preserve all appearances and ticket sellout scope", async () => {
  const { festivals, artists, performances, travelItems } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const ultra = performances.filter((row) => row.festivalId === "festival_ultra_japan_2026");
  assert.equal(ultra.length, 59);
  assert.ok(ultra.every((row) => /\d{2}:\d{2} 起.*日本時間/.test(row.note)));
  assert.match(ultra.find((row) => names.get(row.artistId) === "JORIS VOORN").note, /TRIP TO GALAXY.*17:00/);
  assert.match(ultra.find((row) => names.get(row.artistId) === "LILLY PALMER").note, /15:00/);
  assert.equal(new Set(performances.filter((row) => names.get(row.artistId) === "Sakurashimeji").map((row) => row.artistId)).size, 1);
  const gfest = performances.filter((row) => row.festivalId === "festival_g_fest_2026");
  const mainActs = gfest.filter((row) => row.stageLabel === "MAIN STAGE" && !/OPENING ACT|GUEST VOCAL/.test(row.note ?? ""));
  assert.equal(mainActs.length, 18);
  assert.equal(gfest.find((row) => names.get(row.artistId) === "Sakurashimeji").dateLabel, "10/11");
  assert.match(festivals.find((row) => row.id === "festival_g_fest_2026").description, /兩日站票.*SOLD OUT.*單日站票/);
  const ethnic = performances.filter((row) => row.festivalId === "festival_tatikawa_youkai_2026" && row.stageLabel === "エスニックまつりエリア");
  assert.equal(ethnic.length, 2);
  assert.ok(ethnic.every((row) => row.dateLabel === "出演日未定"));
  const akigase = travelItems.find((row) => row.id === "festival_akigase_fes_2026_transport");
  assert.match(akigase.description, /最末班.*埼玉大学.*轉路線巴士/);
  assert.ok(akigase.links.some((link) => link.href === "https://akigasefes.com/access/"));
});

test("official school spelling preserves artist links and separate sauna experiences", async () => {
  const { artists, performances, travelItems, getArtist, getPerformersForFestival, getFestival } = await import("../app/data.ts");
  const school = getArtist("artist_1r89pfr");
  assert.equal(school.name, "多摩大学附属聖ヶ丘中学高等学校軽音楽部");
  assert.equal(artists.filter((artist) => artist.name.includes("聖ヶ丘")).length, 1);
  assert.equal(performances.filter((row) => row.artistId === school.id).length, 1);
  const festival = getFestival("festival_tamatama_festival_2026");
  assert.equal(getPerformersForFestival(festival).find((row) => row.artistId === school.id).artist, school);
  const experiences = travelItems.filter((row) => row.relatedFestivalIds.includes("festival_new_acoustic_camp_2026") && row.id.endsWith("20260913"));
  assert.equal(experiences.length, 2);
  assert.equal(new Set(experiences.map((row) => row.title)).size, 2);
  assert.ok(experiences.every((row) => row.category === "fun" && row.links.some((link) => link.href === "https://newacousticcamp.com/newmukavacamp/")));
});

test("SBI extra stage keeps overnight acts separate from timed day performances", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_sbi_music_circus_hokkaido_2026");
  const extra = rows.filter((row) => row.stageLabel === "AFTER DARK / EXTRA STAGE");
  assert.equal(rows.length, 43);
  assert.equal(extra.length, 10);
  assert.ok(extra.every((row) => row.dateLabel === "9/26 深夜場"));
  assert.ok(extra.every((row) => /個別時刻待公布|精確起訖未逐項標明/.test(row.note)));
  for (const name of ["G.O.A.T", "MIZUKI", "TOKI", "Casparia", "TAISHI"]) {
    assert.equal(rows.filter((row) => names.get(row.artistId) === name).length, 1);
  }
  assert.match(rows.find((row) => names.get(row.artistId) === "SELENES").note, /21:45.*翌9\/27/);
  assert.equal(extra.filter((row) => names.get(row.artistId) === "ONODA PUMP feat.コマイマキト").length, 1);
  assert.equal(rows.filter((row) => row.stageLabel === "DAYBREAK").length, 14);
});

test("Inazuma timetable preserves joint sets and undated character appearances", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_fest_inazuma_2026");
  assert.equal(rows.length, 73);
  const joint = rows.filter((row) => row.dateLabel === "9/21" && /17:50/.test(row.note));
  assert.deepEqual(new Set(joint.map((row) => names.get(row.artistId))), new Set(["abingdon boys school", "T.M.Revolution"]));
  assert.ok(joint.every((row) => row.stageLabel === "RAIJIN STAGE / FUJIN STAGE"));
  const yui = rows.filter((row) => names.get(row.artistId) === "優衣 from Lyka");
  assert.deepEqual(new Set(yui.map((row) => row.dateLabel)), new Set(["9/19", "9/20"]));
  assert.equal(new Set(yui.map((row) => row.artistId)).size, 1);
  const characters = rows.filter((row) => row.note.startsWith("CHARACTERS"));
  assert.equal(characters.length, 18);
  assert.ok(characters.every((row) => row.dateLabel === "出演日未定" && row.stageLabel === "RYUJIN STAGE"));
});

test("EACH STORY stage and yoga entries retain shared artist identity without inventing dates", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_each_story_2026");
  assert.equal(rows.length, 27);
  assert.ok(rows.every((row) => row.dateLabel === "出演日未定"));
  assert.equal(rows.filter((row) => row.stageLabel === "Lake Stage").length, 10);
  assert.equal(rows.filter((row) => row.stageLabel === "Hill Stage").length, 7);
  assert.equal(rows.filter((row) => row.stageLabel === "River Stage").length, 8);
  const ishii = rows.filter((row) => names.get(row.artistId) === "石井亮");
  assert.deepEqual(new Set(ishii.map((row) => row.stageLabel)), new Set(["Hill Stage", "Morning YOGA"]));
  assert.equal(new Set(ishii.map((row) => row.artistId)).size, 1);
  assert.equal(artists.filter((artist) => /Space Opera Symphon/.test(artist.name)).length, 1);
  assert.equal(rows.find((row) => names.get(row.artistId) === "Space Opera Symphonie").stageLabel, "Lake Stage");
});

test("Pan timetable preserves separate music and talk appearances for shared artists", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_pan_ongaku_antique_2026_2");
  assert.equal(rows.length, 64);
  const halfby = rows.filter((row) => names.get(row.artistId) === "HALFBY");
  assert.equal(new Set(halfby.map((row) => row.artistId)).size, 1);
  assert.deepEqual(new Set(halfby.map((row) => row.stageLabel)), new Set(["FACTORY", "パンと音楽とアンティーク専門学校"]));
  assert.match(halfby.find((row) => row.stageLabel === "FACTORY").note, /個別時刻は会場/);
  assert.match(halfby.find((row) => row.stageLabel !== "FACTORY").note, /13:00/);
  assert.equal(rows.filter((row) => names.get(row.artistId) === "鈴木ジェロニモ").length, 2);
  assert.ok(!rows.some((row) => /MUSIC DISCOVERY|Opening Act/.test(names.get(row.artistId))));
});

test("Tokyo Island keeps timed music, daily DJs, and officially named but undated opening acts", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_tokyo_island_2026");
  assert.equal(rows.filter((row) => !/MUSIC YOGA指導/.test(row.note ?? "")).length, 51);
  for (const name of ["遠藤孝行", "Yuta Takahashi", "Ackey", "野間真翔"]) {
    const acts = rows.filter((row) => names.get(row.artistId) === name);
    assert.deepEqual(new Set(acts.map((row) => row.dateLabel)), new Set(["10/10", "10/11", "10/12"]));
    assert.equal(new Set(acts.map((row) => row.artistId)).size, 1);
  }
  assert.match(rows.find((row) => names.get(row.artistId) === "ぁみ").note, /20:45.*怪談/);
  for (const name of ["圧ねぇ", "EIMI", "T-BEAR"]) {
    const act = rows.find((row) => names.get(row.artistId) === name);
    assert.equal(act.stageLabel, "Opening Act");
    assert.equal(act.dateLabel, undefined);
    assert.match(act.note, /未對應個別日期/);
  }
  assert.deepEqual(
    rows.filter((row) => names.get(row.artistId) === "ちぃたん☆").map((row) => row.dateLabel),
    ["10/11", "10/12"],
  );
});

test("Cultural and leisure travel overrides stay distinct while legacy fun overrides still apply", async () => {
  const { travelItems } = await import("../app/data.ts");
  const get = (id) => travelItems.find((item) => item.id === id);
  const panCulture = get("festival_pan_ongaku_antique_2026_2_culture");
  const panLeisure = get("festival_pan_ongaku_antique_2026_2_leisure");
  assert.equal(panCulture.category, "fun");
  assert.equal(panLeisure.category, "fun");
  assert.match(panCulture.description, /専門学校/);
  assert.doesNotMatch(panLeisure.description, /専門学校/);
  assert.match(get("festival_tokyo_island_2026_leisure").description, /運動會/);
  assert.doesNotMatch(get("festival_tokyo_island_2026_culture").description, /運動會/);
  for (const suffix of ["culture", "leisure"]) {
    assert.match(get(`festival_fsg_caltivent_2026_${suffix}`).description, /不能作為可參加行程/);
  }
  assert.ok(get("festival_fest_inazuma_2026_transport").links.some((link) => link.href === "https://fest-inazuma.com/2026/cms/news/205/"));
  assert.ok(!get("festival_nakatsugawa_wild_wood_2026_food").links.some((link) => link.href.includes("fest-inazuma")));
});

test("Connecolle day groups preserve shared artists and separate guest programs", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const conne = performances.filter((row) => row.festivalId === "festival_connecolle_fes_2026");
  assert.equal(conne.length, 41);
  assert.equal(conne.filter((row) => row.dateLabel === "10/24").length, 20);
  assert.equal(conne.filter((row) => row.dateLabel === "10/25").length, 21);
  for (const name of ["ZILCONIA", "ちぃたん☆"]) {
    const rows = conne.filter((row) => names.get(row.artistId) === name);
    assert.equal(rows.length, 2);
    assert.equal(new Set(rows.map((row) => row.artistId)).size, 1);
  }
  const kumama = performances.filter((row) => row.festivalId === "festival_koyabu_sonic_2026" && names.get(row.artistId) === "くまま");
  assert.equal(kumama.length, 3);
  assert.ok(kumama.every((row) => row.dateLabel === "9/21"));
  assert.match(kumama.find((row) => row.stageLabel === "メインステージ").note, /10:00/);
  assert.ok(kumama.filter((row) => row.stageLabel === "セカンドステージ").every((row) => /無歌唱/.test(row.note)));
  const rijGuest = performances.find((row) => row.festivalId === "festival_rock_in_japan_2026" && names.get(row.artistId) === "ムロツヨシ");
  assert.equal(rijGuest.dateLabel, "9/20");
  assert.equal(rijGuest.stageLabel, "LOTUS STAGE");
  assert.match(rijGuest.note, /14:00.*嘉賓/);
});

test("Timetable imports retain unresolved official conflicts and existing performers", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const azuma = performances.filter((row) => row.festivalId === "festival_live_azuma5th_2026");
  assert.match(azuma.find((row) => names.get(row.artistId) === "eijin").note, /^12:30.*修正/);
  assert.match(azuma.find((row) => names.get(row.artistId) === "Leo Gabriel").note, /^13:30/);
  assert.match(azuma.find((row) => names.get(row.artistId) === "SAMO").note, /未見列出.*保留/);
  assert.equal(azuma.find((row) => names.get(row.artistId) === "Child Plate Peops").stageLabel, "PARK STAGE");
  const sabae = performances.filter((row) => row.festivalId === "festival_sabae_jazz_2026");
  const timed = sabae.filter((row) => /\d{2}:\d{2}–\d{2}:\d{2}/.test(row.note));
  assert.equal(timed.length, 22);
  assert.deepEqual(new Set(timed.map((row) => row.stageLabel)), new Set(["芝生ステージ", "ピクニックステージ"]));
  assert.equal(sabae.find((row) => names.get(row.artistId) === "たっくー").dateLabel, "10/11");
});

test("Ticket and afterparty corrections stay scoped to the appropriate products", async () => {
  const { festivals, travelItems } = await import("../app/data.ts");
  const get = (slug) => festivals.find((row) => row.id === `festival_${slug}_2026`);
  assert.match(get("nobinobi_fes").description, /已於9\/16.*開賣/);
  assert.match(get("nobinobi_fes").description, /均另需音樂祭入場券/);
  assert.match(get("argument").description, /VIP.*SOLD OUT/);
  assert.equal(get("miyako_island").endsOn, "2026-10-17");
  const afterparty = travelItems.find((row) => row.id === "festival_miyako_island_2026_leisure_20260910");
  assert.match(afterparty.description, /2026\/10\/18（日）16:30 開場/);
  assert.doesNotMatch(afterparty.description, /日期待主辦確認/);
  const parking = travelItems.find((row) => row.id === "festival_starrymusic_2026_transport");
  assert.match(parking.description, /VIP／一般營地停車場可於10\/10 14:00–18:00、10\/11 13:00–17:00再入場/);
  assert.match(parking.description, /A、B停車場仍不可再入庫/);
});

test("Manual clothing updates do not attach unrelated sources to later travel records", async () => {
  const { travelItems } = await import("../app/data.ts");
  assert.match(travelItems.find((row) => row.id === "1chance-wear").description, /45L.*1,000円/);
  const installation = travelItems.find((row) => row.id === "festival_each_story_2026_kankyo_culture");
  assert.ok(!installation.links.some((link) => link.href.includes("1chancefes")));
});

test("Radio Crazy official roster preserves daily lineup and named special-program roles", async () => {
  const { artists, performances, festivals } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_radio_crazy_2026");
  assert.deepEqual(["12/26", "12/27", "12/28"].map((day) => rows.filter((row) => row.dateLabel === day).length), [30, 34, 39]);
  assert.equal(new Set(rows.map((row) => row.artistId)).size, 103);
  assert.match(rows.find((row) => names.get(row.artistId) === "中島ヒロト").note, /歌合戦.*MC/);
  assert.ok(rows.some((row) => row.stageLabel === "LIVE HOUSE Antenna -TOYOTA BEYOND ZERO Garage-"));
  assert.ok(rows.some((row) => row.stageLabel === "音波神社 境内ステージ"));
  const festival = festivals.find((row) => row.id === "festival_radio_crazy_2026");
  assert.equal(festival.ticketUrl, "https://eplus.jp/radiocrazy2026/");
  assert.match(festival.description, /L／R／Z STAGE 陣容至此完整/);
  assert.match(festival.description, /林萌々子（Hump Back）/);
});

test("Yokai timetable separates disco, judging, and undated appearances", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_tatikawa_youkai_2026");
  const disco = rows.filter((row) => row.stageLabel === "妖怪ディスコ");
  assert.equal(rows.length, 68);
  assert.deepEqual(["10/10", "10/11", "10/12"].map((day) => disco.filter((row) => row.dateLabel === day).length), [9, 9, 8]);
  assert.ok(disco.every((row) => /\d{2}:\d{2}–\d{2}:\d{2}/.test(row.note)));
  assert.match(rows.find((row) => names.get(row.artistId) === "中沢健").note, /11:50–12:50.*審査員/);
  assert.equal(rows.find((row) => names.get(row.artistId) === "ヤマモ").dateLabel, "10/10");
  assert.equal(rows.find((row) => names.get(row.artistId) === "トムヤムジミー").dateLabel, "出演日未定");
  assert.ok(rows.filter((row) => names.get(row.artistId) === "モノノケダンスクラブ").every((row) => /未視為取消/.test(row.note)));
});

test("Verified replacement and timetable omission keep different attendance states", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const get = (slug, name) => performances.find((row) => row.festivalId === `festival_${slug}_2026` && names.get(row.artistId) === name);
  assert.equal(get("full_metal_japan", "VANDENBERG").dateLabel, "10/24");
  assert.match(get("full_metal_japan", "RAGE").note, /キャンセル.*VANDENBERG/);
  assert.match(get("viva_wonderland_fes", "Terraken").note, /尚未查得明確取消公告/);
  assert.equal(get("viva_wonderland_fes", "護鳥キミイチ").dateLabel, "10/11");
  assert.match(get("miyako_island", "JUICYJUICY").note, /16:15.*BREAK TIME ACT/);
  assert.match(get("miyako_island", "ELLEGARDEN").note, /20:10/);
});


test("RIJ cancelled day retains all appearances and distinguishes refund scopes", async () => {
  const { festivals, performances, travelItems } = await import("../app/data.ts");
  const festival = festivals.find((row) => row.id === "festival_rock_in_japan_2026");
  assert.match(festival.dateLabel, /9\/21中止/);
  assert.equal(festival.endsOn, "2026-09-21");
  const rows = performances.filter((row) => row.festivalId === festival.id);
  const cancelled = rows.filter((row) => row.dateLabel === "9/21");
  assert.equal(cancelled.length, 25);
  assert.ok(cancelled.every((row) => /公演取消.*9\/21全日中止.*退款/.test(row.note)));
  assert.ok(rows.filter((row) => row.dateLabel !== "9/21").every((row) => !/9\/21全日中止/.test(row.note ?? "")));
  assert.match(festival.description, /其他日期已使用不影響/);
  assert.match(festival.description, /9月內另公告/);
  const transport = travelItems.find((row) => row.id === "rijf-transport");
  assert.match(transport.description, /勿將入場票退款視為巴士退款/);
  assert.ok(!/開催判斷最遲/.test(transport.description));
  const wear = travelItems.find((row) => row.id === "rijf-wear");
  assert.match(wear.description, /9\/21全日取消.*預購寄物票退款/);
  assert.match(wear.description, /9\/20既有未入場／未使用條件/);
});

test("FFKT timetable preserves overnight dates, repeated sets, and artist identity", async () => {
  const { artists, performances, festivals } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_ffkt_izu_shirahama_2026");
  assert.equal(rows.length, 23);
  assert.equal(new Set(rows.map((row) => row.artistId)).size, 22);
  const htoo = rows.find((row) => names.get(row.artistId) === "H TO O");
  assert.ok(htoo);
  assert.equal(artists.filter((row) => row.name.replaceAll(" ", "") === "HTOO").length, 1);
  assert.equal(rows.find((row) => names.get(row.artistId) === "Mia Koden").dateLabel, "9/27");
  assert.match(rows.find((row) => names.get(row.artistId) === "CMYK").note, /23:30.*翌9\/27 01:00/);
  const osawa = rows.filter((row) => names.get(row.artistId) === "Yudai Osawa");
  assert.equal(osawa.length, 2);
  assert.ok(osawa.every((row) => row.dateLabel === "9/26" && row.stageLabel === "Kankyō Zone"));
  assert.match(osawa[0].note, /17:30/);
  assert.match(osawa[1].note, /20:30/);
  assert.equal(festivals.find((row) => row.id === "festival_ffkt_izu_shirahama_2026").endsOn, "2026-09-27");
});

test("JUNE night program keeps its event day and explicitly identifies next-day times", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((artist) => [artist.id, artist.name]));
  const rows = performances.filter((row) => row.festivalId === "festival_june_rock_fes_2026");
  assert.equal(rows.length, 31);
  assert.ok(rows.every((row) => row.dateLabel === "10/10"));
  assert.ok(rows.every((row) => /(?:LEFT|RIGHT|CHAOS) STAGE/.test(row.stageLabel)));
  assert.equal(rows.filter((row) => names.get(row.artistId) === "NeoN").length, 2);
  const dj = rows.filter((row) => names.get(row.artistId) === "DJライブキッズあるある中の人");
  assert.equal(dj.length, 2);
  assert.equal(new Set(dj.map((row) => row.stageLabel)).size, 2);
  assert.match(rows.find((row) => names.get(row.artistId) === "忘れらんねえよ").note, /翌10\/11 04:20/);
});


test("September 23 updates distinguish side programs, repeat-day art, and ticket scope", async () => {
  const { artists, performances, festivals, travelItems } = await import("../app/data.ts");
  const names = new Map(artists.map((row) => [row.id, row.name]));
  const roster = (id) => performances.filter((row) => row.festivalId === id);
  const karatsu = roster("festival_karatsu_drop_fes_2026");
  const rookie = karatsu.filter((row) => names.get(row.artistId) === "柚");
  assert.equal(rookie.length, 1);
  assert.equal(rookie[0].dateLabel, "9/27");
  assert.equal(rookie[0].stageLabel, "唐津ルーキーステージ");
  assert.match(rookie[0].note, /精確時刻待確認/);
  assert.equal(karatsu.filter((row) => /\d{2}:\d{2} 起/.test(row.note ?? "")).length, 22);
  const ringo = roster("festival_ringo_ongakusai_2026");
  for (const name of ["しろぎさび", "emi tanaj"]) {
    const rows = ringo.filter((row) => names.get(row.artistId) === name);
    assert.deepEqual(new Set(rows.map((row) => row.dateLabel)), new Set(["9/26", "9/27"]));
    assert.equal(rows.length, 2);
    assert.equal(new Set(rows.map((row) => row.artistId)).size, 1);
    assert.ok(rows.every((row) => row.stageLabel === "すいかステージ"));
  }
  for (const name of ["POP CHICKS", "YUSUKE KASAI"]) {
    assert.equal(ringo.filter((row) => names.get(row.artistId) === name).length, 1);
  }
  const urban = roster("festival_sbi_music_circus_hokkaido_2026").filter((row) => row.stageLabel === "URBAN SPORTS");
  assert.equal(urban.length, 5);
  assert.ok(urban.every((row) => /個別時刻待公布/.test(row.note)));
  const shinjuku = festivals.find((row) => row.id === "festival_tokyo_calling_2026_2");
  const shibuya = festivals.find((row) => row.id === "festival_tokyo_calling_2026_3");
  assert.match(shinjuku.description, /9\/26新宿一般票標為予定枚数終了/);
  assert.match(shibuya.description, /渋谷9\/27一般票已列販売終了/);
  assert.equal(roster("festival_bshop_fes_2026").length, 10);
  assert.ok(!roster("festival_bshop_fes_2026").some((row) => names.get(row.artistId) === "zzz365"));
  assert.match(travelItems.find((row) => row.id === "festival_bshop_fes_2026_clothes").description, /zzz365取消出店/);
});

test("September 24 timetables preserve daily appearances and early opening acts", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((row) => [row.id, row.name]));
  const roster = (slug) => performances.filter((row) => row.festivalId === `festival_${slug}_2026`);
  const kishidan = roster("kishidan_banpaku");
  assert.equal(kishidan.length, 30);
  assert.ok(kishidan.every((row) => /^(YASSAI|MOSSAI) STAGE$/.test(row.stageLabel) && /^\d{2}:\d{2} 起/.test(row.note)));
  const host = kishidan.filter((row) => names.get(row.artistId) === "氣志團");
  assert.deepEqual(host.map((row) => row.dateLabel), ["11/7", "11/8"]);
  assert.ok(host.every((row) => /19:50/.test(row.note)));
  assert.equal(new Set(host.map((row) => row.artistId)).size, 1);
  const welcome = kishidan.filter((row) => /WELCOME ACT/.test(row.note));
  assert.equal(welcome.length, 2);
  assert.ok(welcome.every((row) => row.stageLabel === "MOSSAI STAGE" && /09:45/.test(row.note)));
  const starry = roster("starrymusic");
  assert.equal(starry.length, 22);
  assert.ok(starry.every((row) => /^(SORA|DAICHI) STAGE$/.test(row.stageLabel) && /^\d{2}:\d{2} 起/.test(row.note)));
  const opening = starry.find((row) => names.get(row.artistId) === "No.4");
  assert.equal(opening.dateLabel, "10/11");
  assert.match(opening.note, /10:30.*Opening Act/);
  const uto = roster("uto_rock_festival");
  assert.equal(uto.length, 2);
  assert.deepEqual(new Set(uto.map((row) => names.get(row.artistId))), new Set(["NOBU", "Takuya Nagabuchi"]));
  assert.ok(uto.every((row) => row.dateLabel === "11/14" && row.stageLabel === undefined));
  assert.match(uto.find((row) => names.get(row.artistId) === "Takuya Nagabuchi").note, /長渕剛カヴァーアーティスト/);
});

test("September 24 ticket updates distinguish parking sellout from admission", async () => {
  const { festivals, travelItems } = await import("../app/data.ts");
  const festival = (slug) => festivals.find((row) => row.id === `festival_${slug}_2026`);
  assert.match(festival("be_wonderful").description, /11\/1停車票已達予定枚数終了.*11\/1入場票仍販売期間中/);
  assert.match(festival("meli_melo_osaka").description, /SOLD OUT.*11\/8.*11\/7–11\/8免費市集仍可逛/);
  const parking = travelItems.find((row) => row.id === "festival_this_fes_2026_transport");
  assert.match(parking.description, /抽選申請不是已取得車位/);
  assert.ok(parking.links.some((link) => link.href === "https://eplus.jp/thisfes26-parking/"));
  const karatsu = travelItems.find((row) => row.id === "festival_karatsu_drop_fes_2026_transport");
  assert.match(karatsu.description, /9\/26 08:00–22:30.*9\/27 08:00–21:00/);
});

test("September 25 replacements retain cancellation history without importing the extra show", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((row) => [row.id, row.name]));
  const argument = performances.filter((row) => row.festivalId === "festival_argument_2026");
  assert.equal(argument.length, 15);
  const cancelled = argument.filter((row) => /出演取消/.test(row.note ?? ""));
  assert.equal(cancelled.length, 1);
  assert.equal(names.get(cancelled[0].artistId), "pageninetynine");
  const replacement = argument.filter((row) => names.get(row.artistId) === "We Lost The Sea");
  assert.equal(replacement.length, 1);
  assert.equal(replacement[0].dateLabel, "10/25");
  assert.equal(replacement[0].stageLabel, undefined);
  assert.ok(!argument.some((row) => names.get(row.artistId) === "heaven in her arms"));
  assert.match(argument.find((row) => names.get(row.artistId) === "envy").note, /25周年.*SPECIAL SET/);
  const musubi = performances.filter((row) => row.festivalId === "festival_yumebanchi_fes_2026");
  assert.equal(musubi.filter((row) => row.dateLabel === "12/12").length, 5);
  assert.equal(musubi.filter((row) => row.dateLabel === "12/13").length, 5);
  for (const name of ["Novelbright", "マカロニえんぴつ"]) {
    assert.equal(musubi.filter((row) => names.get(row.artistId) === name && row.dateLabel === "12/12").length, 1);
    assert.equal(artists.filter((row) => row.name === name).length, 1);
  }
});

test("September 25 attendee guidance separates ticket and access exceptions", async () => {
  const { festivals, travelItems } = await import("../app/data.ts");
  const description = (slug) => festivals.find((row) => row.id === `festival_${slug}_2026`).description;
  assert.match(description("june_rock_fes"), /第一部結束離場.*第二部換場再入場不重收drink費/);
  assert.match(description("izumoo_rochi"), /DAY2前售アリーナ席原已售罄.*機材開放席/);
  assert.match(description("www"), /9\/26 12:00.*開始受付/);
  const food = travelItems.find((row) => row.id === "festival_ffkt_izu_shirahama_2026_food");
  assert.match(food.description, /1F演奏區僅能帶入場內.*不能帶外食/);
  const bus = travelItems.find((row) => row.id === "festival_ringo_ongakusai_2026_transport");
  assert.match(bus.description, /公園返程末班18:23.*不同於音樂祭接駁/);
});

test("a cancelled festival day preserves the roster without cancelling the following day", async () => {
  const { festivals, performances, travelItems } = await import("../app/data.ts");
  const id = "festival_karatsu_drop_fes_2026";
  const festival = festivals.find((row) => row.id === id);
  const rows = performances.filter((row) => row.festivalId === id);
  const cancelled = rows.filter((row) => row.dateLabel === "9/26");
  const nextDay = rows.filter((row) => row.dateLabel === "9/27");
  assert.equal(cancelled.length, 11);
  assert.ok(cancelled.every((row) => /9\/26公演取消/.test(row.note)));
  assert.equal(nextDay.length, 12);
  assert.ok(nextDay.every((row) => !/取消/.test(row.note ?? "")));
  assert.match(festival.description, /9\/26持票者.*9\/27入場.*退費.*待/);
  assert.ok(travelItems.filter((row) => row.relatedFestivalIds.includes(id)).every((row) => /9\/26公演.*取消/.test(row.description)));
});

test("offsite programs and undated DJ announcements keep distinct venue and date semantics", async () => {
  const { artists, performances } = await import("../app/data.ts");
  const names = new Map(artists.map((row) => [row.id, row.name]));
  const dj = performances.filter((row) => row.festivalId === "festival_be_wonderful_2026" && row.stageLabel === "DJ STAGE");
  assert.equal(dj.length, 4);
  assert.equal(new Set(dj.map((row) => row.artistId)).size, 4);
  assert.ok(dj.every((row) => row.dateLabel === "出演日未定"));
  const special = performances.filter((row) => row.festivalId === "festival_sabae_jazz_2026" && /サバエ・シティーホテル/.test(row.stageLabel ?? ""));
  assert.deepEqual(new Set(special.map((row) => names.get(row.artistId))), new Set(["たっくー", "午前2時"]));
  assert.ok(special.every((row) => row.dateLabel === "10/11" && /15:00/.test(row.note)));
});


test("a cancelled offsite workshop does not cancel the other class or the main festival", async () => {
  const { artists, performances, travelItems } = await import("../app/data.ts");
  const activity = travelItems.find((row) => row.id === "festival_ringo_ongakusai_2026_leisure_20260909");
  assert.match(activity.description, /THE D SoraKi初級工作坊已.*取消/);
  assert.match(activity.description, /19:00–20:00 BOXER × 松下マサナオ RHYTHM × DANCE WORKSHOP照常/);
  assert.ok(activity.links.some((link) => link.href.includes("/media/9-28")));
  const soraki = artists.find((row) => row.name === "THE D SoraKi");
  assert.ok(soraki);
  const main = performances.filter((row) => row.festivalId === "festival_ringo_ongakusai_2026" && row.artistId === soraki.id);
  assert.ok(main.length > 0);
  assert.ok(main.every((row) => !/取消/.test(row.note ?? "")));
});

test("Magrock records its announced guest without duplicating an existing act", async () => {
  const { artists, festivals, performances } = await import("../app/data.ts");
  const id = "festival_magrock_pop_2026";
  const names = new Map(artists.map((row) => [row.id, row.name]));
  const ska = performances.find((row) => row.festivalId === id && names.get(row.artistId) === "東京スカパラダイスオーケストラ");
  assert.match(ska.note, /スチャダラパー.*GUEST/);
  assert.equal(performances.filter((row) => row.festivalId === id && names.get(row.artistId) === "スチャダラパー").length, 1);
  assert.match(festivals.find((row) => row.id === id).description, /所有票種已售罄.*不再追加販售/);
  assert.match(festivals.find((row) => row.id === id).description, /パルちゃん.*K-MIX 公開訪談/);
});

test("LIVE AZUMA keeps official cloak limits separate from the market guidance", async () => {
  const { travelItems } = await import("../app/data.ts");
  const clothing = travelItems.find((row) => row.id === "festival_live_azuma5th_2026_clothes");
  assert.match(clothing.description, /兩日均9:00–21:00.*每口1,000円.*45L袋/);
  assert.ok(clothing.links.some((link) => link.href === "https://liveazuma.jp/news/2026/10/10/8131/"));
});
