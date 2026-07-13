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

export type PlaceLink = {
  label: string;
  href: string;
  kind: "official" | "instagram" | "map";
};

export type TravelItem = {
  id: string;
  areaId: string;
  category: TravelCategory;
  title: string;
  description: string;
  tags: string[];
  links?: PlaceLink[];
  relatedFestivalIds: string[];
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
  startsOn?: string;
  endsOn?: string;
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

export type Artist = {
  id: string;
  slug: string;
  name: string;
  nameJa?: string;
  summary: string;
  genres: string[];
  tags: string[];
};

export type Performance = {
  id: string;
  festivalId: string;
  artistId: string;
  dateLabel?: string;
  stageLabel?: string;
  note?: string;
};

export type FestivalPerformer = Performance & {
  artist: Artist;
};

export type ArtistFestivalPerformance = Performance & {
  festival: Festival;
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
  {
    id: "hokkaido",
    slug: "hokkaido",
    name: "北海道",
    nameJa: "北海道",
    type: "prefecture",
    mapPosition: { x: 35, y: 42 },
    summary: "RISING SUN 遠征的主要範圍，可把札幌住宿、石狩會場與小樽前後行程串在一起。",
  },
  {
    id: "sapporo",
    slug: "sapporo",
    name: "札幌",
    nameJa: "札幌",
    type: "city",
    parentId: "hokkaido",
    mapPosition: { x: 45, y: 53 },
    summary: "北海道遠征的住宿與補給基地，適合整理市區吃喝、採買與會場巴士動線。",
  },
  {
    id: "ishikari",
    slug: "ishikari",
    name: "石狩",
    nameJa: "石狩",
    type: "city",
    parentId: "hokkaido",
    mapPosition: { x: 61, y: 39 },
    summary: "RISING SUN ROCK FESTIVAL 會場所在的石狩灣新港周邊，是動線與天候裝備規劃核心。",
  },
  {
    id: "otaru",
    slug: "otaru",
    name: "小樽",
    nameJa: "小樽",
    type: "city",
    parentId: "hokkaido",
    mapPosition: { x: 73, y: 31 },
    summary: "靠近石狩灣西側的港町，適合排成 RSR 前後的短程散步與海鮮行程。",
  },
  {
    id: "niigata",
    slug: "niigata",
    name: "新潟",
    nameJa: "新潟",
    type: "prefecture",
    mapPosition: { x: 35, y: 43 },
    summary: "FUJI ROCK 遠征的縣域範圍，可把越後湯沢交通、苗場住宿與山區活動放在同一張圖。",
  },
  {
    id: "yuzawa",
    slug: "yuzawa",
    name: "湯沢",
    nameJa: "湯沢",
    type: "city",
    parentId: "niigata",
    mapPosition: { x: 51, y: 56 },
    summary: "越後湯沢站周邊是 FUJI ROCK 進出苗場的交通與住宿核心。",
  },
  {
    id: "echigo-yuzawa",
    slug: "echigo-yuzawa",
    name: "越後湯沢",
    nameJa: "越後湯沢",
    type: "spot",
    parentId: "yuzawa",
    mapPosition: { x: 45, y: 68 },
    summary: "新幹線與接駁動線的主要節點，適合整理抵達日、退場日與行李安排。",
  },
  {
    id: "naeba",
    slug: "naeba",
    name: "苗場",
    nameJa: "苗場",
    type: "spot",
    parentId: "yuzawa",
    mapPosition: { x: 69, y: 38 },
    summary: "FUJI ROCK FESTIVAL 的山區會場，食衣住行樂都需要以雨具、坡地與長時間停留為前提。",
  },
  {
    id: "chiba",
    slug: "chiba",
    name: "千葉",
    nameJa: "千葉",
    type: "prefecture",
    mapPosition: { x: 34, y: 45 },
    summary: "SUMMER SONIC 東京會場實際所在縣域，適合整理幕張、海浜幕張與東京灣岸動線。",
  },
  {
    id: "makuhari",
    slug: "makuhari",
    name: "幕張",
    nameJa: "幕張",
    type: "district",
    parentId: "chiba",
    mapPosition: { x: 49, y: 37 },
    summary: "ZOZOマリンスタジアム與幕張メッセ周邊，是 SUMMER SONIC 東京會場核心。",
  },
  {
    id: "osaka",
    slug: "osaka",
    name: "大阪",
    nameJa: "大阪",
    type: "prefecture",
    mapPosition: { x: 63, y: 58 },
    summary: "SUMMER SONIC 大阪遠征的住宿、吃喝與交通基地，可和萬博記念公園動線一起規劃。",
  },
  {
    id: "expo-70",
    slug: "expo-70",
    name: "万博記念公園",
    nameJa: "万博記念公園",
    type: "spot",
    parentId: "osaka",
    mapPosition: { x: 77, y: 46 },
    summary: "SUMMER SONIC 大阪會場，適合把入退場、補水、防曬與大阪市區住宿一起整理。",
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
    startsOn: "2026-07-04",
    endsOn: "2026-07-05",
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
    relatedFestivalIds: [
      "festival_number_shot_2026",
      "festival_fuji_rock_2026",
    ],
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
    startsOn: "2026-08-01",
    endsOn: "2026-08-02",
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
    relatedFestivalIds: [
      "festival_kyoto_daisakusen",
      "festival_rising_sun_rock_2026",
      "festival_summer_sonic_2026",
    ],
    description:
      "福岡のドーム與海濱場地並行的 8 月音樂祭，可以從百道、PayPay Dome、地行浜海邊一路挖到福岡市區食衣住行樂。",
  },
  {
    id: "festival_fuji_rock_2026",
    slug: "fuji-rock-festival-2026",
    name: "FUJI ROCK FESTIVAL '26",
    nameJa: "フジロックフェスティバル'26",
    officialUrl: "https://www.fujirockfestival.com/",
    month: 7,
    dateLabel: "7/24-7/26",
    startsOn: "2026-07-24",
    endsOn: "2026-07-26",
    cityId: "yuzawa",
    areaIds: ["niigata", "yuzawa", "echigo-yuzawa", "naeba"],
    venue: "新潟県湯沢町 苗場スキー場",
    mapFeatureLabel: "苗場山麓",
    genres: ["rock", "international", "outdoor", "camp"],
    moodTags: ["夏フェス", "新潟", "山フェス", "遠征向き", "rain-ready"],
    travelCategoryIds: ["food", "clothes", "stay", "transport", "fun"],
    relatedPlaceIds: [
      "naeba-festival-food",
      "naeba-mountain-wear",
      "yuzawa-stay-base",
      "echigo-yuzawa-transport",
      "fujirock-more-fun",
    ],
    relatedFestivalIds: [
      "festival_kyoto_daisakusen",
      "festival_rising_sun_rock_2026",
    ],
    description:
      "新潟県湯沢町の苗場スキー場で行われる山型大型フェス。越後湯沢、苗場、宿泊與雨具裝備をまとめて遠征計画に落とし込める。",
  },
  {
    id: "festival_rising_sun_rock_2026",
    slug: "rising-sun-rock-festival-2026",
    name: "RISING SUN ROCK FESTIVAL 2026 in EZO",
    nameJa: "RISING SUN ROCK FESTIVAL 2026 in EZO",
    officialUrl: "https://rsr.wess.co.jp/2026/",
    month: 8,
    dateLabel: "8/14-8/15",
    startsOn: "2026-08-14",
    endsOn: "2026-08-15",
    cityId: "ishikari",
    areaIds: ["hokkaido", "sapporo", "ishikari", "otaru"],
    venue: "石狩湾新港樽川ふ頭横野外特設ステージ",
    mapFeatureLabel: "石狩湾",
    genres: ["rock", "outdoor", "camp", "all-night"],
    moodTags: ["夏フェス", "北海道", "石狩", "遠征向き", "overnight"],
    travelCategoryIds: ["food", "clothes", "stay", "transport", "fun"],
    relatedPlaceIds: [
      "rsr-sapporo-food",
      "rsr-camp-wear",
      "sapporo-rsr-stay",
      "rsr-access-bus",
      "otaru-side-trip",
    ],
    relatedFestivalIds: [
      "festival_fuji_rock_2026",
      "festival_number_shot_2026",
      "festival_summer_sonic_2026",
    ],
    description:
      "北海道石狩湾新港の野外特設ステージで開催されるオールナイト型 rock festival。札幌を基地に、石狩会場、小樽寄り道與露營裝備を一起整理。",
  },
  {
    id: "festival_summer_sonic_2026",
    slug: "summer-sonic-2026",
    name: "SUMMER SONIC 2026",
    nameJa: "SUMMER SONIC 2026",
    officialUrl: "https://www.summersonic.com/",
    month: 8,
    dateLabel: "8/14-8/16",
    startsOn: "2026-08-14",
    endsOn: "2026-08-16",
    cityId: "makuhari",
    areaIds: ["chiba", "makuhari", "osaka", "expo-70"],
    venue: "ZOZOマリンスタジアム＆幕張メッセ / 万博記念公園",
    mapFeatureLabel: "東京湾",
    genres: ["rock", "pop", "international", "urban"],
    moodTags: ["夏フェス", "東京", "大阪", "遠征向き", "two-city"],
    travelCategoryIds: ["food", "clothes", "stay", "transport", "fun"],
    relatedPlaceIds: [
      "summersonic-city-food",
      "summersonic-heat-wear",
      "summersonic-stay-split",
      "summersonic-venue-transport",
      "summersonic-extra-plan",
    ],
    relatedFestivalIds: [
      "festival_number_shot_2026",
      "festival_rising_sun_rock_2026",
    ],
    description:
      "東京は幕張、OSAKA は万博記念公園で同週開催される都市型夏フェス。会場別に宿泊、入退場、暑さ対策與前後城市行程を比較できる。",
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
      "以 JR 宇治駅作為電車節點；官方 2026 道案內列出京阪宇治、近鉄寺田到會場約 15 分接駁，以及 JR 京都駅八条口到會場約 50 分臨時直行巴士。",
    tags: ["宇治", "宇治-行", "京都", "JR宇治駅", "京阪宇治", "近鉄寺田", "會場交通"],
    links: [
      {
        label: "官方道案內",
        href: "https://kyoto-daisakusen.kyoto/26/access/",
        kind: "official",
      },
      {
        label: "太陽が丘地圖",
        href: "https://www.google.com/maps/search/?api=1&query=%E4%BA%AC%E9%83%BD%E5%BA%9C%E7%AB%8B%E5%B1%B1%E5%9F%8E%E7%B7%8F%E5%90%88%E9%81%8B%E5%8B%95%E5%85%AC%E5%9C%92%20%E5%A4%AA%E9%99%BD%E3%81%8C%E4%B8%98",
        kind: "map",
      },
    ],
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
      "最近車站是福岡市地下鐵唐人町駅，3 號出口到 PayPay Dome 約步行 15 分；活動日也可留意天神高速バスターミナル、博多バスターミナル 6 / 7 號月台的臨時直行巴士。",
    tags: ["PayPay Dome", "PayPay Dome-行", "百道", "唐人町駅", "博多", "天神", "會場交通"],
    links: [
      {
        label: "官方 Access",
        href: "https://www.softbankhawks.co.jp/stadium/access.html",
        kind: "official",
      },
      {
        label: "NUMBER SHOT",
        href: "https://numbershot.jp/2026/",
        kind: "official",
      },
      {
        label: "會場地圖",
        href: "https://www.google.com/maps/search/?api=1&query=%E3%81%BF%E3%81%9A%E3%81%BBPayPay%E3%83%89%E3%83%BC%E3%83%A0%E7%A6%8F%E5%B2%A1%20%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%82%E3%82%82%E3%81%A1%E6%B5%B7%E6%B5%9C%E5%85%AC%E5%9C%92%E5%9C%B0%E8%A1%8C%E6%B5%9C%E3%83%93%E3%83%BC%E3%83%81",
        kind: "map",
      },
    ],
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
  {
    id: "naeba-festival-food",
    areaId: "naeba",
    category: "food",
    title: "苗場會場內外補給",
    description:
      "FUJI ROCK 可以先把會場フェスごはん、越後湯沢抵達日前後正餐與山區零食補給分開整理。",
    tags: ["苗場", "苗場-食", "新潟", "フェスごはん", "補給"],
    relatedFestivalIds: ["festival_fuji_rock_2026"],
  },
  {
    id: "naeba-mountain-wear",
    areaId: "naeba",
    category: "clothes",
    title: "山フェス雨具與保暖層",
    description:
      "苗場是山區戶外場地，穿搭應優先放入雨具、防滑鞋、快乾層與夜間保暖層。",
    tags: ["苗場", "苗場-衣", "山フェス", "雨具", "防滑鞋"],
    relatedFestivalIds: ["festival_fuji_rock_2026"],
  },
  {
    id: "yuzawa-stay-base",
    areaId: "yuzawa",
    category: "stay",
    title: "湯沢 / 苗場住宿基地",
    description:
      "住宿可以先拆成苗場近場、越後湯沢站周邊與官方住宿方案，方便比較退場與隔天移動。",
    tags: ["湯沢", "湯沢-住", "苗場", "住宿", "越後湯沢"],
    relatedFestivalIds: ["festival_fuji_rock_2026"],
  },
  {
    id: "echigo-yuzawa-transport",
    areaId: "echigo-yuzawa",
    category: "transport",
    title: "越後湯沢到苗場動線",
    description:
      "官方 Access 建議 JR 越後湯沢駅下車；東京駅到越後湯沢約 1.5 小時，再搭越後湯沢駅到苗場會場的接駁巴士約 40 分，混雜時可能更久。",
    tags: ["越後湯沢", "越後湯沢-行", "苗場", "新幹線", "シャトルバス", "會場交通"],
    links: [
      {
        label: "官方 Access",
        href: "https://www.fujirockfestival.com/access/index",
        kind: "official",
      },
      {
        label: "苗場地圖",
        href: "https://www.google.com/maps/search/?api=1&query=%E8%8B%97%E5%A0%B4%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4",
        kind: "map",
      },
    ],
    relatedFestivalIds: ["festival_fuji_rock_2026"],
  },
  {
    id: "fujirock-more-fun",
    areaId: "naeba",
    category: "fun",
    title: "苗場場內活動與山區空檔",
    description:
      "FUJI ROCK 除了舞台，也適合整理場內活動、河岸休息點與白天到夜晚的移動節奏。",
    tags: ["苗場", "苗場-樂", "場內活動", "山區", "FUJI ROCK"],
    relatedFestivalIds: ["festival_fuji_rock_2026"],
  },
  {
    id: "rsr-sapporo-food",
    areaId: "sapporo",
    category: "food",
    title: "札幌出發前後吃喝",
    description:
      "RSR 前後可以把札幌拉麵、湯咖哩、便利補給與深夜收尾餐放成一組候選。",
    tags: ["札幌", "札幌-食", "北海道", "補給", "夜食"],
    relatedFestivalIds: ["festival_rising_sun_rock_2026"],
  },
  {
    id: "rsr-camp-wear",
    areaId: "ishikari",
    category: "clothes",
    title: "石狩野外與オールナイト裝備",
    description:
      "石狩灣的戶外場地要兼顧白天日曬、海風、雨具、夜間保暖與露營裝備收納。",
    tags: ["石狩", "石狩-衣", "北海道", "camp", "overnight"],
    relatedFestivalIds: ["festival_rising_sun_rock_2026"],
  },
  {
    id: "sapporo-rsr-stay",
    areaId: "sapporo",
    category: "stay",
    title: "札幌住宿與露營方案比較",
    description:
      "住宿可以先拆成札幌市區、官方露營區與退場後休息點，方便依體力和交通做選擇。",
    tags: ["札幌", "札幌-住", "露營", "住宿", "遠征"],
    relatedFestivalIds: ["festival_rising_sun_rock_2026"],
  },
  {
    id: "rsr-access-bus",
    areaId: "ishikari",
    category: "transport",
    title: "札幌 / 新千歳機場到石狩會場",
    description:
      "官方 Access Guide 的會場是石狩灣新港樽川ふ頭横；搭巴士可從地下鐵南北線麻生駅巴士總站到會場約 30 分，也有札幌駅、新千歳空港方向的 JTB Access Bus，需先買對應巴士券。",
    tags: ["石狩", "石狩-行", "札幌", "麻生駅", "新千歳空港", "シャトルバス", "會場交通"],
    links: [
      {
        label: "官方 Access Guide",
        href: "https://rsr.wess.co.jp/2026/access/accessguide/",
        kind: "official",
      },
      {
        label: "巴士資訊",
        href: "https://rsr.wess.co.jp/2026/access/accessguide/bus",
        kind: "official",
      },
      {
        label: "會場地圖",
        href: "https://www.google.com/maps/search/?api=1&query=%E7%9F%B3%E7%8B%A9%E6%B9%BE%E6%96%B0%E6%B8%AF%E6%A8%BD%E5%B7%9D%E3%81%B5%E9%A0%AD%E6%A8%AA%E9%87%8E%E5%A4%96%E7%89%B9%E8%A8%AD%E3%82%B9%E3%83%86%E3%83%BC%E3%82%B8",
        kind: "map",
      },
    ],
    relatedFestivalIds: ["festival_rising_sun_rock_2026"],
  },
  {
    id: "otaru-side-trip",
    areaId: "otaru",
    category: "fun",
    title: "小樽港町短程延伸",
    description:
      "小樽可作為 RSR 前後半日玩法，整理運河散步、海鮮與札幌往返的短線安排。",
    tags: ["小樽", "小樽-樂", "港町", "散步", "北海道"],
    relatedFestivalIds: ["festival_rising_sun_rock_2026"],
  },
  {
    id: "summersonic-city-food",
    areaId: "makuhari",
    category: "food",
    title: "幕張 / 大阪城市補給",
    description:
      "SUMMER SONIC 可先把幕張會場周邊、海浜幕張站前與大阪市區晚餐分成不同候選清單。",
    tags: ["幕張", "幕張-食", "大阪", "城市補給", "夏フェス"],
    relatedFestivalIds: ["festival_summer_sonic_2026"],
  },
  {
    id: "summersonic-heat-wear",
    areaId: "makuhari",
    category: "clothes",
    title: "都市型夏フェス暑熱對策",
    description:
      "東京與大阪兩會場都要以排汗、防曬、帽子、毛巾和輕量雨具作為穿搭基礎。",
    tags: ["幕張", "幕張-衣", "大阪", "暑熱対策", "防曬"],
    relatedFestivalIds: ["festival_summer_sonic_2026"],
  },
  {
    id: "summersonic-stay-split",
    areaId: "chiba",
    category: "stay",
    title: "幕張 / 大阪住宿分流",
    description:
      "先依參戰會場分成海浜幕張、東京市區、大阪市區與萬博周邊，避免住宿搜尋混在一起。",
    tags: ["千葉", "千葉-住", "幕張", "大阪", "住宿"],
    relatedFestivalIds: ["festival_summer_sonic_2026"],
  },
  {
    id: "summersonic-venue-transport",
    areaId: "makuhari",
    category: "transport",
    title: "海浜幕張與万博記念公園入退場",
    description:
      "東京會場最近是海浜幕張駅，幕張メッセ約步行 7 分、ZOZO マリンスタジアム約 15 分，場內規劃 ZOZO 與幕張メッセ間免費接駁；大阪會場以万博記念公園駅為最近車站。",
    tags: ["幕張", "幕張-行", "海浜幕張駅", "万博記念公園駅", "會場交通", "入退場"],
    links: [
      {
        label: "東京 INFO",
        href: "https://www.summersonic.com/info/tokyo/",
        kind: "official",
      },
      {
        label: "大阪 INFO",
        href: "https://www.summersonic.com/info/osaka/",
        kind: "official",
      },
      {
        label: "東京地圖",
        href: "https://www.google.com/maps/search/?api=1&query=ZOZO%E3%83%9E%E3%83%AA%E3%83%B3%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%A2%E3%83%A0%20%E5%B9%95%E5%BC%B5%E3%83%A1%E3%83%83%E3%82%BB",
        kind: "map",
      },
      {
        label: "大阪地圖",
        href: "https://www.google.com/maps/search/?api=1&query=%E4%B8%87%E5%8D%9A%E8%A8%98%E5%BF%B5%E5%85%AC%E5%9C%92",
        kind: "map",
      },
    ],
    relatedFestivalIds: ["festival_summer_sonic_2026"],
  },
  {
    id: "summersonic-extra-plan",
    areaId: "expo-70",
    category: "fun",
    title: "東京 / 大阪前後城市玩法",
    description:
      "SUMMER SONIC 適合把城市型玩法分成幕張海邊、東京市區與大阪市區，依參戰日做短時間安排。",
    tags: ["万博記念公園", "万博記念公園-樂", "幕張", "大阪", "city trip"],
    relatedFestivalIds: ["festival_summer_sonic_2026"],
  },
];

export const artists: Artist[] = [
  {
    id: "artist_10_feet",
    slug: "10-feet",
    name: "10-FEET",
    nameJa: "10-FEET",
    summary:
      "京都発のロックバンド。京都大作戦を軸に、夏フェス遠征の予定をまとめて追いやすい代表アーティスト。",
    genres: ["rock", "punk", "melodic punk"],
    tags: ["10-FEET", "京都", "rock", "夏フェス"],
  },
  {
    id: "artist_ellegarden",
    slug: "ellegarden",
    name: "ELLEGARDEN",
    nameJa: "ELLEGARDEN",
    summary:
      "日本のロックフェス文脈で追いやすいバンド。都市型、野外型、キャンプ型フェスを横断して整理する候補。",
    genres: ["rock", "alternative", "punk"],
    tags: ["ELLEGARDEN", "rock", "alternative"],
  },
  {
    id: "artist_hey_smith",
    slug: "hey-smith",
    name: "HEY-SMITH",
    nameJa: "HEY-SMITH",
    summary:
      "スカパンクを軸にしたライブバンド。夏フェスの移動日程やステージ被りを確認したい候補。",
    genres: ["ska punk", "punk", "rock"],
    tags: ["HEY-SMITH", "ska punk", "rock"],
  },
  {
    id: "artist_man_with_a_mission",
    slug: "man-with-a-mission",
    name: "MAN WITH A MISSION",
    nameJa: "MAN WITH A MISSION",
    summary:
      "ロックとデジタル要素を横断するバンド。大型フェスの複数日程を追うときの比較軸にしやすい。",
    genres: ["rock", "alternative", "digital rock"],
    tags: ["MAN WITH A MISSION", "rock", "大型フェス"],
  },
  {
    id: "artist_super_beaver",
    slug: "super-beaver",
    name: "SUPER BEAVER",
    nameJa: "SUPER BEAVER",
    summary:
      "歌と言葉を軸にしたロックバンド。都市型フェスと地方遠征の両方で予定を並べたい候補。",
    genres: ["rock", "pop rock"],
    tags: ["SUPER BEAVER", "rock", "pop rock"],
  },
  {
    id: "artist_asian_kung_fu_generation",
    slug: "asian-kung-fu-generation",
    name: "ASIAN KUNG-FU GENERATION",
    nameJa: "ASIAN KUNG-FU GENERATION",
    summary:
      "日本ロックの定番バンド。山型フェス、都市型フェス、北海道遠征を横断して比較しやすい。",
    genres: ["rock", "alternative"],
    tags: ["ASIAN KUNG-FU GENERATION", "rock", "alternative"],
  },
  {
    id: "artist_hump_back",
    slug: "hump-back",
    name: "Hump Back",
    nameJa: "Hump Back",
    summary:
      "ストレートなバンドサウンドのロックバンド。夏フェスの同日候補を拾うための登録アーティスト。",
    genres: ["rock", "punk"],
    tags: ["Hump Back", "rock", "punk"],
  },
];

export const performances: Performance[] = [
  {
    id: "performance_kyoto_daisakusen_10_feet",
    festivalId: "festival_kyoto_daisakusen",
    artistId: "artist_10_feet",
    dateLabel: "7月",
    stageLabel: "Main stage",
    note: "主催アーティストとして追跡",
  },
  {
    id: "performance_kyoto_daisakusen_hey_smith",
    festivalId: "festival_kyoto_daisakusen",
    artistId: "artist_hey_smith",
    dateLabel: "7月",
    stageLabel: "Outdoor stage",
  },
  {
    id: "performance_kyoto_daisakusen_hump_back",
    festivalId: "festival_kyoto_daisakusen",
    artistId: "artist_hump_back",
    dateLabel: "7月",
    stageLabel: "Outdoor stage",
  },
  {
    id: "performance_kyoto_daisakusen_super_beaver",
    festivalId: "festival_kyoto_daisakusen",
    artistId: "artist_super_beaver",
    dateLabel: "7月",
    stageLabel: "Main stage",
  },
  {
    id: "performance_number_shot_10_feet",
    festivalId: "festival_number_shot_2026",
    artistId: "artist_10_feet",
    dateLabel: "8/1-8/2",
    stageLabel: "Yamakasa / Dontaku",
  },
  {
    id: "performance_number_shot_man_with_a_mission",
    festivalId: "festival_number_shot_2026",
    artistId: "artist_man_with_a_mission",
    dateLabel: "8/1-8/2",
    stageLabel: "Yamakasa / Dontaku",
  },
  {
    id: "performance_number_shot_super_beaver",
    festivalId: "festival_number_shot_2026",
    artistId: "artist_super_beaver",
    dateLabel: "8/1-8/2",
    stageLabel: "Yamakasa / Dontaku",
  },
  {
    id: "performance_number_shot_hump_back",
    festivalId: "festival_number_shot_2026",
    artistId: "artist_hump_back",
    dateLabel: "8/1-8/2",
    stageLabel: "Seaside stage",
  },
  {
    id: "performance_fuji_rock_10_feet",
    festivalId: "festival_fuji_rock_2026",
    artistId: "artist_10_feet",
    dateLabel: "7/24-7/26",
    stageLabel: "Naeba stage",
  },
  {
    id: "performance_fuji_rock_man_with_a_mission",
    festivalId: "festival_fuji_rock_2026",
    artistId: "artist_man_with_a_mission",
    dateLabel: "7/24-7/26",
    stageLabel: "Naeba stage",
  },
  {
    id: "performance_fuji_rock_asian_kung_fu_generation",
    festivalId: "festival_fuji_rock_2026",
    artistId: "artist_asian_kung_fu_generation",
    dateLabel: "7/24-7/26",
    stageLabel: "Naeba stage",
  },
  {
    id: "performance_rsr_10_feet",
    festivalId: "festival_rising_sun_rock_2026",
    artistId: "artist_10_feet",
    dateLabel: "8/14-8/15",
    stageLabel: "Ishikari stage",
  },
  {
    id: "performance_rsr_ellegarden",
    festivalId: "festival_rising_sun_rock_2026",
    artistId: "artist_ellegarden",
    dateLabel: "8/14-8/15",
    stageLabel: "Ishikari stage",
  },
  {
    id: "performance_rsr_hey_smith",
    festivalId: "festival_rising_sun_rock_2026",
    artistId: "artist_hey_smith",
    dateLabel: "8/14-8/15",
    stageLabel: "Ishikari stage",
  },
  {
    id: "performance_rsr_asian_kung_fu_generation",
    festivalId: "festival_rising_sun_rock_2026",
    artistId: "artist_asian_kung_fu_generation",
    dateLabel: "8/14-8/15",
    stageLabel: "Ishikari stage",
  },
  {
    id: "performance_summer_sonic_man_with_a_mission",
    festivalId: "festival_summer_sonic_2026",
    artistId: "artist_man_with_a_mission",
    dateLabel: "8/14-8/16",
    stageLabel: "Tokyo / Osaka",
  },
  {
    id: "performance_summer_sonic_ellegarden",
    festivalId: "festival_summer_sonic_2026",
    artistId: "artist_ellegarden",
    dateLabel: "8/14-8/16",
    stageLabel: "Tokyo / Osaka",
  },
  {
    id: "performance_summer_sonic_super_beaver",
    festivalId: "festival_summer_sonic_2026",
    artistId: "artist_super_beaver",
    dateLabel: "8/14-8/16",
    stageLabel: "Tokyo / Osaka",
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

export function getArtist(artistId: string) {
  return artists.find((artist) => artist.id === artistId);
}

export function getFestivalSortDate(festival: Festival) {
  return festival.startsOn ?? `2026-${String(festival.month).padStart(2, "0")}-01`;
}

export function getPerformersForFestival(festival: Festival) {
  return performances
    .filter((performance) => performance.festivalId === festival.id)
    .map((performance) => {
      const artist = getArtist(performance.artistId);

      return artist ? { ...performance, artist } : null;
    })
    .filter((performer): performer is FestivalPerformer => Boolean(performer));
}

export function getArtistPerformances(
  artistId: string,
  options: { upcomingOnly?: boolean; today?: string } = {},
) {
  const today = options.today ?? new Date().toISOString().slice(0, 10);

  return performances
    .filter((performance) => performance.artistId === artistId)
    .map((performance) => {
      const festival = getFestival(performance.festivalId);

      return festival ? { ...performance, festival } : null;
    })
    .filter(
      (performance): performance is ArtistFestivalPerformance =>
        Boolean(performance) &&
        (!options.upcomingOnly ||
          getFestivalSortDate(performance.festival) >= today),
    )
    .sort((left, right) =>
      getFestivalSortDate(left.festival).localeCompare(
        getFestivalSortDate(right.festival),
      ),
    );
}

export function getFestivalTags(festival: Festival) {
  const relatedAreas = getFestivalAreas(festival);
  const performerTags = getPerformersForFestival(festival).flatMap((performer) => [
    performer.artist.name,
    ...performer.artist.tags,
    ...performer.artist.genres,
  ]);
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
      ...performerTags,
      ...getTravelItemsForFestival(festival).flatMap((item) => item.tags),
      ...getPlacesForFestival(festival).flatMap((place) => place.tags),
    ]),
  );
}
