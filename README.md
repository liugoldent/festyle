# Festyle

日本音樂祭探索工具。第一版以音樂祭為主入口，讓使用者從 1 月到 12 月瀏覽音樂祭，再一路挖到城市、地區、食衣住行樂與相關 tag。

## Current MVP

- 月份時間軸：1 月到 12 月，每個月份可放多個音樂祭
- 自動定位：開啟網站後會捲到當前月份
- 月份快速導航：桌面右側與手機上方皆可跳轉月份
- 京都大作戦範例：7 月音樂祭卡片
- NUMBER SHOT2026 範例：8 月福岡音樂祭卡片與官方連結
- 探索面板：京都 / 宇治 / 滋賀 / 琵琶湖，以及福岡 / 百道 / PayPay Dome / 地行浜ビーチ地區地圖
- 食衣住行樂：把宇治、琵琶湖、福岡與百道的吃、穿、住、交通、玩法串成可挖掘內容
- Tags：由結構化資料產生 hashtag，避免未來只靠字串維護

## Data Model

核心資料放在 `app/data.ts`：

- `Festival`：音樂祭本體，包含月份、會場、類型、相關地區與旅遊分類
- `Area`：都道府縣、城市、地區或景點
- `TravelItem`：食衣住行樂內容
- `TravelCategory`：`food`、`clothes`、`stay`、`transport`、`fun`

第一版資料先用 TypeScript 檔維護。等資料量變大，再把同樣模型搬到 Supabase Postgres / Drizzle。

## Development

```bash
npm install
npm run dev
npm run build
```

The project uses Next.js, React, TypeScript, Tailwind CSS, vinext, and the OpenAI Sites-compatible build setup.
