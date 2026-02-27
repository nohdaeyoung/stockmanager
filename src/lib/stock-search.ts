// 국내 주요 종목 목록 (검색용)
const STOCK_LIST: { code: string; name: string }[] = [
  { code: "005930", name: "삼성전자" },
  { code: "000660", name: "SK하이닉스" },
  { code: "035420", name: "NAVER" },
  { code: "035720", name: "카카오" },
  { code: "051910", name: "LG화학" },
  { code: "006400", name: "삼성SDI" },
  { code: "005380", name: "현대차" },
  { code: "000270", name: "기아" },
  { code: "068270", name: "셀트리온" },
  { code: "105560", name: "KB금융" },
  { code: "055550", name: "신한지주" },
  { code: "003670", name: "포스코퓨처엠" },
  { code: "028260", name: "삼성물산" },
  { code: "012330", name: "현대모비스" },
  { code: "066570", name: "LG전자" },
  { code: "003550", name: "LG" },
  { code: "096770", name: "SK이노베이션" },
  { code: "034730", name: "SK" },
  { code: "030200", name: "KT" },
  { code: "017670", name: "SK텔레콤" },
  { code: "032830", name: "삼성생명" },
  { code: "086790", name: "하나금융지주" },
  { code: "015760", name: "한국전력" },
  { code: "009150", name: "삼성전기" },
  { code: "034020", name: "두산에너빌리티" },
  { code: "003490", name: "대한항공" },
  { code: "010130", name: "고려아연" },
  { code: "033780", name: "KT&G" },
  { code: "018260", name: "삼성에스디에스" },
  { code: "011200", name: "HMM" },
  { code: "259960", name: "크래프톤" },
  { code: "352820", name: "하이브" },
  { code: "263750", name: "펄어비스" },
  { code: "036570", name: "엔씨소프트" },
  { code: "251270", name: "넷마블" },
  { code: "293490", name: "카카오게임즈" },
  { code: "041510", name: "에스엠" },
  { code: "122870", name: "와이지엔터테인먼트" },
  { code: "047810", name: "한국항공우주" },
  { code: "042700", name: "한미반도체" },
];

export function searchStocks(query: string): { code: string; name: string }[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return STOCK_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.code.includes(q)
  ).slice(0, 10);
}

export function getAllStocks(): { code: string; name: string }[] {
  return STOCK_LIST;
}
