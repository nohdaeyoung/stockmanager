"use client";

import { useState, useRef, useEffect } from "react";
import { searchStocks } from "@/lib/stock-search";
import { Stock } from "@/types/stock";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stock: Stock) => void;
}

export default function AddStockModal({ isOpen, onClose, onAdd }: AddStockModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ code: string; name: string }[]>([]);
  const [selected, setSelected] = useState<{ code: string; name: string } | null>(null);
  const [avgPrice, setAvgPrice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelected(null);
      setAvgPrice("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const r = searchStocks(query);
    setResults(r);
  }, [query]);

  function handleSelect(stock: { code: string; name: string }) {
    setSelected(stock);
    setQuery(stock.name);
    setResults([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !avgPrice) return;

    const price = parseInt(avgPrice.replace(/,/g, ""), 10);
    if (isNaN(price) || price <= 0) return;

    onAdd({
      code: selected.code,
      name: selected.name,
      avgPrice: price,
    });
    onClose();
  }

  function handleAvgPriceChange(value: string) {
    const num = value.replace(/[^0-9]/g, "");
    if (num) {
      setAvgPrice(parseInt(num, 10).toLocaleString("ko-KR"));
    } else {
      setAvgPrice("");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">종목 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 종목 검색 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              종목 검색
            </label>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              placeholder="종목명 또는 종목코드 입력"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            {results.length > 0 && !selected && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {results.map((s) => (
                  <li
                    key={s.code}
                    onClick={() => handleSelect(s)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">{s.name}</span>
                    <span className="text-sm text-gray-400">{s.code}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 선택된 종목 표시 */}
          {selected && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                {selected.name}
              </span>
              <span className="text-xs text-blue-500">{selected.code}</span>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setQuery("");
                }}
                className="ml-auto text-blue-400 hover:text-blue-600"
              >
                &times;
              </button>
            </div>
          )}

          {/* 평균 매수단가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              평균 매수단가
            </label>
            <div className="relative">
              <input
                type="text"
                value={avgPrice}
                onChange={(e) => handleAvgPriceChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                원
              </span>
            </div>
          </div>

          {/* 제출 */}
          <button
            type="submit"
            disabled={!selected || !avgPrice}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            추가하기
          </button>
        </form>
      </div>
    </div>
  );
}
