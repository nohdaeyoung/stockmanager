import { StockPrice } from "@/types/stock";

const KIS_BASE_URL = "https://openapi.koreainvestment.com:9443";

interface KISTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface KISPriceResponse {
  output: {
    stck_prpr: string;    // 현재가
    prdy_ctrt: string;    // 전일 대비 등락률
    prdy_vrss: string;    // 전일 대비
    stck_sdpr: string;    // 전일 종가
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(
  appKey: string,
  appSecret: string
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(`${KIS_BASE_URL}/oauth2/tokenP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: appKey,
      appsecret: appSecret,
    }),
  });

  if (!res.ok) throw new Error("KIS token 발급 실패");

  const data: KISTokenResponse = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

export async function fetchStockPrice(
  code: string,
  appKey: string,
  appSecret: string
): Promise<StockPrice> {
  const token = await getAccessToken(appKey, appSecret);

  const res = await fetch(
    `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price?` +
      new URLSearchParams({
        FID_COND_MRKT_DIV_CODE: "J",
        FID_INPUT_ISCD: code,
      }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHKST01010100",
      },
    }
  );

  if (!res.ok) throw new Error(`주가 조회 실패: ${code}`);

  const data: KISPriceResponse = await res.json();
  const output = data.output;

  return {
    code,
    name: "",
    currentPrice: parseInt(output.stck_prpr, 10),
    changeRate: parseFloat(output.prdy_ctrt),
    changePrice: parseInt(output.prdy_vrss, 10),
    prevClose: parseInt(output.stck_sdpr, 10),
  };
}

// 한투 API 키가 없을 때 사용하는 Mock 데이터
const MOCK_PRICES: Record<string, Omit<StockPrice, "code" | "name">> = {
  "005930": { currentPrice: 72000, changeRate: 2.13, changePrice: 1500, prevClose: 70500 },
  "035720": { currentPrice: 52300, changeRate: -1.13, changePrice: -600, prevClose: 52900 },
  "000660": { currentPrice: 185000, changeRate: 1.37, changePrice: 2500, prevClose: 182500 },
  "035420": { currentPrice: 215000, changeRate: -0.46, changePrice: -1000, prevClose: 216000 },
  "051910": { currentPrice: 580000, changeRate: 0.87, changePrice: 5000, prevClose: 575000 },
};

export function getMockPrice(code: string, name: string): StockPrice {
  const mock = MOCK_PRICES[code] || {
    currentPrice: Math.floor(Math.random() * 100000) + 10000,
    changeRate: parseFloat((Math.random() * 6 - 3).toFixed(2)),
    changePrice: Math.floor(Math.random() * 3000 - 1500),
    prevClose: Math.floor(Math.random() * 100000) + 10000,
  };
  return { code, name, ...mock };
}
