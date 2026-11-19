"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  Artist,
  ArtistFestivalPerformance,
  Festival,
  FestivalPerformer,
  Place,
  TravelCategory,
  categoryMeta,
  artists,
  festivals,
  getArea,
  getArtist,
  getArtistPerformances,
  getFestivalSortDate,
  getFestivalAreas,
  getFestivalTags,
  getPerformersForFestival,
  getPlacesForFestival,
  getSimilarFestivals,
  getTravelItemsForFestival,
  months,
} from "./data";

const travelCategories = Object.keys(categoryMeta) as TravelCategory[];
const initialPerformerCount = 12;

type AreaFilterOption = {
  id: string;
  name: string;
  festivalCount: number;
};

type GlobalPerformerResult = {
  artist: Artist;
  festival: Festival;
  performances: ArtistFestivalPerformance[];
};

function groupFestivalsByMonth(source: Festival[]) {
  return months.reduce<Record<number, Festival[]>>((acc, month) => {
    acc[month] = source
      .filter((festival) => festival.month === month)
      .sort(
        (left, right) =>
          getFestivalSortDate(left).localeCompare(getFestivalSortDate(right)) ||
          left.name.localeCompare(right.name, "ja"),
      );
    return acc;
  }, {});
}

function getFestivalPrefectures(festival: Festival) {
  return getFestivalAreas(festival).filter((area) => area.type === "prefecture");
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

function GlobalPerformerSearch({
  onFestivalSelect,
}: {
  onFestivalSelect: (festival: Festival) => void;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const resultMap = new Map<string, GlobalPerformerResult>();
    const matchingArtists = artists.filter((artist) =>
      [artist.name, artist.nameJa]
        .filter(Boolean)
        .some((name) => name?.toLocaleLowerCase().includes(normalizedQuery)),
    );

    for (const artist of matchingArtists) {
      for (const performance of getArtistPerformances(artist.id)) {
        const resultKey = `${artist.id}:${performance.festival.id}`;
        const existingResult = resultMap.get(resultKey);

        if (existingResult) {
          existingResult.performances.push(performance);
        } else {
          resultMap.set(resultKey, {
            artist,
            festival: performance.festival,
            performances: [performance],
          });
        }
      }
    }

    return Array.from(resultMap.values()).sort(
      (left, right) =>
        getFestivalSortDate(left.festival).localeCompare(
          getFestivalSortDate(right.festival),
        ) ||
        left.artist.name.localeCompare(right.artist.name),
    );
  }, [normalizedQuery]);

  const resultsByMonth = useMemo(() => {
    return results.reduce<Map<number, GlobalPerformerResult[]>>((groups, result) => {
      const monthResults = groups.get(result.festival.month) ?? [];
      monthResults.push(result);
      groups.set(result.festival.month, monthResults);
      return groups;
    }, new Map());
  }, [results]);

  const matchedArtistCount = new Set(results.map((result) => result.artist.id)).size;

  return (
    <section className="global-performer-search" aria-labelledby="global-search-heading">
      <div className="global-search-copy">
        <span>Artist Finder</span>
        <h2 id="global-search-heading">全站搜尋表演人員</h2>
        <p>輸入藝人名稱，查看他在哪幾月參加哪些音樂祭。</p>
      </div>

      <label className="global-search-input">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">搜尋全站表演人員</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：10-FEET、あいみょん"
          autoComplete="off"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="清除表演人員搜尋">
            ×
          </button>
        ) : null}
      </label>

      {normalizedQuery ? (
        <div className="global-search-results">
          {results.length > 0 ? (
            <>
              <p className="global-search-summary" role="status">
                找到 {matchedArtistCount} 位表演人員，共參加 {results.length} 個音樂祭
              </p>
              <div className="global-search-months">
                {Array.from(resultsByMonth.entries()).map(([month, monthResults]) => (
                  <section key={month} className="global-search-month-group">
                    <div className="global-search-month-label">
                      <strong>{month}</strong>
                      <span>月</span>
                    </div>
                    <div className="global-search-result-list">
                      {monthResults.map((result) => (
                        <button
                          key={`${result.artist.id}:${result.festival.id}`}
                          type="button"
                          className="global-search-result-card"
                          onClick={() => {
                            onFestivalSelect(result.festival);
                            setQuery("");
                          }}
                        >
                          <span className="global-result-artist">{result.artist.name}</span>
                          <strong>{result.festival.name}</strong>
                          <small>
                            {result.performances
                              .map(
                                (performance) =>
                                  `${performance.dateLabel ?? result.festival.dateLabel}${
                                    performance.stageLabel ? `・${performance.stageLabel}` : ""
                                  }${performance.note ? `・${performance.note}` : ""}`,
                              )
                              .join(" / ")}
                          </small>
                          <span className="global-result-action">查看音樂祭 →</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="global-search-empty" role="status">
              找不到「{query.trim()}」的演出紀錄，請試試其他藝人名稱。
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
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
      id={`festival-card-${festival.id}`}
      type="button"
      onClick={onSelect}
      className={`festival-card group text-left ${selected ? "festival-card-selected" : ""}`}
      aria-pressed={selected}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-600">
          {festival.year} / {festival.dateLabel}
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
            <div key={festival.id} className="festival-card-entry">
              <FestivalCard
                festival={festival}
                selected={selectedFestival.id === festival.id}
                onSelect={() => setSelectedFestival(festival)}
              />
              <Link href={`/festivals/${festival.year}/${festival.slug}/`}>
                查看 {festival.name} 專頁 →
              </Link>
            </div>
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

function PerformerButton({
  performer,
  selected,
  onSelect,
}: {
  performer: FestivalPerformer;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`performer-card ${selected ? "performer-card-active" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span>{performer.artist.name}</span>
      <small>
        {performer.dateLabel ?? "date tbd"}
        {performer.stageLabel ? ` / ${performer.stageLabel}` : ""}
        {performer.note ? ` / ${performer.note}` : ""}
      </small>
    </button>
  );
}

function PerformerList({
  performers,
  selectedArtistId,
  onArtistSelect,
}: {
  performers: FestivalPerformer[];
  selectedArtistId: string | null;
  onArtistSelect: (artistId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredPerformers = normalizedQuery
    ? performers.filter((performer) =>
        [performer.artist.name, performer.artist.nameJa]
          .filter(Boolean)
          .some((name) => name?.toLocaleLowerCase().includes(normalizedQuery)),
      )
    : performers;
  const visiblePerformers =
    normalizedQuery || showAll
      ? filteredPerformers
      : filteredPerformers.slice(0, initialPerformerCount);
  const hiddenCount = performers.length - initialPerformerCount;

  return (
    <section className="mt-7" aria-labelledby="performer-heading">
      <div className="performer-heading">
        <div>
          <div className="section-label" id="performer-heading">
            出演者清單
          </div>
          <p>{performers.length} 筆演出</p>
        </div>
        <label className="performer-search">
          <span className="sr-only">搜尋表演人員</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋表演人員"
            autoComplete="off"
          />
        </label>
      </div>

      {normalizedQuery ? (
        <p className="performer-result-status" role="status">
          找到 {filteredPerformers.length} 筆符合「{query.trim()}」的演出
        </p>
      ) : null}

      {visiblePerformers.length > 0 ? (
        <div className="performer-grid">
          {visiblePerformers.map((performer) => (
            <PerformerButton
              key={performer.id}
              performer={performer}
              selected={selectedArtistId === performer.artist.id}
              onSelect={() => onArtistSelect(performer.artist.id)}
            />
          ))}
        </div>
      ) : (
        <div className="performer-empty">
          {performers.length === 0 && !normalizedQuery
            ? "目前尚未收錄官方已公布的演出者，請查看官方網站最新公告。"
            : "找不到符合的表演人員，請試試其他藝人名稱。"}
        </div>
      )}

      {!normalizedQuery && hiddenCount > 0 ? (
        <button
          type="button"
          className="performer-toggle"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
        >
          {showAll ? "收合藝人" : `查看更多藝人（還有 ${hiddenCount} 筆）`}
          <span aria-hidden="true">{showAll ? "↑" : "↓"}</span>
        </button>
      ) : null}
    </section>
  );
}

function ArtistFestivalCard({
  performance,
  onFestivalSelect,
}: {
  performance: ArtistFestivalPerformance;
  onFestivalSelect: (festival: Festival) => void;
}) {
  const city = getArea(performance.festival.cityId);

  return (
    <button
      type="button"
      className="artist-festival-card"
      onClick={() => onFestivalSelect(performance.festival)}
    >
      <span>{performance.festival.name}</span>
      <small>
        {performance.festival.dateLabel}
        {city ? `・${city.name}` : ""} / {performance.festival.venue}
      </small>
      {performance.stageLabel || performance.note ? (
        <em>
          {performance.stageLabel ?? ""}
          {performance.note ? `${performance.stageLabel ? " / " : ""}${performance.note}` : ""}
        </em>
      ) : null}
    </button>
  );
}

function ArtistModal({
  artist,
  performances,
  onFestivalSelect,
  onClose,
}: {
  artist: Artist;
  performances: ArtistFestivalPerformance[];
  onFestivalSelect: (festival: Festival) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="artist-modal-backdrop" onMouseDown={onClose}>
      <div
        className="artist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`artist-modal-${artist.id}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="artist-modal-close"
          onClick={onClose}
          aria-label="關閉演出者資訊"
          autoFocus
        >
          ×
        </button>
        <div className="artist-focus-head">
          <div>
            <span>Artist Focus</span>
            <h3 id={`artist-modal-${artist.id}`}>{artist.name}</h3>
          </div>
          <small>{performances.length} upcoming</small>
        </div>
        <p>{artist.summary}</p>

        <div className="artist-upcoming">
          <div className="artist-upcoming-heading">
            <span>未來參加音樂祭</span>
          </div>
          {performances.length > 0 ? (
            <div className="grid gap-2">
              {performances.map((performance) => (
                <ArtistFestivalCard
                  key={performance.id}
                  performance={performance}
                  onFestivalSelect={onFestivalSelect}
                />
              ))}
            </div>
          ) : (
            <div className="artist-empty">
              目前資料庫沒有登錄未來場次，可以等官方名單公布後再補進出演紀錄。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({
  festival,
  onFestivalSelect,
  isSummaryCollapsed,
  onSummaryCollapsedChange,
}: {
  festival: Festival;
  onFestivalSelect: (festival: Festival) => void;
  isSummaryCollapsed: boolean;
  onSummaryCollapsedChange: (collapsed: boolean) => void;
}) {
  const festivalAreas = getFestivalAreas(festival);
  const festivalTravelItems = getTravelItemsForFestival(festival);
  const festivalPlaces = getPlacesForFestival(festival);
  const festivalPerformers = getPerformersForFestival(festival);
  const similarFestivals = getSimilarFestivals(festival);
  const [activeArea, setActiveArea] = useState(festival.cityId);
  const [activeCategory, setActiveCategory] = useState<TravelCategory>("fun");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const activeAreaData = getArea(activeArea) ?? festivalAreas[0];
  const tags = getFestivalTags(festival);
  const selectedTagIsContext = isContextTag(selectedTag, activeAreaData, activeCategory);
  const selectedArtist = selectedArtistId ? getArtist(selectedArtistId) : undefined;
  const selectedArtistPerformances = selectedArtist
    ? getArtistPerformances(selectedArtist.id, { upcomingOnly: true })
    : [];

  const visibleTravelItems = festivalTravelItems.filter((item) => {
    const matchesArea = item.areaId === activeArea;
    const matchesCategory = item.category === activeCategory;
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

    if (!selectedTag) {
      return matchesArea && matchesCategory;
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
      return matchesArea && matchesCategory;
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
      <div className={`detail-panel-summary${isSummaryCollapsed ? " detail-panel-summary-collapsed" : ""}`}>
        {!isSummaryCollapsed ? <div className="detail-kicker">Festival Focus</div> : null}
        <div className="detail-summary-title-row">
          <h2 className="mt-2 text-3xl font-black text-stone-950 md:text-4xl">
            {festival.name}
          </h2>
          <button
            type="button"
            className="detail-summary-toggle"
            aria-expanded={!isSummaryCollapsed}
            aria-controls="festival-summary-content"
            onClick={() => onSummaryCollapsedChange(!isSummaryCollapsed)}
          >
            {isSummaryCollapsed ? "展開資訊" : "收起資訊"}
            <span aria-hidden="true">{isSummaryCollapsed ? "⌄" : "⌃"}</span>
          </button>
        </div>
        <div id="festival-summary-content" hidden={isSummaryCollapsed}>
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
          <div className="festival-external-links">
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
            {festival.ticketUrl ? (
              <a
                className="official-link ticket-link"
                href={festival.ticketUrl}
                target="_blank"
                rel="noreferrer"
              >
                售票資訊
              </a>
            ) : null}
          </div>
        </div>
      </div>

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
                <article
                  key={item.id}
                  className={`travel-item ${item.highlights ? "travel-item-featured" : ""}`}
                >
                  <span
                    className={`travel-item-category ${categoryMeta[item.category].tone}`}
                  >
                    {categoryMeta[item.category].label}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.highlights && item.highlights.length > 0 ? (
                      <dl className="travel-item-highlights">
                        {item.highlights.map((highlight) => (
                          <div key={highlight.label}>
                            <dt>{highlight.label}</dt>
                            <dd>{highlight.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {item.links && item.links.length > 0 ? (
                      <div className="travel-item-links">
                        {item.links.map((link) => (
                          <a
                            key={link.href}
                            className={`place-link place-link-${link.kind}`}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${item.title} ${link.label}`}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
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

      {festivalPerformers.length > 0 ? (
        <PerformerList
          performers={festivalPerformers}
          selectedArtistId={selectedArtistId}
          onArtistSelect={setSelectedArtistId}
        />
      ) : null}

      {selectedArtist ? (
        <ArtistModal
          artist={selectedArtist}
          performances={selectedArtistPerformances}
          onClose={() => setSelectedArtistId(null)}
          onFestivalSelect={(nextFestival) => {
            setSelectedArtistId(null);
            onFestivalSelect(nextFestival);
          }}
        />
      ) : null}

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

      {similarFestivals.length > 0 ? (
        <section className="mt-7" aria-labelledby="related-heading">
          <div className="section-label" id="related-heading">
            相似音樂祭
          </div>
          <p className="similar-festival-explainer">
            依舉辦月份、場地型態與音樂風格推薦；每張卡片會列出相似原因。
          </p>
          <div className="mt-3 grid gap-2">
            {similarFestivals.map(({ festival: similarFestival, reasons }) => (
              <button
                key={similarFestival.id}
                type="button"
                className="related-festival"
                onClick={() => onFestivalSelect(similarFestival)}
              >
                <span>{similarFestival.name}</span>
                <small>{similarFestival.dateLabel}</small>
                <em>{reasons.join("・")}</em>
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
  const [selectedFestival, setSelectedFestival] = useState(festivals[0]);
  const [selectedYear, setSelectedYear] = useState(festivals[0].year);
  const [selectedArea, setSelectedArea] = useState("all");
  const [activeMonth, setActiveMonth] = useState(7);
  const [pendingFestivalId, setPendingFestivalId] = useState<string | null>(null);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const years = useMemo(() => {
    return Array.from(new Set(festivals.map((festival) => festival.year))).sort(
      (left, right) => right - left,
    );
  }, []);

  const areaOptions = useMemo<AreaFilterOption[]>(() => {
    const areaMap = new Map<string, AreaFilterOption>();

    for (const festival of festivals) {
      for (const area of getFestivalPrefectures(festival)) {
        const current = areaMap.get(area.id);
        areaMap.set(area.id, {
          id: area.id,
          name: area.name,
          festivalCount: (current?.festivalCount ?? 0) + 1,
        });
      }
    }

    return Array.from(areaMap.values()).sort((left, right) =>
      left.name.localeCompare(right.name, "ja"),
    );
  }, []);

  const visibleFestivals = useMemo(
    () =>
      festivals.filter(
        (festival) =>
          festival.year === selectedYear &&
          (selectedArea === "all" ||
            getFestivalPrefectures(festival).some((area) => area.id === selectedArea)),
      ),
    [selectedArea, selectedYear],
  );
  const byMonth = useMemo(() => groupFestivalsByMonth(visibleFestivals), [visibleFestivals]);
  const focusedFestival = visibleFestivals.find(
    (festival) => festival.id === selectedFestival.id,
  );
  const displayedFestival = focusedFestival ?? visibleFestivals[0];

  const applyFestivalSelection = (festival: Festival) => {
    setSelectedYear(festival.year);
    setSelectedArea("all");
    setSelectedFestival(festival);
    setActiveMonth(festival.month);
    setPendingFestivalId(festival.id);
  };

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

  useEffect(() => {
    if (!pendingFestivalId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const card = document.getElementById(`festival-card-${pendingFestivalId}`);
      if (!card) {
        return;
      }

      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.focus({ preventScroll: true });
      setPendingFestivalId(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingFestivalId, selectedArea, selectedYear, visibleFestivals]);

  return (
    <main className="min-h-screen bg-[#f5f1e7] text-stone-950">
      <div className="site-header">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-700">
            Festyle
          </p>
          <h1>日本音樂祭指南</h1>
        </div>
        <p>
          按月份找想去的音樂祭，也看看演出前後的吃住、交通與周邊行程。
        </p>
      </div>

      <GlobalPerformerSearch
        onFestivalSelect={applyFestivalSelection}
      />

      <section className="festival-filter" aria-labelledby="festival-filter-heading">
        <div className="festival-filter-heading">
          <div>
            <span>Festival Finder</span>
            <h2 id="festival-filter-heading">用年份與地區找音樂祭</h2>
          </div>
          <p aria-live="polite">找到 {visibleFestivals.length} 個音樂祭</p>
        </div>

        <div className="festival-filter-controls">
          <label>
            <span>年份</span>
            <select
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(Number(event.target.value));
                setActiveMonth(1);
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year} 年
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>地區</span>
            <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>
              <option value="all">日本全國</option>
              {areaOptions.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}（{area.festivalCount}）
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setSelectedYear(years[0]);
              setSelectedArea("all");
            }}
            disabled={selectedYear === years[0] && selectedArea === "all"}
          >
            清除篩選
          </button>
        </div>
        <p className="festival-filter-note">
          地區依會場所在都道府縣整理；年份只顯示已收錄的音樂祭。
        </p>
      </section>

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
          {visibleFestivals.length === 0 ? (
            <div className="archive-empty" role="status">
              <span>{selectedYear} Festival Finder</span>
              <h2>這個年份與地區目前沒有資料</h2>
              <p>試著選擇其他地區，查看這個年份已收錄的音樂祭。</p>
            </div>
          ) : null}
          {months.map((month) => (
            <MonthSection
              key={month}
              month={month}
              monthFestivals={byMonth[month]}
              selectedFestival={displayedFestival ?? selectedFestival}
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
          {displayedFestival ? (
            <DetailPanel
              key={displayedFestival.id}
              festival={displayedFestival}
              onFestivalSelect={applyFestivalSelection}
              isSummaryCollapsed={isSummaryCollapsed}
              onSummaryCollapsedChange={setIsSummaryCollapsed}
            />
          ) : null}
        </div>
      </div>
      <button
        type="button"
        className="back-to-top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          })
        }
      >
        <span aria-hidden="true">↑</span>
        返回頂部
      </button>
    </main>
  );
}
