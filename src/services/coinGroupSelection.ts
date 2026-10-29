import type { CoinDetail, CoinGroupDetail, CoinIssue, CoinSale } from '@/types/coin.types';

export function defaultSale(sales: CoinSale[]): CoinSale | undefined {
  return [...sales].filter(s => s.can_purchase)
    .sort((a, b) => Number(a.effective_price) - Number(b.effective_price))[0] || sales[0];
}

export function defaultIssue(coin: CoinDetail): CoinIssue | undefined {
  const price = (issue: CoinIssue) => {
    const sale = defaultSale(issue.specimens);
    return sale?.can_purchase ? Number(sale.effective_price) : Infinity;
  };
  return [...coin.issues].sort((a, b) => price(a) - price(b))[0];
}

export function groupYear(group: CoinGroupDetail, query: Record<string, unknown>): CoinDetail | null {
  const variant = Number(query.variant), issue = Number(query.issue);
  const cheapestYear = [...group.years].filter(c => defaultSale(defaultIssue(c)?.specimens || [])?.can_purchase)
    .sort((a, b) => Number(defaultSale(defaultIssue(a)!.specimens)!.effective_price)
      - Number(defaultSale(defaultIssue(b)!.specimens)!.effective_price))[0];
  return group.years.find(c => c.issues.some(i => i.specimens.some(s => s.variant_id === variant)))
    || group.years.find(c => c.slug === query.coin)
    || group.years.find(c => c.issues.some(i => i.id === issue))
    || cheapestYear || group.years[0] || null;
}
