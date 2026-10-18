<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Coins,
  Package,
  SlidersHorizontal,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-vue-next";
import CoinCard from "@/components/coins/CoinCard.vue";
import { coinError, coinService } from "@/services/coin.service";
import { latinDigits } from "@/components/coins/format";
import type { CoinFilters, CoinKind, CoinPage } from "@/types/coin.types";
import "@/components/coins/coins.css";
const route = useRoute(),
  router = useRouter();
const kind = computed<CoinKind>(() =>
  route.meta.coinKind === "pack" ? "pack" : "coin",
);
const options = ref<CoinFilters | null>(null),
  optionsError = ref(""),
  error = ref(""),
  formError = ref("");
const page = ref<CoinPage | null>(null),
  loading = ref(true),
  filtersOpen = ref(false);
const form = reactive<Record<string, string>>({});
const keys = [
  "q",
  "issuer",
  "period",
  "ruler",
  "currency",
  "material",
  "theme",
  "mint",
  "shape",
  "construction",
  "issue_kind",
  "calendar",
  "year",
  "year_min",
  "year_max",
  "condition",
  "finish",
  "min_price",
  "max_price",
  "in_stock",
  "is_complete",
  "ordering",
];
let request: AbortController | undefined,
  optionRequest: AbortController | undefined;
const currentPage = computed(() => Math.max(1, Number(route.query.page) || 1));
const pages = computed(() => Math.ceil((page.value?.count || 0) / 24));
const activeCount = computed(
  () =>
    keys.filter(
      (k) =>
        k !== "ordering" &&
        form[k] &&
        (kind.value === "pack" || k !== "is_complete"),
    ).length,
);
const namedGroups = computed(() => [
  { key: "issuer", title: "کشور یا قلمرو", values: options.value?.issuers },
  { key: "period", title: "دوره تاریخی", values: options.value?.periods },
  { key: "material", title: "جنس سکه", values: options.value?.materials },
]);
const extraNamed = computed(() => [
  { key: "ruler", title: "حاکم", values: options.value?.rulers },
  { key: "currency", title: "واحد پول سکه", values: options.value?.currencies },
  { key: "mint", title: "ضرابخانه", values: options.value?.mints },
  { key: "theme", title: "موضوع", values: options.value?.themes },
]);
const extraChoices = computed(() => [
  { key: "shape", title: "شکل سکه", values: options.value?.shapes },
  {
    key: "construction",
    title: "ساختار فلزی",
    values: options.value?.constructions,
  },
  {
    key: "issue_kind",
    title: "نوع انتشار",
    values: options.value?.issue_kinds,
  },
  { key: "finish", title: "پرداخت ضرب", values: options.value?.finishes },
]);
async function loadOptions() {
  optionRequest?.abort();
  const current = new AbortController();
  optionRequest = current;
  optionsError.value = "";
  try {
    options.value = await coinService.filters(current.signal);
  } catch (e) {
    if (!current.signal.aborted) optionsError.value = coinError(e);
  }
}
async function load() {
  request?.abort();
  const current = new AbortController();
  request = current;
  for (const key of keys)
    form[key] =
      typeof route.query[key] === "string" ? String(route.query[key]) : "";
  if (kind.value === "coin") form.is_complete = "";
  loading.value = true;
  error.value = "";
  formError.value = "";
  const query: Record<string, string> = {};
  keys.forEach((k) => {
    if (form[k]) query[k] = form[k];
  });
  query.page = String(currentPage.value);
  try {
    const result = await coinService.list(kind.value, query, current.signal);
    if (!current.signal.aborted) page.value = result;
  } catch (e) {
    if (!current.signal.aborted) {
      error.value = coinError(e);
      page.value = null;
    }
  } finally {
    if (!current.signal.aborted) loading.value = false;
  }
}
function apply() {
  formError.value = "";
  for (const key of [
    "year",
    "year_min",
    "year_max",
    "min_price",
    "max_price",
  ]) {
    form[key] = latinDigits(form[key] || "");
    if (form[key] && !/^-?\d+$/.test(form[key])) {
      formError.value = "سال و قیمت را به‌صورت عدد صحیح وارد کنید.";
      return;
    }
  }
  if ((form.year || form.year_min || form.year_max) && !form.calendar) {
    formError.value = "برای انتخاب سال، تقویم را مشخص کنید.";
    return;
  }
  if (form.year && (form.year_min || form.year_max)) {
    formError.value = "سال دقیق یا بازه سال را انتخاب کنید، نه هر دو.";
    return;
  }
  if (
    (form.min_price && Number(form.min_price) < 0) ||
    (form.max_price && Number(form.max_price) < 0)
  ) {
    formError.value = "قیمت نمی‌تواند منفی باشد.";
    return;
  }
  for (const [low, high] of [
    ["min_price", "max_price"],
    ["year_min", "year_max"],
  ]) {
    if (form[low!] && form[high!] && Number(form[low!]) > Number(form[high!])) {
      formError.value = "انتهای بازه نباید از ابتدا کمتر باشد.";
      return;
    }
  }
  const query: Record<string, string> = {};
  keys.forEach((k) => {
    if (form[k] && (kind.value === "pack" || k !== "is_complete"))
      query[k] = form[k];
  });
  filtersOpen.value = false;
  if (JSON.stringify(route.query) === JSON.stringify(query)) load();
  else router.push({ path: route.path, query });
}
function reset() {
  keys.forEach((k) => (form[k] = ""));
  router.push({ path: route.path, query: {} });
  formError.value = "";
}
function move(value: number) {
  router.push({ query: { ...route.query, page: String(value) } });
}
function tabQuery() {
  const q = { ...route.query };
  delete q.page;
  delete q.is_complete;
  return q;
}
watch(() => route.fullPath, load, { immediate: true });
loadOptions();
onBeforeUnmount(() => {
  request?.abort();
  optionRequest?.abort();
});
</script>
<template>
  <div class="coin-page">
    <nav class="coin-breadcrumb" aria-label="مسیر صفحه">
      <RouterLink to="/">بازبیا</RouterLink><span>/</span
      ><span>سکه و کلکسیون</span>
    </nav>
    <header class="coin-hero">
      <div>
        <p class="coin-eyebrow">کلکسیون بازبیا</p>
        <h1>هر سکه، یک روایت</h1>
        <p>
          سکه‌های تکی و پک‌های سالانه را با مشخصات، کیفیت و تصاویرشان انتخاب
          کنید.
        </p>
      </div>
      <div class="coin-hero__mark" aria-hidden="true">
        <Coins :size="70" /><span>سکه و کلکسیون</span>
      </div>
    </header>
    <div class="coin-tabs" aria-label="نوع محصول">
      <RouterLink
        :to="{ name: 'coins', query: tabQuery() }"
        :class="{ active: kind === 'coin' }"
        ><Coins :size="20" /> سکه تکی</RouterLink
      >
      <RouterLink
        :to="{ name: 'coin-packs', query: tabQuery() }"
        :class="{ active: kind === 'pack' }"
        ><Package :size="20" /> پک سکه</RouterLink
      >
    </div>
    <div class="coin-catalog">
      <aside class="coin-filters" :class="{ 'is-open': filtersOpen }">
        <div class="coin-panel-heading">
          <h2>فیلترها</h2>
          <button type="button" class="coin-text-button" @click="reset">
            پاک کردن
          </button>
        </div>
        <p v-if="optionsError" role="alert" class="coin-error">
          {{ optionsError }}
          <button type="button" @click="loadOptions">تلاش مجدد</button>
        </p>
        <form @submit.prevent="apply">
          <label class="coin-field"
            ><span>جست‌وجو</span>
            <div class="coin-search">
              <Search :size="17" /><input
                v-model="form.q"
                type="search"
                placeholder="نام یا نوشته سکه"
                maxlength="120"
              /></div
          ></label>
          <label
            v-for="group in namedGroups"
            :key="group.key"
            class="coin-field"
            ><span>{{ group.title }}</span
            ><select v-model="form[group.key]">
              <option value="">همه</option>
              <option
                v-for="v in group.values || []"
                :key="v.id"
                :value="v.slug"
              >
                {{ v.name }}
              </option>
            </select></label
          >
          <div class="coin-filter-rule"></div>
          <label class="coin-field"
            ><span>تقویم سال ضرب</span
            ><select v-model="form.calendar">
              <option value="">همه تقویم‌ها</option>
              <option
                v-for="v in options?.calendars || []"
                :key="v.value"
                :value="v.value"
              >
                {{ v.label }}
              </option>
            </select></label
          >
          <label class="coin-field"
            ><span>سال دقیق</span
            ><input
              v-model="form.year"
              inputmode="numeric"
              placeholder="مثلاً ۱۳۷۳"
          /></label>
          <label class="coin-field"
            ><span>حفظ‌شدگی</span
            ><select v-model="form.condition">
              <option value="">همه کیفیت‌ها</option>
              <option
                v-for="v in options?.conditions || []"
                :key="v.value"
                :value="v.value"
              >
                {{ v.label }}
              </option>
            </select></label
          >
          <div class="coin-field">
            <span>قیمت به تومان</span>
            <div class="coin-field-pair">
              <input
                v-model="form.min_price"
                inputmode="numeric"
                aria-label="حداقل قیمت"
                placeholder="از"
              /><input
                v-model="form.max_price"
                inputmode="numeric"
                aria-label="حداکثر قیمت"
                placeholder="تا"
              />
            </div>
          </div>
          <label class="coin-field"
            ><span>موجودی</span
            ><select v-model="form.in_stock">
              <option value="">همه موارد</option>
              <option value="true">فقط موجودها</option>
              <option value="false">فقط ناموجودها</option>
            </select></label
          >
          <label v-if="kind === 'pack'" class="coin-field"
            ><span>نوع مجموعه</span
            ><select v-model="form.is_complete">
              <option value="">همه پک‌ها</option>
              <option value="true">مجموعه کامل</option>
              <option value="false">پک منتخب</option>
            </select></label
          >
          <details class="coin-more">
            <summary>فیلترهای بیشتر</summary>
            <div class="coin-field">
              <span>بازه سال به‌جای سال دقیق</span>
              <div class="coin-field-pair">
                <input
                  v-model="form.year_min"
                  inputmode="numeric"
                  aria-label="از سال"
                  placeholder="از سال"
                /><input
                  v-model="form.year_max"
                  inputmode="numeric"
                  aria-label="تا سال"
                  placeholder="تا سال"
                />
              </div>
            </div>
            <label
              v-for="group in extraNamed"
              :key="group.key"
              class="coin-field"
              ><span>{{ group.title }}</span
              ><select v-model="form[group.key]">
                <option value="">همه</option>
                <option
                  v-for="v in group.values || []"
                  :key="v.id"
                  :value="v.slug"
                >
                  {{ v.name }}
                </option>
              </select></label
            >
            <label
              v-for="group in extraChoices"
              :key="group.key"
              class="coin-field"
              ><span>{{ group.title }}</span
              ><select v-model="form[group.key]">
                <option value="">همه</option>
                <option
                  v-for="v in group.values || []"
                  :key="v.value"
                  :value="v.value"
                >
                  {{ v.label }}
                </option>
              </select></label
            >
          </details>
          <p v-if="formError" role="alert" class="coin-error">
            {{ formError }}
          </p>
          <button class="coin-button" type="submit">
            اعمال فیلترها
            <span v-if="activeCount"
              >({{ activeCount.toLocaleString("fa-IR") }})</span
            >
          </button>
        </form>
      </aside>
      <section
        class="coin-results"
        aria-label="نتایج محصولات"
        :aria-busy="loading"
      >
        <div class="coin-toolbar">
          <span aria-live="polite">{{
            loading
              ? "در حال دریافت…"
              : `${(page?.count || 0).toLocaleString("fa-IR")} ${kind === "pack" ? "پک" : "نوع سکه"}`
          }}</span>
          <div>
            <button
              class="coin-filter-toggle"
              type="button"
              :aria-expanded="filtersOpen"
              @click="filtersOpen = !filtersOpen"
            >
              <SlidersHorizontal :size="17" /> فیلترها</button
            ><label class="coin-sort"
              ><span class="coin-sr-only">مرتب‌سازی</span
              ><select v-model="form.ordering" @change="apply">
                <option value="">موجودها، سپس قیمت</option>
                <option
                  v-for="v in options?.ordering || []"
                  :key="v.value"
                  :value="v.value"
                >
                  {{ v.label }}
                </option>
              </select></label
            >
          </div>
        </div>
        <div v-if="loading" class="coin-grid">
          <div v-for="n in 6" :key="n" class="coin-skeleton"></div>
        </div>
        <div v-else-if="error" class="coin-empty" role="alert">
          <h2>اطلاعات دریافت نشد</h2>
          <p>{{ error }}</p>
          <button type="button" class="coin-button" @click="load">
            تلاش مجدد
          </button>
        </div>
        <div v-else-if="!page?.results.length" class="coin-empty">
          <Coins :size="46" />
          <h2>موردی پیدا نشد</h2>
          <p>فیلترها را تغییر دهید یا بعداً دوباره سر بزنید.</p>
          <button type="button" class="coin-button secondary" @click="reset">
            پاک کردن فیلترها
          </button>
        </div>
        <template v-else
          ><div class="coin-grid">
            <CoinCard
              v-for="item in page.results"
              :key="item.id"
              :item="item"
              :kind="kind"
            />
          </div>
          <nav v-if="pages > 1" class="coin-pagination" aria-label="صفحه‌بندی">
            <button
              type="button"
              :disabled="currentPage <= 1"
              @click="move(currentPage - 1)"
            >
              <ArrowRight :size="18" /> قبلی</button
            ><span
              >صفحه {{ currentPage.toLocaleString("fa-IR") }} از
              {{ pages.toLocaleString("fa-IR") }}</span
            ><button
              type="button"
              :disabled="currentPage >= pages"
              @click="move(currentPage + 1)"
            >
              بعدی <ArrowLeft :size="18" />
            </button>
          </nav>
        </template>
      </section>
    </div>
  </div>
</template>
