export type TravelCategory = "food" | "clothes" | "stay" | "transport" | "fun";

export type Area = {
  id: string;
  slug: string;
  name: string;
  nameJa?: string;
  type: "prefecture" | "city" | "district" | "spot";
  parentId?: string;
  mapPosition: {
    x: number;
    y: number;
  };
  summary: string;
};

export type TravelItem = {
  id: string;
  areaId: string;
  category: TravelCategory;
  title: string;
  description: string;
  tags: string[];
  relatedFestivalIds: string[];
};

export type PlaceLink = {
  label: string;
  href: string;
  kind: "official" | "instagram" | "map";
};

export type Place = {
  id: string;
  areaId: string;
  category: TravelCategory;
  name: string;
  nameJa?: string;
  typeLabel: string;
  neighborhood: string;
  summary: string;
  bestFor: string;
  tags: string[];
  links: PlaceLink[];
  relatedFestivalIds: string[];
};

export type Festival = {
  id: string;
  slug: string;
  name: string;
  nameJa?: string;
  officialUrl?: string;
  month: number;
  dateLabel: string;
  cityId: string;
  areaIds: string[];
  venue: string;
  mapFeatureLabel: string;
  genres: string[];
  moodTags: string[];
  travelCategoryIds: TravelCategory[];
  relatedPlaceIds: string[];
  relatedFestivalIds: string[];
  description: string;
};

export const months = Array.from({ length: 12 }, (_, index) => index + 1);

export const categoryMeta: Record<
  TravelCategory,
  { label: string; title: string; tone: string }
> = {
  food: { label: "食", title: "吃喝", tone: "border-amber-500 text-amber-900" },
  clothes: { label: "衣", title: "穿搭", tone: "border-rose-500 text-rose-900" },
  stay: { label: "住", title: "住宿", tone: "border-emerald-600 text-emerald-900" },
  transport: { label: "行", title: "交通", tone: "border-sky-600 text-sky-900" },
  fun: { label: "樂", title: "玩法", tone: "border-violet-600 text-violet-900" },
};

export const areas: Area[] = [
  {
    id: "kyoto",
    slug: "kyoto",
    name: "京都",
    nameJa: "京都",
    type: "prefecture",
    mapPosition: { x: 38, y: 39 },
    summary: "關西旅行的核心城市，可作為住宿、交通與前後行程的中樞。",
  },
  {
    id: "uji",
    slug: "uji",
    name: "宇治",
    nameJa: "宇治",
    type: "city",
    parentId: "kyoto",
    mapPosition: { x: 46, y: 58 },
    summary: "京都大作戦會場所在地，適合把抹茶、河岸散步與會場交通一起規劃。",
  },
  {
    id: "shiga",
    slug: "shiga",
    name: "滋賀",
    nameJa: "滋賀",
    type: "prefecture",
    mapPosition: { x: 68, y: 38 },
    summary: "從京都延伸到琵琶湖很自然，適合作為音樂祭前後的小旅行。",
  },
  {
    id: "biwako",
    slug: "biwako",
    name: "琵琶湖",
    nameJa: "琵琶湖",
    type: "spot",
    parentId: "shiga",
    mapPosition: { x: 76, y: 51 },
    summary: "滋賀的代表性湖區，騎腳踏車可以被歸在京都大作戦周邊的「樂」。",
  },
  {
    id: "fukuoka",
    slug: "fukuoka",
    name: "福岡",
    nameJa: "福岡",
    type: "prefecture",
    mapPosition: { x: 39, y: 45 },
    summary: "九州旅行的核心城市，適合把市區住宿、美食與機場交通串在一起。",
  },
  {
    id: "momochi",
    slug: "momochi",
    name: "百道",
    nameJa: "ももち",
    type: "district",
    parentId: "fukuoka",
    mapPosition: { x: 58, y: 37 },
    summary: "靠近海濱與球場的區域，NUMBER SHOT 的場館與海邊舞台都集中在這一帶。",
  },
  {
    id: "paypay-dome",
    slug: "paypay-dome",
    name: "PayPay Dome",
    nameJa: "みずほPayPayドーム福岡",
    type: "spot",
    parentId: "momochi",
    mapPosition: { x: 61, y: 51 },
    summary: "NUMBER SHOT2026 的山笠ステージ、どんたくステージ所在地，適合作為動線核心。",
  },
  {
    id: "jigyohama-beach",
    slug: "jigyohama-beach",
    name: "地行浜ビーチ",
    nameJa: "シーサイドももち海浜公園地行浜ビーチ",
    type: "spot",
    parentId: "momochi",
    mapPosition: { x: 73, y: 31 },
    summary: "のぼせもんステージ所在地，適合把海邊散步、補給與場外動線一起規劃。",
  },
];

export const festivals: Festival[] = [
  {
    id: "festival_kyoto_daisakusen",
    slug: "kyoto-daisakusen",
    name: "京都大作戦",
    nameJa: "京都大作戦",
    month: 7,
    dateLabel: "7月",
    cityId: "uji",
    areaIds: ["kyoto", "uji", "shiga", "biwako"],
    venue: "京都府立山城総合運動公園 太陽が丘",
    mapFeatureLabel: "琵琶湖",
    genres: ["rock", "punk", "outdoor"],
    moodTags: ["夏フェス", "関西", "遠征向き", "local trip"],
    travelCategoryIds: ["food", "clothes", "stay", "transport", "fun"],
    relatedPlaceIds: [
      "kyoto-food-shortlist",
      "hoho-hojicha",
      "archi-kyoto",
      "uji-matcha",
      "uji-festival-wear",
      "kyoto-station-stay",
      "uji-venue-transport",
      "biwako-cycling",
    ],
    relatedFestivalIds: ["festival_number_shot_2026"],
    description:
      "以京都府宇治市為起點的夏季 rock festival，可以一路連到京都市、宇治、滋賀與琵琶湖的食衣住行樂。",
  },
  {
    id: "festival_number_shot_2026",
    slug: "number-shot-2026",
    name: "NUMBER SHOT2026",
    nameJa: "NUMBER SHOT2026",
    officialUrl: "https://numbershot.jp/2026/",
    month: 8,
    dateLabel: "8/1-8/2",
    cityId: "fukuoka",
    areaIds: ["fukuoka", "momochi", "paypay-dome", "jigyohama-beach"],
    venue: "みずほPayPayドーム福岡 / シーサイドももち海浜公園地行浜ビーチ",
    mapFeatureLabel: "博多湾",
    genres: ["rock", "pop", "dome", "seaside"],
    moodTags: ["夏フェス", "九州", "福岡", "遠征向き", "indoor-outdoor"],
    travelCategoryIds: ["food", "clothes", "stay", "transport", "fun"],
    relatedPlaceIds: [
      "fukuoka-yatai",
      "momochi-festival-wear",
      "tenjin-hakata-stay",
      "paypay-dome-transport",
      "momochi-seaside-walk",
    ],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
    description:
      "福岡のドーム與海濱場地並行的 8 月音樂祭，可以從百道、PayPay Dome、地行浜海邊一路挖到福岡市區食衣住行樂。",
  },
];

export const travelItems: TravelItem[] = [
  {
    id: "kyoto-food-shortlist",
    areaId: "kyoto",
    category: "food",
    title: "京都市區茶與咖啡候選",
    description:
      "把 HOHO HOJICHA、archi_kyoto 這類京都市區店家集中在京都-食，適合排進音樂祭前後半日。",
    tags: ["京都", "京都-食", "茶", "咖啡", "甜點"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "uji-matcha",
    areaId: "uji",
    category: "food",
    title: "宇治抹茶與會場前後補給",
    description:
      "把宇治的茶、甜點與簡單正餐整理成音樂祭前後可以快速使用的清單。",
    tags: ["宇治", "宇治-食", "抹茶", "補給"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "uji-festival-wear",
    areaId: "uji",
    category: "clothes",
    title: "夏フェス穿搭備忘",
    description:
      "戶外場地以防曬、雨具、好走鞋與替換衣物為主，之後可以擴充成裝備 checklist。",
    tags: ["宇治", "宇治-衣", "夏フェス", "outdoor"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "kyoto-station-stay",
    areaId: "kyoto",
    category: "stay",
    title: "京都站周邊住宿",
    description:
      "如果重視交通銜接，京都站周邊適合作為去宇治、回大阪或接續滋賀行程的基地。",
    tags: ["京都", "京都-住", "住宿", "交通中樞"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "uji-venue-transport",
    areaId: "uji",
    category: "transport",
    title: "京都市區往宇治與太陽が丘",
    description:
      "先把大方向拆成京都市區、宇治站、會場接駁三段，之後可加入當年官方交通資訊。",
    tags: ["宇治", "宇治-行", "京都", "會場交通"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "biwako-cycling",
    areaId: "biwako",
    category: "fun",
    title: "琵琶湖騎腳踏車",
    description:
      "可作為京都大作戦前後延伸的滋賀玩法，放在京都大作戦關聯旅遊的「樂」。",
    tags: ["滋賀", "琵琶湖", "琵琶湖-樂", "騎腳踏車"],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "fukuoka-yatai",
    areaId: "fukuoka",
    category: "food",
    title: "福岡市區晚餐與屋台補給",
    description:
      "NUMBER SHOT 前後可以把天神、博多與屋台當成晚餐候選區，之後再補店家清單。",
    tags: ["福岡", "福岡-食", "屋台", "博多", "天神"],
    relatedFestivalIds: ["festival_number_shot_2026"],
  },
  {
    id: "momochi-festival-wear",
    areaId: "momochi",
    category: "clothes",
    title: "ドーム與海邊切換穿搭",
    description:
      "同時有室內ドーム與海濱舞台，穿搭可以先以排汗、好走、防曬與輕便雨具為核心。",
    tags: ["百道", "百道-衣", "dome", "seaside", "夏フェス"],
    relatedFestivalIds: ["festival_number_shot_2026"],
  },
  {
    id: "tenjin-hakata-stay",
    areaId: "fukuoka",
    category: "stay",
    title: "天神 / 博多住宿基地",
    description:
      "如果要兼顧機場、市區吃喝與會場移動，天神與博多可先作為住宿搜尋起點。",
    tags: ["福岡", "福岡-住", "天神", "博多", "住宿"],
    relatedFestivalIds: ["festival_number_shot_2026"],
  },
  {
    id: "paypay-dome-transport",
    areaId: "paypay-dome",
    category: "transport",
    title: "市區往 PayPay Dome / 百道動線",
    description:
      "先把動線拆成福岡機場、博多 / 天神、市區到百道與場館周邊步行，之後可補官方交通更新。",
    tags: ["PayPay Dome", "PayPay Dome-行", "百道", "會場交通"],
    relatedFestivalIds: ["festival_number_shot_2026"],
  },
  {
    id: "momochi-seaside-walk",
    areaId: "jigyohama-beach",
    category: "fun",
    title: "百道海濱與地行浜散步",
    description:
      "海邊舞台周邊可以整理成 NUMBER SHOT 前後的短時間玩法，和福岡市區行程連在一起。",
    tags: ["地行浜ビーチ", "地行浜ビーチ-樂", "百道", "海濱", "散步"],
    relatedFestivalIds: ["festival_number_shot_2026"],
  },
];

export const places: Place[] = [
  {
    id: "hoho-hojicha",
    areaId: "kyoto",
    category: "food",
    name: "HOHO HOJICHA",
    typeLabel: "焙茶 / 甜點",
    neighborhood: "京都市區",
    summary:
      "以焙茶飲品與甜點作為京都市區的輕量補給點，適合放在散步或移動日的中段。",
    bestFor: "音樂祭前後半日、甜點補給、伴手禮候選",
    tags: ["京都", "京都-食", "焙茶", "甜點", "茶"],
    links: [
      {
        label: "官方網站",
        href: "https://www.hohohojicha.com/",
        kind: "official",
      },
      {
        label: "地圖搜尋",
        href: "https://www.google.com/maps/search/?api=1&query=HOHO%20HOJICHA%20Kyoto",
        kind: "map",
      },
    ],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
  {
    id: "archi-kyoto",
    areaId: "kyoto",
    category: "food",
    name: "archi_kyoto",
    typeLabel: "咖啡 / 空間",
    neighborhood: "京都市區",
    summary:
      "偏向可以停下來休息的咖啡與空間候選，適合排在市區散步、採買或等車前後。",
    bestFor: "咖啡休息、雨天備案、京都市區空檔",
    tags: ["京都", "京都-食", "咖啡", "cafe", "休息"],
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/archi_kyoto/",
        kind: "instagram",
      },
      {
        label: "地圖搜尋",
        href: "https://www.google.com/maps/search/?api=1&query=archi_kyoto%20Kyoto",
        kind: "map",
      },
    ],
    relatedFestivalIds: ["festival_kyoto_daisakusen"],
  },
];

export function getFestival(festivalId: string) {
  return festivals.find((festival) => festival.id === festivalId);
}

export function getArea(areaId: string) {
  return areas.find((area) => area.id === areaId);
}

export function getFestivalAreas(festival: Festival) {
  return festival.areaIds
    .map((areaId) => getArea(areaId))
    .filter((area): area is Area => Boolean(area));
}

export function getTravelItemsForFestival(festival: Festival) {
  return travelItems.filter((item) => item.relatedFestivalIds.includes(festival.id));
}

export function getPlacesForFestival(festival: Festival) {
  return places.filter((place) => place.relatedFestivalIds.includes(festival.id));
}

export function getFestivalTags(festival: Festival) {
  const relatedAreas = getFestivalAreas(festival);
  const generatedAreaTags = relatedAreas.flatMap((area) =>
    festival.travelCategoryIds.map(
      (category) => `${area.name}-${categoryMeta[category].label}`,
    ),
  );

  return Array.from(
    new Set([
      ...relatedAreas.map((area) => area.name),
      ...festival.genres,
      ...festival.moodTags,
      ...generatedAreaTags,
      ...getTravelItemsForFestival(festival).flatMap((item) => item.tags),
      ...getPlacesForFestival(festival).flatMap((place) => place.tags),
    ]),
  );
}
