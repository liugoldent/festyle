import FestivalExplorer from "./FestivalExplorer";
import { siteUrl } from "./site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Festyle",
      inLanguage: "zh-Hant",
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: "Festyle | 2026・2027 日本音樂祭指南",
      description:
        "依年份、月份與地區探索日本音樂祭日期、地點、演出陣容、售票資訊及周邊旅行提案。",
      inLanguage: "zh-Hant",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@type": "Thing", name: "日本音樂祭" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <FestivalExplorer />
    </>
  );
}
