import { Stock } from "@/types/stock";

const STORAGE_KEY = "stockmanager_portfolio";

export function getPortfolio(): Stock[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Stock[];
  } catch {
    return [];
  }
}

export function savePortfolio(stocks: Stock[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
}

export function addStock(stock: Stock): Stock[] {
  const portfolio = getPortfolio();
  const exists = portfolio.find((s) => s.code === stock.code);
  if (exists) {
    exists.avgPrice = stock.avgPrice;
    exists.name = stock.name;
  } else {
    portfolio.push(stock);
  }
  savePortfolio(portfolio);
  return portfolio;
}

export function removeStock(code: string): Stock[] {
  const portfolio = getPortfolio().filter((s) => s.code !== code);
  savePortfolio(portfolio);
  return portfolio;
}

export function getNaverNewsUrl(code: string): string {
  return `https://finance.naver.com/item/news.naver?code=${code}`;
}

export function getNaverFinanceUrl(code: string): string {
  return `https://finance.naver.com/item/main.naver?code=${code}`;
}
