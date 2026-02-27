export interface Stock {
  code: string;       // 종목코드 (e.g. "005930")
  name: string;       // 종목명 (e.g. "삼성전자")
  avgPrice: number;   // 평균 매수단가
}

export interface StockPrice {
  code: string;
  name: string;
  currentPrice: number;   // 현재가
  changeRate: number;     // 전일 대비 등락률 (%)
  changePrice: number;    // 전일 대비 등락액
  prevClose: number;      // 전일 종가
}

export interface StockCardData extends Stock {
  currentPrice: number;
  changeRate: number;     // 전일 대비 등락률
  changePrice: number;
  gapRate: number;        // 평단가 대비 괴리율 (%)
}
