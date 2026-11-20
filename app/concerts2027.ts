import type { Area, Festival } from "./data";

type Show = [date: string, prefecture: string, venue: string, opens: string, starts: string];

// Official schedules checked on 2026-11-20. One entry represents one performance.
const ainaShows: Show[] = [
  ["03-07", "hyogo", "神戸国際会館こくさいホール", "18:00", "19:00"],
  ["03-13", "kagawa", "サンポートホール高松", "16:00", "17:00"],
  ["03-20", "niigata", "新潟県民会館", "16:00", "17:00"],
  ["03-22", "aichi", "Niterra 日本特殊陶業市民会館フォレストホール", "16:00", "17:00"],
  ["04-02", "hiroshima", "広島上野学園ホール", "18:00", "19:00"],
  ["04-04", "osaka", "大阪フェスティバルホール", "16:00", "17:00"],
  ["04-11", "tokyo", "LINE CUBE SHIBUYA", "16:00", "17:00"],
  ["04-16", "kumamoto", "市民会館シアーズホーム夢ホール（熊本市民会館）", "18:00", "19:00"],
  ["04-18", "fukuoka", "福岡サンパレス", "16:00", "17:00"],
  ["05-07", "okayama", "岡山芸術創造劇場ハレノワ 大劇場", "18:00", "19:00"],
  ["05-09", "shizuoka", "富士市文化会館ロゼシアター", "17:30", "18:30"],
  ["05-16", "ishikawa", "金沢歌劇座", "16:00", "17:00"],
  ["05-20", "iwate", "盛岡市民文化ホール", "18:00", "19:00"],
  ["05-22", "kanagawa", "相模女子大学グリーンホール・大ホール", "17:30", "18:30"],
  ["05-30", "gunma", "高崎芸術劇場・大劇場", "16:00", "17:00"],
  ["06-02", "hokkaido", "函館サーモン・まるなまホール（函館市民会館）", "18:00", "19:00"],
  ["06-04", "hokkaido", "カナモトホール", "18:00", "19:00"],
  ["06-12", "ehime", "松山市民会館", "16:00", "17:00"],
  ["06-20", "miyagi", "東京エレクトロンホール宮城", "16:00", "17:00"],
  ["06-28", "tokyo", "SGC HALL ARIAKE", "18:00", "19:00"],
  ["06-29", "tokyo", "SGC HALL ARIAKE", "18:00", "19:00"],
];

const zutomayoShows: Show[] = [
  ["01-15", "hiroshima", "広島文化学園HBGホール", "17:00", "18:00"],
  ["01-18", "chiba", "市川市文化会館 大ホール", "17:30", "18:30"],
  ["01-19", "chiba", "市川市文化会館 大ホール", "17:30", "18:30"],
  ["01-21", "tokyo", "J:COMホール八王子", "18:00", "19:00"],
  ["01-26", "tokyo", "SGCホール有明", "18:00", "19:00"],
  ["01-27", "tokyo", "SGCホール有明", "18:00", "19:00"],
  ["02-06", "shizuoka", "富士市文化会館ロゼシアター", "17:00", "18:00"],
  ["02-15", "hyogo", "神戸国際会館こくさいホール", "18:00", "19:00"],
  ["02-16", "hyogo", "神戸国際会館こくさいホール", "18:00", "19:00"],
  ["02-21", "oita", "iichikoグランシアタ", "17:00", "18:00"],
  ["02-23", "kumamoto", "熊本城ホール メインホール", "18:00", "19:00"],
  ["02-27", "fukushima", "いわき芸術文化交流館アリオス アルパイン大ホール", "17:00", "18:00"],
  ["03-04", "tokyo", "東京ガーデンシアター", "18:00", "19:00"],
  ["03-05", "tokyo", "東京ガーデンシアター", "18:00", "19:00"],
  ["03-13", "ehime", "松山市民会館 大ホール", "17:00", "18:00"],
  ["03-15", "fukuoka", "福岡サンパレス", "18:00", "19:00"],
  ["03-16", "yamaguchi", "KDDI維新ホール", "18:00", "19:00"],
  ["03-24", "aichi", "愛知県芸術劇場 大ホール", "17:30", "18:30"],
  ["03-25", "aichi", "愛知県芸術劇場 大ホール", "17:30", "18:30"],
  ["03-30", "ishikawa", "金沢歌劇座", "18:00", "19:00"],
  ["03-31", "ishikawa", "金沢歌劇座", "18:00", "19:00"],
  ["04-08", "nara", "なら100年会館（大ホール）", "18:00", "19:00"],
  ["04-10", "okayama", "岡山芸術創造劇場 ハレノワ 大劇場", "17:00", "18:00"],
  ["04-11", "okayama", "岡山芸術創造劇場 ハレノワ 大劇場", "16:00", "17:00"],
  ["04-20", "hokkaido", "札幌文化芸術劇場 hitaru", "18:00", "19:00"],
  ["04-21", "hokkaido", "札幌文化芸術劇場 hitaru", "18:00", "19:00"],
  ["04-27", "osaka", "フェスティバルホール", "18:00", "19:00"],
  ["04-28", "osaka", "フェスティバルホール", "18:00", "19:00"],
  ["05-01", "tokyo", "立川ステージガーデン", "17:00", "18:00"],
  ["05-02", "tokyo", "立川ステージガーデン", "17:00", "18:00"],
  ["05-11", "miyagi", "仙台サンプラザホール", "18:00", "19:00"],
  ["05-12", "miyagi", "仙台サンプラザホール", "18:00", "19:00"],
  ["05-17", "kanagawa", "カルッツかわさき ホール", "18:00", "19:00"],
  ["05-18", "kanagawa", "カルッツかわさき ホール", "18:00", "19:00"],
  ["05-22", "wakayama", "和歌山県民文化会館", "17:00", "18:00"],
  ["05-23", "wakayama", "和歌山県民文化会館", "17:00", "18:00"],
];

const prefectureNames: Record<string, string> = {
  aichi: "愛知", chiba: "千葉", ehime: "愛媛", fukuoka: "福岡", fukushima: "福島",
  gunma: "群馬", hiroshima: "廣島", hokkaido: "北海道", hyogo: "兵庫", ishikawa: "石川",
  iwate: "岩手", kagawa: "香川", kanagawa: "神奈川", kumamoto: "熊本", miyagi: "宮城",
  nara: "奈良", niigata: "新潟", oita: "大分", okayama: "岡山", osaka: "大阪",
  shizuoka: "靜岡", tokyo: "東京", wakayama: "和歌山", yamaguchi: "山口",
};

export const concertAreas2027: Area[] = Array.from(
  new Set([...ainaShows, ...zutomayoShows].map((show) => show[1])),
).map((id) => ({
  id,
  slug: id,
  name: prefectureNames[id],
  nameJa: prefectureNames[id],
  type: "prefecture",
  mapPosition: { x: 50, y: 50 },
  summary: `${prefectureNames[id]}的巡演場次，請以官方公告確認會場交通。`,
}));

function makeShows(artist: string, title: string, sourceUrl: string, shows: Show[], ticketInfo: string): Festival[] {
  return shows.map(([day, prefecture, venue, opens, starts]) => {
    const date = `2027-${day}`;
    const month = Number(day.slice(0, 2));
    return {
      id: `concert_${artist}_${day}`,
      slug: `${artist}-${day.replace("-", "")}`,
      kind: "concert",
      artistName: artist === "aina-the-end" ? "AiNA THE END" : "ZUTOMAYO",
      name: title,
      officialUrl: sourceUrl,
      ticketUrl: sourceUrl,
      year: 2027,
      month,
      dateLabel: `${month}/${Number(day.slice(3))}`,
      startsOn: date,
      endsOn: date,
      cityId: prefecture,
      areaIds: [prefecture],
      venue,
      mapFeatureLabel: venue,
      genres: ["live"],
      moodTags: ["專場", prefectureNames[prefecture]],
      travelCategoryIds: [],
      relatedPlaceIds: [],
      relatedFestivalIds: [],
      description: `${prefectureNames[prefecture]}場，開場 ${opens}、開演 ${starts}。${ticketInfo}`,
    };
  });
}

export const concerts2027: Festival[] = [
  ...makeShows("aina-the-end", "AiNA THE END LIVE TOUR 2027", "https://ainatheend.jp/news/detail.php?id=1136806", ainaShows, "一般指定席 ¥10,000；另有其他票種。售票方式與最新狀態請查看官方公告。"),
  ...makeShows("zutomayo", "ZUTOMAYO Hall Tour 2027「アピクラ電機」", "https://zutomayo.net/apicula/", zutomayoShows, "指定席 ¥9,900；另有升級席。售票方式與最新狀態請查看官方公告。"),
];
