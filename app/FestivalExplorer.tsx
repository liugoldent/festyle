"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  Festival,
  Place,
  TravelCategory,
  categoryMeta,
  festivals,
  getArea,
  getFestival,
  getFestivalAreas,
  getFestivalTags,
  getPlacesForFestival,
  getTravelItemsForFestival,
  months,
} from "./data";

const travelCategories = Object.keys(categoryMeta) as TravelCategory[];

function groupFestivalsByMonth() {
  return months.reduce<Record<number, Festival[]>>((acc, month) => {
    acc[month] = festivals.filter((festival) => festival.month === month);
    return acc;
  }, {});
}

function getTagTarget(tag: string, festivalAreas: Area[]) {
  for (const area of festivalAreas) {
    for (const category of travelCategories) {
      if (tag === `${area.name}-${categoryMeta[category].label}`) {
        return { areaId: area.id, category };
      }
    }
  }

  return null;
}

function isContextTag(tag: string | null, area: Area | undefined, category: TravelCategory) {
  if (!tag || !area) {
    return false;
  }

  return tag === area.name || tag === `${area.name}-${categoryMeta[category].label}`;
}

function MonthLabel({ month }: { month: number }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-4xl font-black tabular-nums md:text-6xl">{month}</span>
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
        月
      </span>
    </span>
  );
}

function FestivalCard({
  festival,
  selected,
  onSelect,
}: {
  festival: Festival;
  selected: boolean;
  onSelect: () => void;
}) {
  const city = getArea(festival.cityId);
  const tags = getFestivalTags(festival).slice(0, 14);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`festival-card group text-left ${selected ? "festival-card-selected" : ""}`}
      aria-pressed={selected}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-600">
          {festival.dateLabel}
        </span>
        <span className="text-xs font-semibold text-stone-500">
          {festival.genres.join(" / ")}
        </span>
      </span>
      <span className="mt-5 block text-3xl font-black text-stone-950 md:text-5xl">
        {festival.name}
      </span>
      <span className="mt-2 block text-sm font-semibold text-stone-600">
        {city?.name} / {festival.venue}
      </span>
      <span className="mt-4 block text-base leading-7 text-stone-700">
        {festival.description}
      </span>
      <span className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white group-hover:bg-lime-300 group-hover:text-stone-950"
          >
            #{tag}
          </span>
        ))}
      </span>
    </button>
  );
}

function MonthSection({
  month,
  monthFestivals,
  selectedFestival,
  setSelectedFestival,
  setMonthRef,
}: {
  month: number;
  monthFestivals: Festival[];
  selectedFestival: Festival;
  setSelectedFestival: (festival: Festival) => void;
  setMonthRef: (month: number, node: HTMLElement | null) => void;
}) {
  return (
    <section
      id={`month-${month}`}
      ref={(node) => setMonthRef(month, node)}
      className="month-section"
      aria-labelledby={`month-${month}-heading`}
    >
      <div className="month-heading">
        <h2 id={`month-${month}-heading`}>
          <MonthLabel month={month} />
        </h2>
        <p>{monthFestivals.length > 0 ? `${monthFestivals.length} 個音樂祭` : "待新增音樂祭"}</p>
      </div>

      <div className="mt-5 grid gap-4">
        {monthFestivals.length > 0 ? (
          monthFestivals.map((festival) => (
            <FestivalCard
              key={festival.id}
              festival={festival}
              selected={selectedFestival.id === festival.id}
              onSelect={() => setSelectedFestival(festival)}
            />
          ))
        ) : (
          <div className="empty-month">
            <span className="text-sm font-bold text-stone-500">Curating</span>
            <p>這個月份還沒有放入資料。之後可以從官方日期、城市與風格慢慢補齊。</p>
          </div>
        )}
      </div>
    </section>
  );
}

function RegionalMap({
  festivalName,
  mapFeatureLabel,
  festivalAreas,
  activeArea,
  onAreaChange,
}: {
  festivalName: string;
  mapFeatureLabel: string;
  festivalAreas: Area[];
  activeArea: string;
  onAreaChange: (areaId: string) => void;
}) {
  return (
    <div className="regional-map" aria-label={`${festivalName}周邊地區圖`}>
      <div className="map-lake">{mapFeatureLabel}</div>
      <div className="map-route map-route-a" />
      <div className="map-route map-route-b" />
      {festivalAreas.map((area) => (
        <button
          key={area.id}
          type="button"
          className={`map-marker ${activeArea === area.id ? "map-marker-active" : ""}`}
          style={{ left: `${area.mapPosition.x}%`, top: `${area.mapPosition.y}%` }}
          onClick={() => onAreaChange(area.id)}
        >
          <span>{area.name}</span>
        </button>
      ))}
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="place-card">
      <div className="place-card-head">
        <div>
          <span className="place-type">{place.typeLabel}</span>
          <h3>{place.name}</h3>
        </div>
        <span className={`travel-item-category ${categoryMeta[place.category].tone}`}>
          {categoryMeta[place.category].label}
        </span>
      </div>
      <p>{place.summary}</p>
      <dl className="place-meta">
        <div>
          <dt>地區</dt>
          <dd>{place.neighborhood}</dd>
        </div>
        <div>
          <dt>適合</dt>
          <dd>{place.bestFor}</dd>
        </div>
      </dl>
      <div className="place-tags" aria-label={`${place.name} tags`}>
        {place.tags.slice(0, 5).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div className="place-links">
        {place.links.map((link) => (
          <a
            key={link.href}
            className={`place-link place-link-${link.kind}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${place.name} ${link.label}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

function DetailPanel({
  festival,
  onFestivalSelect,
}: {
  festival: Festival;
  onFestivalSelect: (festival: Festival) => void;
}) {
  const festivalAreas = getFestivalAreas(festival);
  const festivalTravelItems = getTravelItemsForFestival(festival);
  const festivalPlaces = getPlacesForFestival(festival);
  const relatedFestivals = festival.relatedFestivalIds
    .map((festivalId) => getFestival(festivalId))
    .filter((relatedFestival): relatedFestival is Festival => Boolean(relatedFestival));
  const [activeArea, setActiveArea] = useState(festival.cityId);
  const [activeCategory, setActiveCategory] = useState<TravelCategory>("fun");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activeAreaData = getArea(activeArea) ?? festivalAreas[0];
  const tags = getFestivalTags(festival);
  const selectedTagIsContext = isContextTag(selectedTag, activeAreaData, activeCategory);

  const visibleTravelItems = festivalTravelItems.filter((item) => {
    const matchesArea = item.areaId === activeArea;
    const matchesCategory = item.category === activeCategory;
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

    if (!selectedTag) {
      return matchesCategory;
    }

    if (selectedTagIsContext) {
      return matchesArea && matchesCategory;
    }

    return matchesTag;
  });

  const visiblePlaces = festivalPlaces.filter((place) => {
    const matchesArea = place.areaId === activeArea;
    const matchesCategory = place.category === activeCategory;
    const matchesTag = selectedTag ? place.tags.includes(selectedTag) : true;

    if (!selectedTag) {
      return matchesCategory;
    }

    if (selectedTagIsContext) {
      return matchesArea && matchesCategory;
    }

    return matchesTag;
  });

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      return;
    }

    const tagTarget = getTagTarget(tag, festivalAreas);
    if (tagTarget) {
      setActiveArea(tagTarget.areaId);
      setActiveCategory(tagTarget.category);
    } else {
      const taggedPlace = festivalPlaces.find((place) => place.tags.includes(tag));
      const taggedTravelItem = festivalTravelItems.find((item) => item.tags.includes(tag));
      const taggedResult = taggedPlace ?? taggedTravelItem;

      if (taggedResult) {
        setActiveArea(taggedResult.areaId);
        setActiveCategory(taggedResult.category);
      }
    }

    setSelectedTag(tag);
  };

  return (
    <aside className="detail-panel" aria-label={`${festival.name}探索面板`}>
      <div className="detail-kicker">Festival Focus</div>
      <h2 className="mt-2 text-3xl font-black text-stone-950 md:text-4xl">
        {festival.name}
      </h2>
      <p className="mt-3 leading-7 text-stone-700">{festival.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="fact-box">
          <dt>月份</dt>
          <dd>{festival.dateLabel}</dd>
        </div>
        <div className="fact-box">
          <dt>會場</dt>
          <dd>{festival.venue}</dd>
        </div>
      </dl>
      {festival.officialUrl ? (
        <a
          className="official-link"
          href={festival.officialUrl}
          target="_blank"
          rel="noreferrer"
        >
          官方網站
        </a>
      ) : null}

      <section className="mt-7" aria-labelledby="map-heading">
        <div className="section-label" id="map-heading">
          周邊地圖
        </div>
        <RegionalMap
          festivalName={festival.name}
          mapFeatureLabel={festival.mapFeatureLabel}
          festivalAreas={festivalAreas}
          activeArea={activeArea}
          onAreaChange={(areaId) => {
            setActiveArea(areaId);
            setSelectedTag(null);
          }}
        />
        {activeAreaData ? (
          <p className="mt-3 text-sm leading-6 text-stone-600">{activeAreaData.summary}</p>
        ) : null}
      </section>

      <section className="mt-7" aria-labelledby="travel-heading">
        <div className="section-label" id="travel-heading">
          食衣住行樂
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {travelCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button ${activeCategory === category ? "category-button-active" : ""}`}
              onClick={() => {
                setActiveCategory(category);
                setSelectedTag(null);
              }}
            >
              <span>{categoryMeta[category].label}</span>
              <small>{categoryMeta[category].title}</small>
            </button>
          ))}
        </div>

        <div className="travel-context">
          <div>
            <span>查看</span>
            <strong>
              {activeAreaData?.name ?? "周邊"} / {categoryMeta[activeCategory].title}
            </strong>
          </div>
          {selectedTag ? (
            <button
              type="button"
              className="selected-tag-clear"
              onClick={() => setSelectedTag(null)}
              aria-label={`清除 ${selectedTag} tag`}
            >
              #{selectedTag} 清除
            </button>
          ) : (
            <small>{visiblePlaces.length + visibleTravelItems.length} 筆</small>
          )}
        </div>

        <div className="mt-4 grid gap-3">
          {visiblePlaces.length > 0 ? (
            <div className="place-results">
              <div className="place-results-heading">
                <div>
                  <span>店家候選</span>
                  <strong>
                    {activeAreaData?.name ?? "周邊"}・{categoryMeta[activeCategory].title}
                  </strong>
                </div>
                <small>{visiblePlaces.length} spots</small>
              </div>
              <div className="grid gap-3">
                {visiblePlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </div>
          ) : null}

          {visibleTravelItems.length > 0 ? (
            <div className="grid gap-3">
              {visibleTravelItems.map((item) => (
              <article key={item.id} className="travel-item">
                <span
                  className={`travel-item-category ${categoryMeta[item.category].tone}`}
                >
                  {categoryMeta[item.category].label}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
              ))}
            </div>
          ) : (
            visiblePlaces.length === 0 ? (
              <div className="travel-empty">
              這個交叉點還沒有內容，可以之後補成店家、住宿、交通或玩法清單。
              </div>
            ) : null
          )}
        </div>
      </section>

      <section className="mt-7" aria-labelledby="tag-heading">
        <div className="section-label" id="tag-heading">
          可挖掘 Tags
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip ${selectedTag === tag ? "tag-chip-active" : ""}`}
              onClick={() => handleTagSelect(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {relatedFestivals.length > 0 ? (
        <section className="mt-7" aria-labelledby="related-heading">
          <div className="section-label" id="related-heading">
            關聯音樂祭
          </div>
          <div className="mt-3 grid gap-2">
            {relatedFestivals.map((relatedFestival) => (
              <button
                key={relatedFestival.id}
                type="button"
                className="related-festival"
                onClick={() => onFestivalSelect(relatedFestival)}
              >
                <span>{relatedFestival.name}</span>
                <small>{relatedFestival.dateLabel}</small>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}

export default function FestivalExplorer() {
  const monthRefs = useRef<Record<number, HTMLElement | null>>({});
  const byMonth = useMemo(() => groupFestivalsByMonth(), []);
  const [selectedFestival, setSelectedFestival] = useState(festivals[0]);
  const [activeMonth, setActiveMonth] = useState(7);

  const setMonthRef = (month: number, node: HTMLElement | null) => {
    monthRefs.current[month] = node;
  };

  const scrollToMonth = (month: number) => {
    setActiveMonth(month);
    monthRefs.current[month]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const frame = window.requestAnimationFrame(() => scrollToMonth(currentMonth));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1e7] text-stone-950">
      <div className="site-header">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-700">
            Festyle
          </p>
          <h1>日本音樂祭探索工具</h1>
        </div>
        <p>
          先用月份找到音樂祭，再從城市、地區、食衣住行樂與 tag 往下挖。
        </p>
      </div>

      <nav className="mobile-month-nav" aria-label="月份快速導航">
        {months.map((month) => (
          <button
            key={month}
            type="button"
            className={activeMonth === month ? "month-pill-active" : ""}
            onClick={() => scrollToMonth(month)}
          >
            {month}月
          </button>
        ))}
      </nav>

      <div className="app-layout">
        <div className="timeline-column">
          {months.map((month) => (
            <MonthSection
              key={month}
              month={month}
              monthFestivals={byMonth[month]}
              selectedFestival={selectedFestival}
              setSelectedFestival={(festival) => {
                setSelectedFestival(festival);
                setActiveMonth(festival.month);
              }}
              setMonthRef={setMonthRef}
            />
          ))}
        </div>

        <div className="right-rail">
          <nav className="desktop-month-nav" aria-label="月份快速導航">
            {months.map((month) => (
              <button
                key={month}
                type="button"
                className={activeMonth === month ? "month-dot-active" : ""}
                onClick={() => scrollToMonth(month)}
                aria-label={`前往 ${month} 月`}
              >
                {month}
              </button>
            ))}
          </nav>
          <DetailPanel
            key={selectedFestival.id}
            festival={selectedFestival}
            onFestivalSelect={(festival) => {
              setSelectedFestival(festival);
              scrollToMonth(festival.month);
            }}
          />
        </div>
      </div>
    </main>
  );
}
