import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createRouter, createMemoryHistory } from 'vue-router';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';

const code = ts.transpileModule(readFileSync('src/services/productDestination.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { productDestination, coinDestination } = await import(
  'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
);
const coin = { slug: 'sample', storefront: {
  kind: 'coin', url: '/coins/coin?variant=1&issue=2',
  variants: { '3': '/coins/other?variant=3&issue=4' },
} };
assert.equal(productDestination({ id: 1, slug: 'normal' }), '/product/normal');
assert.equal(productDestination(coin), '/coins/coin?variant=1&issue=2');
assert.equal(coinDestination(coin, '3'), '/coins/other?variant=3&issue=4');
assert.equal(coinDestination({ storefront: { kind: 'coin', url: 'https://example.com' } }), null);
assert.equal(productDestination({ storefront: { kind: 'pack', url: '/coin-packs/pack?variant=5' } }), '/coin-packs/pack?variant=5');
const router = createRouter({ history: createMemoryHistory(), routes: [
  { path: '/product/:slug', component: {} },
  { path: '/coins/:slug', component: {} },
  { path: '/coin-packs/:slug', component: {} },
] });
await router.push('/product/sample?variant=3');
await router.replace(coinDestination(coin, router.currentRoute.value.query.variant));
assert.equal(router.currentRoute.value.path, '/coins/other');
assert.deepEqual(router.currentRoute.value.query, { variant: '3', issue: '4' });

for (const filename of [
  'src/components/home/LatestProductsCarousel.vue',
  'src/components/home/CheapestProductsCarousel.vue',
  'src/components/home/FeaturedProductsSwiper.vue',
  'src/components/products/ProductCard.vue',
  'src/views/products/ProductDetail.vue',
  'src/views/coins/CoinDetailView.vue',
]) {
  const { descriptor, errors } = parse(readFileSync(filename, 'utf8'));
  assert.deepEqual(errors, []);
  const script = compileScript(descriptor, { id: filename });
  const template = compileTemplate({ source: descriptor.template.content, filename, id: filename,
    compilerOptions: { bindingMetadata: script.bindings } });
  assert.deepEqual(template.errors, []);
}
console.log('PASS: destinations, legacy redirect, variant/issue preservation, six Vue components');
