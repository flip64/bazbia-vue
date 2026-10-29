type StoreProduct = {
  id?: number;
  slug?: string;
  storefront?: {
    kind: 'coin' | 'pack';
    url: string;
    catalog_only?: boolean;
    is_group?: boolean;
    in_stock?: boolean;
    min_price?: string | null;
    images?: { url: string | null }[];
    year?: number | null;
    issuer?: string;
    label?: string;
    variants?: Record<string, string>;
  } | null;
};

export function coinDestination(product: StoreProduct, variant?: unknown): string | null {
  const target = product.storefront;
  if (!target || !['coin', 'pack'].includes(target.kind)) return null;
  const requested = Number(variant);
  const mapped = target.variants?.[String(requested)];
  const url = mapped || (Number.isInteger(requested) && requested > 0
    ? `${target.url}${target.url.includes('?') ? '&' : '?'}variant=${requested}`
    : target.url);
  const prefix = target.kind === 'coin' ? '/coins/' : '/coin-packs/';
  if (typeof url !== 'string' || !url.startsWith(prefix)) return null;
  return url;
}

export function productDestination(product: StoreProduct): string {
  return coinDestination(product) || `/product/${product.slug || product.id}`;
}
