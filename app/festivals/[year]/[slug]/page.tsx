import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { festivals, getArea, getPerformersForFestival } from "../../../data";

type FestivalParams = { year: string; slug: string };

function findFestival({ year, slug }: FestivalParams) {
  return festivals.find((festival) => festival.kind !== "concert" && festival.year === Number(year) && festival.slug === slug);
}

export function generateStaticParams(): FestivalParams[] {
  return festivals.filter((festival) => festival.kind !== "concert").map((festival) => ({ year: String(festival.year), slug: festival.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FestivalParams>;
}): Promise<Metadata> {
  const festival = findFestival(await params);
  if (!festival) return {};

  const path = `/festivals/${festival.year}/${festival.slug}/`;
  const title = `${festival.name}｜日期、地點與演出陣容 | Festyle`;
  const description = `${festival.name}：${festival.dateLabel}於${festival.venue}舉行。${festival.description}`
    .replace(/\s+/g, " ")
    .slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "zh_TW",
      url: path,
      siteName: "Festyle",
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Festyle 日本音樂祭指南" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function FestivalPage({
  params,
}: {
  params: Promise<FestivalParams>;
}) {
  const festival = findFestival(await params);
  if (!festival) notFound();

  const city = getArea(festival.cityId);
  const performers = getPerformersForFestival(festival);
  const performerNames = Array.from(new Set(performers.map(({ artist }) => artist.name)));

  return (
    <main className="festival-detail-page">
      <div className="festival-detail-content">
        <Link className="festival-detail-back" href="/">← 返回日本音樂祭與專場指南</Link>
        <p className="festival-detail-kicker">Festyle / {festival.year} Japan Music Festivals</p>
        <h1>{festival.name}</h1>
        <p className="festival-detail-lead">{festival.description}</p>

        <dl className="festival-detail-facts">
          <div><dt>日期</dt><dd>{festival.year} 年 {festival.dateLabel}</dd></div>
          <div><dt>地區</dt><dd>{city?.name ?? "日本"}</dd></div>
          <div><dt>會場</dt><dd>{festival.venue}</dd></div>
        </dl>

        <div className="festival-detail-links">
          {festival.officialUrl ? <a href={festival.officialUrl} target="_blank" rel="noreferrer">官方網站 ↗</a> : null}
          {festival.ticketUrl ? <a href={festival.ticketUrl} target="_blank" rel="noreferrer">官方售票資訊 ↗</a> : null}
        </div>

        {performerNames.length > 0 ? (
          <section className="festival-detail-performers" aria-labelledby="performer-heading">
            <h2 id="performer-heading">已公布演出陣容</h2>
            <p>演出日期及內容可能更新，請以官方公告為準。</p>
            <ul>{performerNames.map((name) => <li key={name}>{name}</li>)}</ul>
          </section>
        ) : (
          <section className="festival-detail-performers" aria-labelledby="performer-heading">
            <h2 id="performer-heading">演出陣容</h2>
            <p>目前尚未收錄已公布的演出者，請查看官方網站取得最新消息。</p>
          </section>
        )}
      </div>
    </main>
  );
}
