import { createServer } from 'vite';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import assert from 'node:assert/strict';
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const vite = await createServer({ server: { middlewareMode: true } });
try {
  const { default: CoinCard } = await vite.ssrLoadModule('/src/components/coins/CoinCard.vue');
  for (const [price, stock, label] of [[null, false, 'فقط معرفی'], ['1000', true, 'انتخاب نمونه و خرید'], ['1000', false, 'ناموجود']]) {
    const item = { id: 1, name: 'سکه', slug: 'test-2002', mint_year: 2002, min_price: price, in_stock: stock, issuer: { name: 'کره جنوبی' }, image: null };
    const app = createSSRApp({ render: () => h(CoinCard, { item, kind: 'coin' }) });
    const router = createRouter({ history: createMemoryHistory(), routes: [{path:'/:pathMatch(.*)*', component:{render:()=>null}}] });
    app.use(createPinia()).use(router);
    await router.push('/coins'); await router.isReady();
    const html = await renderToString(app);
    assert.ok(html.includes(label), label);
    assert.ok(html.includes('/coins/test-2002'));
    assert.ok(!html.includes('/product/'));
  }
  const { normalizeProduct } = await vite.ssrLoadModule('/src/services/product.service.ts');
  const normalized = normalizeProduct({ variants: [{ price: '500', stock: 0 }], thumb: 'year.jpg',
    storefront: { is_group: true, min_price: '300', in_stock: true, images: [{ url: 'group.jpg' }] } });
  assert.equal(normalized.price, 300);
  assert.equal(normalized.in_stock, true);
  assert.equal(normalized.thumb, 'group.jpg');
  const { groupYear, defaultSale } = await vite.ssrLoadModule('/src/services/coinGroupSelection.ts');
  const { coinDestination } = await vite.ssrLoadModule('/src/services/productDestination.ts');
  const years = [
    { slug: 'won-1991', issues: [{ id: 1, specimens: [{ variant_id: 11, can_purchase: true, effective_price: '500' }] }] },
    { slug: 'won-2002', issues: [{ id: 2, specimens: [{ variant_id: 22, can_purchase: true, effective_price: '300' }] }] },
  ];
  assert.equal(groupYear({ years }, {}).slug, 'won-2002');
  assert.equal(groupYear({ years }, { variant: '11', coin: 'won-2002' }).slug, 'won-1991');
  assert.equal(groupYear({ years }, { coin: 'won-1991' }).slug, 'won-1991');
  assert.equal(defaultSale(years.flatMap(y => y.issues.flatMap(i => i.specimens))).variant_id, 22);
  const destination = coinDestination({ storefront: { kind: 'coin', url: '/coins/groups/won', variants: {} } }, '999');
  assert.equal(destination, '/coins/groups/won?variant=999');
  console.log('Card states, canonical links, cheapest selection, exact Torob variant and unavailable-variant preservation passed.');
} finally { await vite.close(); }
