<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Package,
  Coins,
} from "lucide-vue-next";
import CoinStory from "@/components/coins/CoinStory.vue";
import CoinGallery from "@/components/coins/CoinGallery.vue";
import { calendars, money, number, safeURL } from "@/components/coins/format";
import { coinService, coinError } from "@/services/coin.service";
import { useCartStore } from "@/core/store/cartStore";
import type {
  CoinDetail,
  CoinIssue,
  CoinKind,
  CoinSale,
  PackDetail,
} from "@/types/coin.types";
import "@/components/coins/coins.css";
const route = useRoute(),
  router = useRouter(),
  cart = useCartStore();
const kind = computed<CoinKind>(() =>
  route.meta.coinKind === "pack" ? "pack" : "coin",
);
const coin = ref<CoinDetail | null>(null),
  pack = ref<PackDetail | null>(null);
const loading = ref(true),
  error = ref(""),
  cartError = ref(""),
  selectionNotice = ref(""),
  added = ref(false),
  adding = ref(false);
const issueId = ref<number>(),
  variantId = ref<number>(),
  quantity = ref(1);
let controller: AbortController | undefined;
const title = computed(() => {
  if (coin.value) {
    return coin.value.mint_year == null ? coin.value.name : `${coin.value.name} · ${number(coin.value.mint_year)}`;
  }
  return pack.value?.name || "";
});
const issuer = computed(() => coin.value?.issuer || pack.value?.issuer);
const activeIssue = computed(() =>
  coin.value?.issues.find((v) => v.id === issueId.value),
);
const sales = computed<CoinSale[]>(() =>
  kind.value === "pack"
    ? pack.value?.variants || []
    : activeIssue.value?.specimens || [],
);
const selected = computed(() =>
  sales.value.find((v) => v.variant_id === variantId.value),
);
const maxQuantity = computed(() =>
  selected.value?.sale_mode === "unique"
    ? Math.min(1, selected.value.available_stock)
    : Math.min(100, selected.value?.available_stock || 0),
);
const photos = computed(() => selected.value?.images?.length ? selected.value.images : activeIssue.value?.images?.length ? activeIssue.value.images : coin.value?.images || []);
const itemNames = computed(() =>
  Object.fromEntries(
    (selected.value?.items || []).map((item) => [item.id, item.coin_name]),
  ),
);
const references = computed(() => [
  ...(coin.value?.references || []),
  ...(activeIssue.value?.references || []),
]);
function issueLabel(issue: CoinIssue) {
  return `${issue.year == null ? issue.date_status_label : number(issue.year)} · ${calendars[issue.calendar] || issue.calendar}${issue.mint_mark ? ` · ${issue.mint_mark}` : ""}${issue.variety_code ? ` · ${issue.variety_code}` : ""} · ${issue.finish_label}`;
}
function saleLabel(sale: CoinSale) {
  return `${sale.variant_label || sale.sku} · ${money(sale.effective_price)} تومان${sale.can_purchase ? "" : " · ناموجود"}`;
}
function syncSelection() {
  const requestedIssue = Number(route.query.issue);
  const requestedVariant = Number(route.query.variant);
  if (coin.value) {
    const variantIssue = coin.value.issues.find((i) =>
      i.specimens.some((v) => v.variant_id === requestedVariant),
    );
    const match = coin.value.issues.find((i) => i.id === requestedIssue);
    issueId.value =
      match?.id ||
      variantIssue?.id ||
      coin.value.issues.find((i) => i.specimens.some((s) => s.can_purchase))
        ?.id ||
      coin.value.issues[0]?.id;
  }
  const choices =
    kind.value === "pack"
      ? pack.value?.variants || []
      : coin.value?.issues.find((i) => i.id === issueId.value)?.specimens || [];
  selectionNotice.value =
    requestedVariant && !choices.some((s) => s.variant_id === requestedVariant)
      ? "نمونه معرفی‌شده در این لینک در دسترس نیست؛ پیش از خرید، نمونه انتخاب‌شده را بررسی کنید."
      : "";
  variantId.value =
    choices.find((s) => s.variant_id === requestedVariant)?.variant_id ||
    choices.find((s) => s.can_purchase)?.variant_id ||
    choices[0]?.variant_id;
}
async function load() {
  controller?.abort();
  const request = new AbortController();
  controller = request;
  loading.value = true;
  error.value = "";
  cartError.value = "";
  added.value = false;
  coin.value = null;
  pack.value = null;
  try {
    const slug = String(route.params.slug);
    if (kind.value === "pack") {
      const data = await coinService.pack(slug, request.signal);
      if (!request.signal.aborted) pack.value = data;
    } else {
      const data = await coinService.coin(slug, request.signal);
      if (!request.signal.aborted) coin.value = data;
    }
    if (!request.signal.aborted) {
      syncSelection();
      document.title = `${title.value} | سکه و کلکسیون بازبیا`;
    }
  } catch (e) {
    if (!request.signal.aborted) error.value = coinError(e);
  } finally {
    if (!request.signal.aborted) loading.value = false;
  }
}
function chooseIssue() {
  variantId.value =
    activeIssue.value?.specimens.find((s) => s.can_purchase)?.variant_id ||
    activeIssue.value?.specimens[0]?.variant_id;
  updateQuery();
}
function updateQuery() {
  const query: Record<string, string> = {};
  if (issueId.value && kind.value === "coin")
    query.issue = String(issueId.value);
  if (variantId.value) query.variant = String(variantId.value);
  router.replace({ query });
}
watch(() => [route.params.slug, route.meta.coinKind], load, {
  immediate: true,
});
watch(() => [route.query.issue, route.query.variant], syncSelection);
watch(variantId, () => {
  quantity.value = 1;
  cartError.value = "";
  added.value = false;
});
const specs = computed(() => {
  const c = coin.value,
    i = activeIssue.value;
  if (!c) return [];
  return [
    ["کشور", c.issuer.name],
    ["دوره", c.period?.name],
    ["ارزش اسمی", c.denomination_label || c.face_value],
    ["سال ضرب", i?.date_inscription || (i?.year == null ? i?.date_status_label : number(i.year))],
    ["تقویم", calendars[i?.calendar || c.calendar]],
    ["شکل", c.shape_label],
    ["وزن استاندارد", c.weight_g ? `${number(c.weight_g)} گرم` : ""],
    ["قطر", c.diameter_mm ? `${number(c.diameter_mm)} میلی‌متر` : ""],
    ["ضرابخانه", i?.mint?.name],
    ["نوع ضرب", i?.finish_label],
    ["لبه", c.edge_label],
  ].filter((row) => row[1] != null && row[1] !== "");
});
const damage = computed(() => {
  const s = selected.value;
  if (!s || kind.value === "pack") return [];
  const entries: [string, boolean | null | undefined][] = [
    ["تمیزشده", s.cleaned],
    ["خط‌وخش", s.scratched],
    ["خوردگی", s.corroded],
    ["ضربه لبه", s.edge_damaged],
    ["سوراخ پس از ضرب", s.holed],
    ["خمیدگی", s.bent],
    ["تعمیر", s.repaired],
  ];
  return entries.map(([label, value]) => ({
    label,
    value: value == null ? "بررسی نشده" : value ? "دارد" : "ندارد",
    damaged: value === true,
  }));
});
async function addToCart() {
  const sale = selected.value;
  if (!sale?.can_purchase || adding.value) return;
  if (
    !Number.isInteger(quantity.value) ||
    quantity.value < 1 ||
    quantity.value > maxQuantity.value
  ) {
    cartError.value = `تعداد باید بین ۱ و ${number(maxQuantity.value)} باشد.`;
    return;
  }
  adding.value = true;
  cartError.value = "";
  added.value = false;
  try {
    await cart.addItem({
      variant_id: sale.variant_id,
      quantity: quantity.value,
    });
    if (variantId.value === sale.variant_id) added.value = true;
  } catch (e) {
    if (variantId.value === sale.variant_id) cartError.value = coinError(e);
  } finally {
    adding.value = false;
  }
}
onBeforeUnmount(() => controller?.abort());
</script>
<template>
  <div class="coin-page">
    <nav class="coin-breadcrumb" aria-label="مسیر صفحه">
      <RouterLink to="/">بازبیا</RouterLink><span>/</span
      ><RouterLink :to="{ name: kind === 'pack' ? 'coin-packs' : 'coins' }">{{
        kind === "pack" ? "پک‌های سکه" : "سکه‌ها"
      }}</RouterLink
      ><span v-if="title">/</span><span>{{ title }}</span>
    </nav>
    <div v-if="loading" class="coin-detail-grid" aria-busy="true">
      <div class="coin-skeleton large"></div>
      <div class="coin-skeleton large"></div>
    </div>
    <section v-else-if="error" class="coin-empty" role="alert">
      <h1>اطلاعات دریافت نشد</h1>
      <p>{{ error }}</p>
      <button type="button" class="coin-button" @click="load">تلاش مجدد</button
      ><RouterLink
        :to="{ name: kind === 'pack' ? 'coin-packs' : 'coins' }"
        class="coin-text-button"
        >بازگشت به فهرست</RouterLink
      >
    </section>
    <template v-else>
      <div class="coin-detail-grid">
        <CoinGallery :images="photos" :title="title" :item-names="itemNames" />
        <section class="coin-purchase">
          <p class="coin-eyebrow">
            {{ issuer?.name || "چند کشور" }}
            <template v-if="coin?.period"> · {{ coin.period.name }}</template>
          </p>
          <h1>{{ title }}</h1>
          <div class="coin-tags">
            <span
              ><Package v-if="kind === 'pack'" :size="15" /><Coins
                v-else
                :size="15"
              />{{ kind === "pack" ? "پک آماده سکه" : "سکه کلکسیونی" }}</span
            ><span v-if="pack"
              >{{ number(pack.year) }} {{ calendars[pack.calendar] }}</span
            ><span v-if="pack">{{
              pack.is_complete ? "مجموعه کامل طبق تعریف" : "پک منتخب"
            }}</span
            ><span v-if="coin">{{ coin.construction_label }}</span>
          </div>
          <p v-if="pack?.completeness_scope" class="coin-callout">
            تعریف مجموعه: {{ pack.completeness_scope }}
          </p>
          <p class="coin-description">
            {{ coin?.introduction || coin?.description || pack?.description }}
          </p>
          <label v-if="coin && coin.issues.length > 1" class="coin-field"
            ><span>سال و نوبت ضرب</span
            ><select v-model="issueId" :disabled="adding" @change="chooseIssue">
              <option
                v-for="issue in coin.issues"
                :key="issue.id"
                :value="issue.id"
              >
                {{ issueLabel(issue) }}
              </option>
            </select></label
          >
          <label class="coin-field"
            ><span>{{ kind === "pack" ? "نسخه پک" : "انتخاب مدل برای خرید" }}</span
            ><select
              v-model="variantId"
              :disabled="!sales.length || adding"
              @change="updateQuery"
            >
              <option v-if="!sales.length" :value="undefined">
                برای این سال و نوع ضرب، گزینه‌ای برای خرید موجود نیست
              </option>
              <option
                v-for="sale in sales"
                :key="sale.variant_id"
                :value="sale.variant_id"
              >
                {{ saleLabel(sale) }}
              </option>
            </select></label
          >
          <p v-if="selectionNotice" role="status" class="coin-callout">
            {{ selectionNotice }}
          </p>
          <template v-if="selected">
            <p class="coin-callout" v-if="selected.sale_mode === 'unique'">
              تصاویر و مشخصات مربوط به همین
              {{ kind === "pack" ? "پک" : "سکه" }} است؛ همان نمونه را دریافت
              می‌کنید.
            </p>
            <p class="coin-callout" v-else>
              تصاویر، نمونه‌ای از
              {{ kind === "pack" ? "پک‌های" : "سکه‌های" }} مشابه این عرضه است.
              کیفیت و مشخصات اعلام‌شده مبنای خرید است.
            </p>
            <p v-if="selected.condition_notes" class="coin-description">
              {{ selected.condition_notes }}
            </p>
            <div class="coin-buy-price">
              <del
                v-if="
                  selected.discount_price &&
                  Number(selected.price) > Number(selected.effective_price)
                "
                >{{ money(selected.price) }}</del
              ><strong>{{ money(selected.effective_price) }}</strong
              ><span>تومان</span>
            </div>
            <p
              class="coin-availability"
              :class="{ muted: !selected.can_purchase }"
            >
              {{
                selected.can_purchase
                  ? `${number(selected.available_stock)} ${kind === "pack" ? "پک" : "عدد"} موجود`
                  : "این نمونه در حال حاضر قابل خرید نیست"
              }}<span v-if="kind === 'pack'">
                · {{ number(selected.coin_count) }} سکه در هر پک</span
              >
            </p>
            <div class="coin-buy-actions">
              <label
                v-if="selected.sale_mode === 'similar' && selected.can_purchase"
                class="coin-quantity"
                >تعداد<input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity"
                  step="1"
                  :disabled="adding" /></label
              ><button
                class="coin-button"
                type="button"
                :disabled="!selected.can_purchase || adding"
                @click="addToCart"
              >
                <ShoppingBag :size="19" />{{
                  adding
                    ? "در حال افزودن…"
                    : selected.can_purchase
                      ? "افزودن به سبد خرید"
                      : "ناموجود"
                }}
              </button>
            </div>
            <p v-if="cartError" role="alert" class="coin-error">
              {{ cartError }}
            </p>
            <p v-if="added" role="status" class="coin-success">
              <Check :size="18" /> به سبد اضافه شد.
              <RouterLink to="/cart">مشاهده سبد خرید ←</RouterLink>
            </p>
            <p class="coin-note">
              کد کالا: <bdi>{{ selected.sku }}</bdi> · موجودی هنگام ثبت سفارش
              دوباره بررسی می‌شود.
            </p>
          </template>
        </section>
      </div>
      <section v-if="coin?.story || activeIssue?.description" class="coin-panel">
        <h2>درباره این سکه</h2><CoinStory v-if="coin?.story" :text="coin.story" />
        <CoinStory v-if="activeIssue?.description" :text="activeIssue.description" />
      </section>
      <section v-if="selected && kind === 'coin'" class="coin-panel">
        <h2>وضعیت سکه انتخاب‌شده</h2>
        <div class="coin-tags">
          <span>حفظ‌شدگی: {{ selected.condition_label }}</span
          ><span v-if="activeIssue"
            >پرداخت ضرب: {{ activeIssue.finish_label }}</span
          >
        </div>
        <dl class="coin-specs coin-damage">
          <div
            v-for="entry in damage"
            :key="entry.label"
            :class="{ damaged: entry.damaged }"
          >
            <dt>{{ entry.label }}</dt>
            <dd>{{ entry.value }}</dd>
          </div>
        </dl>
        <p v-if="selected.defect_notes" class="coin-description">
          ایرادها: {{ selected.defect_notes }}
        </p>
        <p v-if="selected.patina_description" class="coin-description">
          پتینه: {{ selected.patina_description }}
        </p>
        <p v-if="selected.mint_error_description" class="coin-description">
          خطای ضرب: {{ selected.mint_error_description }}
        </p>
        <p v-if="selected.authenticity_notes" class="coin-description">
          شرح بررسی اصالت: {{ selected.authenticity_notes }}
        </p>
        <p v-if="selected.measured_weight_g" class="coin-note">
          وزن اندازه‌گیری‌شده این نمونه:
          {{ number(selected.measured_weight_g) }} گرم
        </p>
        <p v-if="selected.measured_diameter_mm" class="coin-note">
          قطر اندازه‌گیری‌شده:
          {{ number(selected.measured_diameter_mm) }} میلی‌متر
        </p>
        <p v-if="selected.measured_thickness_mm" class="coin-note">
          ضخامت اندازه‌گیری‌شده:
          {{ number(selected.measured_thickness_mm) }} میلی‌متر
        </p>
        <p v-if="selected.grading_company">
          ارزیابی: {{ selected.grading_company }}
          <bdi
            >{{ selected.grading_designation }}
            {{ selected.numeric_grade }}</bdi
          ><template v-if="selected.certification_number">
            · شماره گواهی:
            <bdi>{{ selected.certification_number }}</bdi></template
          >
          <a
            v-if="safeURL(selected.certification_url)"
            class="coin-link"
            :href="safeURL(selected.certification_url)"
            target="_blank"
            rel="noopener noreferrer"
            >بررسی گواهی ↗</a
          >
        </p>
        <p v-else class="coin-note">
          درجه حفظ‌شدگی، ارزیابی فروشنده است؛ گواهی مؤسسه برای این نمونه ثبت
          نشده است.
        </p>
      </section>
      <section v-if="selected && kind === 'pack'" class="coin-panel">
        <h2>داخل این نسخه از پک</h2>
        <p class="coin-note">
          {{ number(selected.coin_count) }} سکه در یک بسته؛ موجودی بالای صفحه،
          تعداد بسته‌هاست.
        </p>
        <div class="coin-table-wrap">
          <table class="coin-table">
            <thead>
              <tr>
                <th>سکه</th>
                <th>سال</th>
                <th>تعداد</th>
                <th>حفظ‌شدگی</th>
                <th>شرح کیفیت</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selected.items || []" :key="item.id">
                <td>
                  {{ item.coin_name
                  }}<small v-if="item.mint_mark"> · {{ item.mint_mark }}</small>
                </td>
                <td>
                  {{ number(item.year)
                  }}<small>{{ calendars[item.calendar] }}</small>
                </td>
                <td>{{ number(item.quantity) }}</td>
                <td>{{ item.condition_label }}</td>
                <td>{{ item.notes || "توضیحی ثبت نشده" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="pack?.packaging">بسته‌بندی: {{ pack.packaging }}</p>
        <p v-if="selected.packaging_notes" class="coin-description">
          {{ selected.packaging_notes }}
        </p>
      </section>
      <section v-if="coin" class="coin-panel">
        <h2>شناسنامه سکه</h2>
        <dl class="coin-specs">
          <div v-for="row in specs" :key="row[0]">
            <dt>{{ row[0] }}</dt>
            <dd dir="auto">{{ row[1] }}</dd>
          </div>
        </dl>
        <div v-if="coin.composition_parts.length" class="coin-materials">
          <h3>ترکیب فلزی</h3>
          <p v-for="(part, index) in coin.composition_parts" :key="index">
            {{ part.part_label }}: {{ part.material.name
            }}<span v-if="part.fineness">
              · عیار {{ number(part.fineness) }}</span
            ><span v-if="part.notes"> · {{ part.notes }}</span>
          </p>
        </div>
        <p v-if="activeIssue?.variety_description" class="coin-description">
          {{ activeIssue.variety_description }}
        </p>
        <div class="coin-inscriptions">
          <div v-if="coin.obverse_description || coin.obverse_inscription">
            <h3>روی سکه</h3>
            <p class="coin-description">{{ coin.obverse_description }}</p>
            <p dir="auto" class="coin-inscription">
              {{ coin.obverse_inscription }}
            </p>
          </div>
          <div v-if="coin.reverse_description || coin.reverse_inscription">
            <h3>پشت سکه</h3>
            <p class="coin-description">{{ coin.reverse_description }}</p>
            <p dir="auto" class="coin-inscription">
              {{ coin.reverse_inscription }}
            </p>
          </div>
        </div>
      </section>
      <section v-if="references.length" class="coin-panel">
        <h2>مراجع کاتالوگی</h2>
        <ul class="coin-references">
          <li v-for="(reference, index) in references" :key="index">
            <a
              v-if="safeURL(reference.url)"
              :href="safeURL(reference.url)"
              target="_blank"
              rel="noopener noreferrer"
              ><bdi>{{ reference.catalog }} #{{ reference.number }}</bdi> ↗</a
            ><bdi v-else>{{ reference.catalog }} #{{ reference.number }}</bdi>
          </li>
        </ul>
      </section>
      <RouterLink
        :to="{ name: kind === 'pack' ? 'coin-packs' : 'coins' }"
        class="coin-back"
        ><ArrowRight :size="18" /> بازگشت به
        {{ kind === "pack" ? "پک‌ها" : "سکه‌ها" }}</RouterLink
      >
    </template>
  </div>
</template>
