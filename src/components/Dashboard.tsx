"use client";

import { useState, useEffect, useCallback } from "react";
import { Stock, StockCardData, StockPrice } from "@/types/stock";
import { getPortfolio, addStock, removeStock } from "@/lib/portfolio";
import StockCard from "./StockCard";
import AddStockModal from "./AddStockModal";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [cardData, setCardData] = useState<StockCardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 포트폴리오 로드
  useEffect(() => {
    setPortfolio(getPortfolio());
  }, []);

  // 주가 데이터 가져오기
  const fetchPrices = useCallback(async (stocks: Stock[]) => {
    if (stocks.length === 0) {
      setCardData([]);
      return;
    }

    setLoading(true);
    try {
      const prices = await Promise.all(
        stocks.map(async (stock) => {
          const res = await fetch(
            `/api/stock?code=${stock.code}&name=${encodeURIComponent(stock.name)}`
          );
          return res.json() as Promise<StockPrice>;
        })
      );

      const data: StockCardData[] = stocks.map((stock, i) => {
        const price = prices[i];
        const gapRate =
          stock.avgPrice > 0
            ? ((price.currentPrice - stock.avgPrice) / stock.avgPrice) * 100
            : 0;

        return {
          ...stock,
          currentPrice: price.currentPrice,
          changeRate: price.changeRate,
          changePrice: price.changePrice,
          gapRate: parseFloat(gapRate.toFixed(2)),
        };
      });

      setCardData(data);
    } catch {
      // 에러 시 기존 데이터 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices(portfolio);
  }, [portfolio, fetchPrices]);

  // 자동 갱신 (30초)
  useEffect(() => {
    if (portfolio.length === 0) return;
    const interval = setInterval(() => fetchPrices(portfolio), 30000);
    return () => clearInterval(interval);
  }, [portfolio, fetchPrices]);

  function handleAdd(stock: Stock) {
    const updated = addStock(stock);
    setPortfolio([...updated]);
  }

  function handleRemove(code: string) {
    const updated = removeStock(code);
    setPortfolio([...updated]);
  }

  const upCount = cardData.filter((d) => d.changeRate > 0).length;
  const downCount = cardData.filter((d) => d.changeRate < 0).length;
  const flatCount = cardData.filter((d) => d.changeRate === 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">StockManager</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 종목 추가
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 요약 */}
        {portfolio.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">보유 종목</span>{" "}
                <span className="font-bold text-gray-900">{portfolio.length}개</span>
              </div>
              {cardData.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-red-500">상승 {upCount}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-blue-500">하락 {downCount}</span>
                  {flatCount > 0 && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">보합 {flatCount}</span>
                    </>
                  )}
                </div>
              )}
              {loading && (
                <span className="text-gray-400 text-xs ml-auto">갱신 중...</span>
              )}
            </div>
          </div>
        )}

        {/* 종목 리스트 */}
        {portfolio.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-gray-200">📊</div>
            <p className="text-gray-500 mb-2">등록된 종목이 없습니다</p>
            <p className="text-sm text-gray-400 mb-6">
              종목을 추가해서 평단가 대비 현재가를 확인하세요
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 종목 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardData.map((data) => (
              <StockCard key={data.code} data={data} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>

      {/* 종목 추가 모달 */}
      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
