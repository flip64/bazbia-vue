type StoreProduct = {
  id?: number;
  slug?: string;
  storefront?: {
    kind: 'coin' | 'pack';
    url: string;
    variants?: Record<string, string>;
  } | null;
};

export function coinDestination(product: StoreProduct, variant?: unknown): string | null {
  const target = product.storefront;
  if (!target || !['coin', 'pack'].includes(target.kind)) return null;
  const requested = Number(variant);
  const url = target.variants?.[String(requested)] || target.url;
  const prefix = target.kind === 'coin' ? '/coins/' : '/coin-packs/';
  if (typeof url !== 'string' || !url.startsWith(prefix)) return null;
  return url;
}

export function productDestination(product: StoreProduct): string {
  return coinDestination(product) || `/product/${product.slug || product.id}`;
}
