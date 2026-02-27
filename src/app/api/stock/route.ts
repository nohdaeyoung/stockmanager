import { NextRequest, NextResponse } from "next/server";
import { fetchStockPrice, getMockPrice } from "@/lib/stock-api";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const name = request.nextUrl.searchParams.get("name") || "";

  if (!code) {
    return NextResponse.json({ error: "종목코드가 필요합니다" }, { status: 400 });
  }

  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;

  try {
    if (appKey && appSecret) {
      const price = await fetchStockPrice(code, appKey, appSecret);
      price.name = name;
      return NextResponse.json(price);
    }

    // API 키가 없으면 Mock 데이터 반환
    const mock = getMockPrice(code, name);
    return NextResponse.json(mock);
  } catch (error) {
    // API 실패 시 Mock fallback
    const mock = getMockPrice(code, name);
    return NextResponse.json(mock);
  }
}
