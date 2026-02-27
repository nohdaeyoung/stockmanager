"use client";

import { StockCardData } from "@/types/stock";
import { getNaverNewsUrl } from "@/lib/portfolio";

interface StockCardProps {
  data: StockCardData;
  onRemove: (code: string) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}

function formatRate(rate: number): string {
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

export default function StockCard({ data, onRemove }: StockCardProps) {
  const isUp = data.changeRate > 0;
  const isDown = data.changeRate < 0;
  const gapUp = data.gapRate > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{data.name}</h3>
          <span className="text-sm text-gray-400">{data.code}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={getNaverNewsUrl(data.code)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            title="네이버 금융 뉴스"
          >
            뉴스
          </a>
          <button
            onClick={() => onRemove(data.code)}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg"
            title="종목 삭제"
          >
            &times;
          </button>
        </div>
      </div>

      {/* 현재가 */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">현재가</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(data.currentPrice)}
          </span>
          <span className="text-sm text-gray-400">원</span>
          <span
            className={`text-sm font-medium ml-auto ${
              isUp ? "text-red-500" : isDown ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "−"} {formatRate(data.changeRate)}
          </span>
        </div>
      </div>

      {/* 평단가 & 괴리율 */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
        <div>
          <div className="text-xs text-gray-400 mb-1">평단가</div>
          <div className="text-sm font-semibold text-gray-700">
            {formatPrice(data.avgPrice)}원
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">괴리율</div>
          <div
            className={`text-sm font-semibold ${
              gapUp ? "text-red-500" : "text-blue-500"
            }`}
          >
            {formatRate(data.gapRate)}
          </div>
        </div>
      </div>
    </div>
  );
}
