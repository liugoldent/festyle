# Festyle

日本音樂祭與專場指南。使用者可以依年份、地區及演出類型瀏覽月份時間軸，從官方連結確認各場演出資訊。

## Current MVP

- 月份時間軸：1 月到 12 月，每個月份可放多個音樂祭
- 專場：`app/concerts2027.ts` 收錄 AiNA THE END 與 ZUTOMAYO 2027 日本巡演，每場各有日期、會場、開場／開演時間及官方連結
- 演出類型篩選：左下角「顯示」按鈕可切換全部、音樂祭、專場；專場使用天空藍卡片和獨立專頁
- 自動定位：開啟網站後會捲到當前月份
- 月份快速導航：桌面右側與手機上方皆可跳轉月份
- 京都大作戦範例：7 月音樂祭卡片
- NUMBER SHOT2026 範例：8 月福岡音樂祭卡片與官方連結
- 2026 音樂祭資料：包含 BLARE FEST.、DEAD POP FESTiVAL、JAPAN JAM、ROCK IN JAPAN FESTIVAL、1CHANCE FESTIVAL、OSAKA HAZIKETEMAZARE FESTIVAL、What a Wonderful World!!26 與官方出演名單
- 探索面板：京都 / 宇治 / 滋賀 / 琵琶湖，以及福岡 / 百道 / PayPay Dome / 地行浜ビーチ地區地圖
- 食衣住行樂：把各音樂祭的吃、穿、住、交通、玩法串成可挖掘內容，交通卡片含官方 Access 與地圖連結
- 出演者清單：在音樂祭詳情中點選藝人，會以彈窗反查這位藝人未來會參加哪些音樂祭
- 相似音樂祭：依月份、場地型態與音樂風格計算，並在每張推薦卡片標明原因
- Tags：只由地區、旅遊與音樂祭屬性產生，不把表演者名稱或資料轉成 tag

## Data Model

核心資料放在 `app/data.ts`：

- `Festival`：時間軸演出資料；`kind: "concert"` 表示專場，其餘為音樂祭。包含月份、會場、官網、官方售票資訊與相關地區
- `Artist`：表演者本體，包含名稱與摘要
- `Performance`：出演紀錄，把藝人和音樂祭串起來，支援藝人反查未來場次
- `Area`：都道府縣、城市、地區或景點
- `TravelItem`：食衣住行樂內容，可帶官方網站或地圖連結
- `TravelCategory`：`food`、`clothes`、`stay`、`transport`、`fun`

第一版資料先用 TypeScript 檔維護。等資料量變大，再把同樣模型搬到 Supabase Postgres / Drizzle。

## Development

```bash
npm install
npm run dev
npm run build
```

The project uses Next.js, React, TypeScript, Tailwind CSS, vinext, and the OpenAI Sites-compatible build setup.

## Netlify deployment

Live site: https://festyle-jp.netlify.app

SEO metadata、canonical、robots.txt、sitemap.xml 與各音樂祭／專場專頁共用 `app/site.ts` 的正式網址。若改用自訂網域，請先更新該常數，再重新部署並將 `/sitemap.xml` 提交至 Google Search Console。

Connect the `liugoldent/festyle` GitHub repository to Netlify. The checked-in `netlify.toml` uses Node.js 22, runs `npm run build:netlify`, and publishes the static `out/` directory. Pushes to the connected production branch trigger a new deploy.

The existing `npm run build` command remains the vinext/Cloudflare build.
