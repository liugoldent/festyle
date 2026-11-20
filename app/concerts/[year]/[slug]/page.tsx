import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { festivals, getArea } from "../../../data";

type ConcertParams = { year: string; slug: string };

function findConcert({ year, slug }: ConcertParams) {
  return festivals.find((event) => event.kind === "concert" && event.year === Number(year) && event.slug === slug);
}

export function generateStaticParams(): ConcertParams[] {
  return festivals
    .filter((event) => event.kind === "concert")
    .map((event) => ({ year: String(event.year), slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Promise<ConcertParams> }): Promise<Metadata> {
  const concert = findConcert(await params);
  if (!concert) return {};
  const path = `/concerts/${concert.year}/${concert.slug}/`;
  const title = `${concert.name} ${concert.dateLabel}｜專場日期、會場與售票 | Festyle`;
  const description = `${concert.artistName} ${concert.year} 年 ${concert.dateLabel} 於${concert.venue}演出。${concert.description}`;
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
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Festyle 日本音樂祭與專場指南" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function ConcertPage({ params }: { params: Promise<ConcertParams> }) {
  const concert = findConcert(await params);
  if (!concert) notFound();
  const area = getArea(concert.cityId);
  return (
    <main className="festival-detail-page concert-detail-page">
      <div className="festival-detail-content">
        <Link className="festival-detail-back" href="/">← 返回日本音樂祭與專場指南</Link>
        <p className="festival-detail-kicker">Festyle / {concert.year} Japan Concerts</p>
        <h1>{concert.name}</h1>
        <p className="festival-detail-lead">{concert.artistName}・{concert.description}</p>
        <dl className="festival-detail-facts">
          <div><dt>日期</dt><dd>{concert.year} 年 {concert.dateLabel}</dd></div>
          <div><dt>地區</dt><dd>{area?.name ?? "日本"}</dd></div>
          <div><dt>會場</dt><dd>{concert.venue}</dd></div>
        </dl>
        <div className="festival-detail-links">
          <a href={concert.officialUrl} target="_blank" rel="noreferrer">官方巡演資訊 ↗</a>
          <a href={concert.ticketUrl} target="_blank" rel="noreferrer">官方售票資訊 ↗</a>
        </div>
        <section className="festival-detail-performers" aria-labelledby="performer-heading">
          <h2 id="performer-heading">演出者</h2>
          <p>{concert.artistName}。實際開演時間與票務請以官方公告為準。</p>
        </section>
      </div>
    </main>
  );
}
