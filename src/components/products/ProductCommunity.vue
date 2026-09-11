<template>
  <section class="community">

    <!-- ==========================================
         Header / Tabs
    =========================================== -->
    <div class="community__header">
      <button
        type="button"
        class="community__tab"
        :class="{ 'community__tab--active': activeTab === 'reviews' }"
        @click="activeTab = 'reviews'"
      >
        <span>دیدگاه کاربران</span>

        <span class="community__count">
          {{ reviewCount.toLocaleString('fa-IR') }}
        </span>
      </button>

      <button
        type="button"
        class="community__tab"
        :class="{ 'community__tab--active': activeTab === 'questions' }"
        @click="activeTab = 'questions'"
      >
        <span>پرسش و پاسخ</span>

        <span class="community__count">
          {{ questionCount.toLocaleString('fa-IR') }}
        </span>
      </button>
    </div>


    <!-- ==========================================
         Global error
    =========================================== -->
    <div v-if="loadError" class="community-message community-message--error">
      {{ loadError }}

      <button type="button" class="text-button" @click="loadCommunity">
        تلاش دوباره
      </button>
    </div>


    <!-- ==========================================
         Reviews
    =========================================== -->
    <div v-if="activeTab === 'reviews'" class="community__content">

      <!-- Summary -->
      <div class="review-summary">
        <div class="review-summary__info">
          <h2>دیدگاه کاربران</h2>

          <template v-if="reviews.length">
            <div class="review-summary__rating">
              <strong>{{ averageRating.toLocaleString('fa-IR') }}</strong>
              <span>از ۵</span>
            </div>

            <div class="stars" aria-label="میانگین امتیاز کاربران">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ 'star--filled': star <= roundedAverageRating }"
              >
                ★
              </span>
            </div>
          </template>

          <p class="review-summary__description">
            تجربه واقعی خود از این محصول را با دیگران به اشتراک بگذارید.
          </p>
        </div>

        <button
          v-if="!showReviewForm"
          type="button"
          class="primary-button"
          @click="openReviewForm"
        >
          ثبت دیدگاه
        </button>
      </div>


      <!-- ======================================
           Review form
      ======================================= -->
      <form
        v-if="showReviewForm"
        class="community-form"
        @submit.prevent="submitReview"
      >
        <div class="community-form__header">
          <div>
            <h3>دیدگاه شما</h3>

            <p>
              دیدگاه پس از بررسی در سایت نمایش داده می‌شود.
            </p>
          </div>

          <button
            type="button"
            class="close-button"
            aria-label="بستن فرم دیدگاه"
            @click="closeReviewForm"
          >
            ×
          </button>
        </div>


        <div class="form-group">
          <label>امتیاز شما</label>

          <div class="rating-input">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="rating-star"
              :class="{ 'rating-star--active': star <= reviewRating }"
              :aria-label="`${star} ستاره`"
              @click="reviewRating = star"
            >
              ★
            </button>
          </div>
        </div>


        <div class="form-group">
          <label for="review-title">
            عنوان دیدگاه
            <span class="optional">اختیاری</span>
          </label>

          <input
            id="review-title"
            v-model="reviewTitle"
            type="text"
            maxlength="200"
            placeholder="مثلاً: کیفیت خوبی داشت"
          >
        </div>


        <div class="form-group">
          <label for="review-body">
            متن دیدگاه
          </label>

          <textarea
            id="review-body"
            v-model="reviewBody"
            rows="5"
            placeholder="تجربه خود از این محصول را بنویسید..."
          ></textarea>
        </div>


        <div v-if="reviewError" class="form-message form-message--error">
          {{ reviewError }}
        </div>

        <div v-if="reviewSuccess" class="form-message form-message--success">
          {{ reviewSuccess }}
        </div>


        <div class="community-form__actions">
          <button
            type="submit"
            class="primary-button"
            :disabled="submittingReview"
          >
            {{ submittingReview ? 'در حال ارسال...' : 'ارسال دیدگاه' }}
          </button>

          <button
            type="button"
            class="secondary-button"
            :disabled="submittingReview"
            @click="closeReviewForm"
          >
            انصراف
          </button>
        </div>
      </form>


      <!-- ======================================
           Reviews loading
      ======================================= -->
      <div v-if="loadingReviews" class="community-loading">
        <span class="community-spinner"></span>
        در حال دریافت دیدگاه‌ها...
      </div>


      <!-- ======================================
           Reviews list
      ======================================= -->
      <div v-else-if="reviews.length" class="review-list">
        <article
          v-for="review in reviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-card__header">
            <div>
              <strong class="user-name">
                {{ review.user_name }}
              </strong>

              <div class="community-badges">
                <span
                  v-if="review.is_verified_purchase"
                  class="community-badge community-badge--verified"
                >
                  ✓ خریدار محصول
                </span>
              </div>
            </div>

            <time class="community-date">
              {{ formatDate(review.created_at) }}
            </time>
          </div>


          <div
            class="stars stars--small"
            :aria-label="`${review.rating} ستاره`"
          >
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ 'star--filled': star <= review.rating }"
            >
              ★
            </span>
          </div>


          <h3 v-if="review.title" class="review-card__title">
            {{ review.title }}
          </h3>

          <p class="review-card__body">
            {{ review.body }}
          </p>


          <!-- Helpful review -->
          <div class="helpful-row">
            <span>این دیدگاه مفید بود؟</span>

            <button
              type="button"
              class="helpful-button"
              :class="{ 'helpful-button--active': review.user_found_helpful }"
              :disabled="votingReviewId === review.id"
              :aria-pressed="review.user_found_helpful"
              @click="toggleReviewHelpful(review)"
            >
              <span>👍</span>

              <span>
                {{ review.helpful_count.toLocaleString('fa-IR') }}
              </span>
            </button>
          </div>
        </article>
      </div>


      <!-- Reviews empty -->
      <div v-else class="community-empty">
        <div class="community-empty__icon">☆</div>

        <strong>
          هنوز دیدگاهی ثبت نشده است
        </strong>

        <p>
          اولین نفری باشید که تجربه خود را درباره این محصول به اشتراک می‌گذارد.
        </p>

        <button
          type="button"
          class="primary-button"
          @click="openReviewForm"
        >
          ثبت اولین دیدگاه
        </button>
      </div>
    </div>


    <!-- ==========================================
         Questions
    =========================================== -->
    <div v-else class="community__content">

      <div class="question-summary">
        <div>
          <h2>پرسش و پاسخ</h2>

          <p>
            درباره این محصول سؤال دارید؟ از بازبیا و کاربران دیگر بپرسید.
          </p>
        </div>

        <button
          v-if="!showQuestionForm"
          type="button"
          class="primary-button"
          @click="openQuestionForm"
        >
          ثبت پرسش
        </button>
      </div>


      <!-- ======================================
           Question form
      ======================================= -->
      <form
        v-if="showQuestionForm"
        class="community-form"
        @submit.prevent="submitQuestion"
      >
        <div class="community-form__header">
          <div>
            <h3>پرسش شما</h3>

            <p>
              پرسش پس از بررسی در سایت منتشر می‌شود.
            </p>
          </div>

          <button
            type="button"
            class="close-button"
            aria-label="بستن فرم پرسش"
            @click="closeQuestionForm"
          >
            ×
          </button>
        </div>


        <div class="form-group">
          <label for="question-body">
            متن پرسش
          </label>

          <textarea
            id="question-body"
            v-model="questionBody"
            rows="4"
            placeholder="سؤال خود درباره این محصول را بنویسید..."
          ></textarea>
        </div>


        <div v-if="questionError" class="form-message form-message--error">
          {{ questionError }}
        </div>

        <div v-if="questionSuccess" class="form-message form-message--success">
          {{ questionSuccess }}
        </div>


        <div class="community-form__actions">
          <button
            type="submit"
            class="primary-button"
            :disabled="submittingQuestion"
          >
            {{ submittingQuestion ? 'در حال ارسال...' : 'ارسال پرسش' }}
          </button>

          <button
            type="button"
            class="secondary-button"
            :disabled="submittingQuestion"
            @click="closeQuestionForm"
          >
            انصراف
          </button>
        </div>
      </form>


      <!-- ======================================
           Questions loading
      ======================================= -->
      <div v-if="loadingQuestions" class="community-loading">
        <span class="community-spinner"></span>
        در حال دریافت پرسش‌ها...
      </div>


      <!-- ======================================
           Questions list
      ======================================= -->
      <div v-else-if="questions.length" class="question-list">
        <article
          v-for="question in questions"
          :key="question.id"
          class="question-card"
        >
          <div class="question-card__header">
            <div class="question-card__author">
              <span class="question-mark">
                ؟
              </span>

              <div>
                <strong>
                  {{ question.user_name }}
                </strong>

                <time class="community-date">
                  {{ formatDate(question.created_at) }}
                </time>
              </div>
            </div>
          </div>


          <p class="question-card__body">
            {{ question.body }}
          </p>


          <div class="question-card__meta">
            <span>
              {{ question.answer_count.toLocaleString('fa-IR') }}
              پاسخ
            </span>

            <button
              type="button"
              class="answer-button"
              @click="toggleAnswerForm(question.id)"
            >
              پاسخ دادن
            </button>
          </div>


          <!-- ====================================
               Answer form
          ===================================== -->
          <form
            v-if="answeringQuestionId === question.id"
            class="answer-form"
            @submit.prevent="submitAnswer(question.id)"
          >
            <textarea
              v-model="answerBody"
              rows="3"
              placeholder="پاسخ خود را بنویسید..."
            ></textarea>

            <div v-if="answerError" class="form-message form-message--error">
              {{ answerError }}
            </div>

            <div v-if="answerSuccess" class="form-message form-message--success">
              {{ answerSuccess }}
            </div>


            <div class="community-form__actions">
              <button
                type="submit"
                class="primary-button primary-button--small"
                :disabled="submittingAnswer"
              >
                {{ submittingAnswer ? 'در حال ارسال...' : 'ارسال پاسخ' }}
              </button>

              <button
                type="button"
                class="secondary-button secondary-button--small"
                :disabled="submittingAnswer"
                @click="closeAnswerForm"
              >
                انصراف
              </button>
            </div>
          </form>


          <!-- ====================================
               Answers
          ===================================== -->
          <div v-if="question.answers.length" class="answer-list">
            <article
              v-for="answer in question.answers"
              :key="answer.id"
              class="answer-card"
              :class="{ 'answer-card--official': answer.is_official }"
            >
              <div class="answer-card__header">
                <div>
                  <strong class="user-name">
                    {{ answer.user_name }}
                  </strong>

                  <div class="community-badges">
                    <span
                      v-if="answer.is_official"
                      class="community-badge community-badge--official"
                    >
                      ✓ پاسخ رسمی بازبیا
                    </span>

                    <span
                      v-else-if="answer.is_verified_purchase"
                      class="community-badge community-badge--verified"
                    >
                      ✓ خریدار محصول
                    </span>
                  </div>
                </div>

                <time class="community-date">
                  {{ formatDate(answer.created_at) }}
                </time>
              </div>


              <p class="answer-card__body">
                {{ answer.body }}
              </p>


              <!-- Helpful answer -->
              <div class="helpful-row">
                <span>این پاسخ مفید بود؟</span>

                <button
                  type="button"
                  class="helpful-button"
                  :class="{ 'helpful-button--active': answer.user_found_helpful }"
                  :disabled="votingAnswerId === answer.id"
                  :aria-pressed="answer.user_found_helpful"
                  @click="toggleAnswerHelpful(answer)"
                >
                  <span>👍</span>

                  <span>
                    {{ answer.helpful_count.toLocaleString('fa-IR') }}
                  </span>
                </button>
              </div>
            </article>
          </div>


          <p v-else class="no-answer">
            هنوز پاسخی برای این پرسش ثبت نشده است.
          </p>
        </article>
      </div>


      <!-- Questions empty -->
      <div v-else class="community-empty">
        <div class="community-empty__icon">؟</div>

        <strong>
          هنوز پرسشی ثبت نشده است
        </strong>

        <p>
          اگر درباره این محصول سؤالی دارید، آن را مطرح کنید.
        </p>

        <button
          type="button"
          class="primary-button"
          @click="openQuestionForm"
        >
          ثبت اولین پرسش
        </button>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">


import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/core/store/authStore'
import { communityService } from '@/services/community.service'
import type { ProductQuestion, ProductReview } from '@/types/community.types'

// ==========================================
// Props
// ==========================================

const props = defineProps<{slug: string }>()

// ==========================================
// Router / Auth
// ==========================================

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()


// ==========================================
// Tab
// ==========================================

type CommunityTab =
  | 'reviews'
  | 'questions'

const activeTab =
  ref<CommunityTab>('reviews')


// ==========================================
// Data
// ==========================================

const reviews = ref<ProductReview[]>([])
const questions = ref<ProductQuestion[]>([])
const reviewCount = ref(0)
const questionCount = ref(0)
const votingReviewId = ref<number | null>(null)
const votingAnswerId = ref<number | null>(null)

// ==========================================
// Loading
// ==========================================

const loadingReviews =
  ref(false)

const loadingQuestions =
  ref(false)

const loadError =
  ref<string | null>(null)


// ==========================================
// Review form
// ==========================================

const showReviewForm =ref(false)
const reviewRating = ref(0)
const reviewTitle = ref('')
const reviewBody = ref('')
const submittingReview = ref(false)
const reviewError = ref<string | null>(null)
const reviewSuccess = ref<string | null>(null)


// ==========================================
// Question form
// ==========================================

const showQuestionForm = ref(false)
const questionBody = ref('')
const submittingQuestion = ref(false)
const questionError = ref<string | null>(null)
const questionSuccess = ref<string | null>(null)


// ==========================================
// Answer form
// ==========================================

const answeringQuestionId =
  ref<number | null>(null)

const answerBody =
  ref('')

const submittingAnswer =
  ref(false)

const answerError =
  ref<string | null>(null)

const answerSuccess =
  ref<string | null>(null)


// ==========================================
// Rating summary
// ==========================================

const averageRating =
  computed<number>(() => {
    if (!reviews.value.length) {
      return 0
    }

    const total =
      reviews.value.reduce(
        (sum, review) =>
          sum + Number(review.rating),
        0,
      )

    return Number(
      (
        total /
        reviews.value.length
      ).toFixed(1),
    )
  })


const roundedAverageRating =
  computed<number>(() => {
    return Math.round(
      averageRating.value,
    )
  })


// ==========================================
// Error helper
// ==========================================

function firstString(
  value: unknown,
): string | null {
  if (
    typeof value === 'string' &&
    value.trim()
  ) {
    return value
  }

  if (Array.isArray(value)) {
    const item =
      value.find(
        entry =>
          typeof entry === 'string',
      )

    if (
      typeof item === 'string'
    ) {
      return item
    }
  }

  return null
}


function getErrorMessage(
  caughtError: unknown,
  fallback: string,
): string {
  const error =
    caughtError as {
      response?: {
        data?: unknown
      }
      message?: string
    }

  const data =
    error.response?.data

  const directMessage =
    firstString(data)

  if (directMessage) {
    return directMessage
  }

  if (
    data &&
    typeof data === 'object'
  ) {
    const record =
      data as Record<string, unknown>

    const keys = [
      'detail',
      'message',
      'non_field_errors',
      'body',
      'rating',
      'title',
    ]

    for (const key of keys) {
      const message =
        firstString(
          record[key],
        )

      if (message) {
        return message
      }
    }
  }

  if (
    error.message &&
    error.message.trim()
  ) {
    return error.message
  }

  return fallback
}


// ==========================================
// Date
// ==========================================

function formatDate(
  value: string,
): string {
  if (!value) {
    return ''
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(date)
}


// ==========================================
// Login
// ==========================================

async function goToLogin():
  Promise<void> {
  await router.push({
    path: '/login',
    query: {
      redirect:
        route.fullPath,
    },
  })
}


async function ensureAuthenticated():
  Promise<boolean> {
  if (
    authStore.isAuthenticated
  ) {
    return true
  }

  await goToLogin()

  return false
}


// ==========================================
// Load reviews
// ==========================================

async function loadReviews():
  Promise<void> {
  if (!props.slug) {
    return
  }

  loadingReviews.value =
    true

  try {
    const result =
      await communityService
        .getReviews(
          props.slug,
        )

    reviews.value =
      result.items

    reviewCount.value =
      result.count

  } catch (caughtError) {
    throw new Error(
      getErrorMessage(
        caughtError,
        'دریافت دیدگاه‌ها انجام نشد.',
      ),
    )

  } finally {
    loadingReviews.value =
      false
  }
}


async function toggleReviewHelpful(review: ProductReview): Promise<void> {
  if (!await ensureAuthenticated()) return

  if (votingReviewId.value === review.id) return

  votingReviewId.value = review.id

  try {
    const result = await communityService.toggleReviewHelpful(review.id)

    review.helpful_count = result.helpful_count
    review.user_found_helpful = result.helpful
  } catch (error) {
    loadError.value = getErrorMessage(error, 'ثبت رأی دیدگاه انجام نشد.')
  } finally {
    votingReviewId.value = null
  }
}


async function toggleAnswerHelpful(answer: ProductQuestion['answers'][number]): Promise<void> {
  if (!await ensureAuthenticated()) return

  if (votingAnswerId.value === answer.id) return

  votingAnswerId.value = answer.id

  try {
    const result = await communityService.toggleAnswerHelpful(answer.id)

    answer.helpful_count = result.helpful_count
    answer.user_found_helpful = result.helpful
  } catch (error) {
    loadError.value = getErrorMessage(error, 'ثبت رأی پاسخ انجام نشد.')
  } finally {
    votingAnswerId.value = null
  }
}




// ==========================================
// Load questions
// ==========================================

async function loadQuestions():
  Promise<void> {
  if (!props.slug) {
    return
  }

  loadingQuestions.value =
    true

  try {
    const result =
      await communityService
        .getQuestions(
          props.slug,
        )

    questions.value =
      result.items

    questionCount.value =
      result.count

  } catch (caughtError) {
    throw new Error(
      getErrorMessage(
        caughtError,
        'دریافت پرسش‌ها انجام نشد.',
      ),
    )

  } finally {
    loadingQuestions.value =
      false
  }
}


// ==========================================
// Load community
// ==========================================

async function loadCommunity():
  Promise<void> {
  if (!props.slug) {
    return
  }

  loadError.value =
    null

  const results =
    await Promise.allSettled([
      loadReviews(),
      loadQuestions(),
    ])

  const rejected =
    results.find(
      result =>
        result.status ===
        'rejected',
    )

  if (
    rejected &&
    rejected.status ===
      'rejected'
  ) {
    loadError.value =
      rejected.reason instanceof Error
        ? rejected.reason.message
        : 'دریافت اطلاعات انجام نشد.'
  }
}


// ==========================================
// Review
// ==========================================

async function openReviewForm():
  Promise<void> {
  const authenticated =
    await ensureAuthenticated()

  if (!authenticated) {
    return
  }

  reviewError.value =
    null

  reviewSuccess.value =
    null

  showReviewForm.value =
    true
}


function closeReviewForm():
  void {
  showReviewForm.value =
    false

  reviewError.value =
    null

  reviewSuccess.value =
    null
}


async function submitReview():
  Promise<void> {
  if (
    !await ensureAuthenticated()
  ) {
    return
  }

  reviewError.value =
    null

  reviewSuccess.value =
    null

  if (
    reviewRating.value < 1 ||
    reviewRating.value > 5
  ) {
    reviewError.value =
      'لطفاً امتیاز خود را از ۱ تا ۵ انتخاب کنید.'

    return
  }

  const body =
    reviewBody.value.trim()

  if (!body) {
    reviewError.value =
      'لطفاً متن دیدگاه را وارد کنید.'

    return
  }

  submittingReview.value =
    true

  try {
    await communityService
      .createReview(
        props.slug,
        {
          rating:
            reviewRating.value,

          title:
            reviewTitle.value
              .trim(),

          body,
        },
      )

    reviewRating.value =
      0

    reviewTitle.value =
      ''

    reviewBody.value =
      ''

    reviewSuccess.value =
      'دیدگاه شما ثبت شد و پس از بررسی نمایش داده می‌شود.'

  } catch (caughtError) {
    reviewError.value =
      getErrorMessage(
        caughtError,
        'ثبت دیدگاه انجام نشد.',
      )

  } finally {
    submittingReview.value =
      false
  }
}


// ==========================================
// Question
// ==========================================

async function openQuestionForm():
  Promise<void> {
  const authenticated =
    await ensureAuthenticated()

  if (!authenticated) {
    return
  }

  questionError.value =
    null

  questionSuccess.value =
    null

  showQuestionForm.value =
    true
}


function closeQuestionForm():
  void {
  showQuestionForm.value =
    false

  questionError.value =
    null

  questionSuccess.value =
    null
}


async function submitQuestion():
  Promise<void> {
  if (
    !await ensureAuthenticated()
  ) {
    return
  }

  questionError.value =
    null

  questionSuccess.value =
    null

  const body =
    questionBody.value.trim()

  if (!body) {
    questionError.value =
      'لطفاً متن پرسش را وارد کنید.'

    return
  }

  submittingQuestion.value =
    true

  try {
    await communityService
      .createQuestion(
        props.slug,
        {
          body,
        },
      )

    questionBody.value =
      ''

    questionSuccess.value =
      'پرسش شما ثبت شد و پس از بررسی نمایش داده می‌شود.'

  } catch (caughtError) {
    questionError.value =
      getErrorMessage(
        caughtError,
        'ثبت پرسش انجام نشد.',
      )

  } finally {
    submittingQuestion.value =
      false
  }
}


// ==========================================
// Answer
// ==========================================

async function toggleAnswerForm(
  questionId: number,
): Promise<void> {
  const authenticated =
    await ensureAuthenticated()

  if (!authenticated) {
    return
  }

  if (
    answeringQuestionId.value ===
      questionId
  ) {
    closeAnswerForm()

    return
  }

  answeringQuestionId.value =
    questionId

  answerBody.value =
    ''

  answerError.value =
    null

  answerSuccess.value =
    null
}


function closeAnswerForm():
  void {
  answeringQuestionId.value =
    null

  answerBody.value =
    ''

  answerError.value =
    null

  answerSuccess.value =
    null
}


async function submitAnswer(
  questionId: number,
): Promise<void> {
  if (
    !await ensureAuthenticated()
  ) {
    return
  }

  answerError.value =
    null

  answerSuccess.value =
    null

  const body =
    answerBody.value.trim()

  if (!body) {
    answerError.value =
      'لطفاً متن پاسخ را وارد کنید.'

    return
  }

  submittingAnswer.value =
    true

  try {
    await communityService
      .createAnswer(
        questionId,
        {
          body,
        },
      )

    answerBody.value =
      ''

    answerSuccess.value =
      'پاسخ شما ثبت شد و پس از بررسی نمایش داده می‌شود.'

  } catch (caughtError) {
    answerError.value =
      getErrorMessage(
        caughtError,
        'ثبت پاسخ انجام نشد.',
      )

  } finally {
    submittingAnswer.value =
      false
  }
}


// ==========================================
// Product change
// ==========================================

watch(
  () => props.slug,

  () => {
    reviews.value =
      []

    questions.value =
      []

    reviewCount.value =
      0

    questionCount.value =
      0

    closeReviewForm()
    closeQuestionForm()
    closeAnswerForm()

    void loadCommunity()
  },

  {
    immediate: true,
  },
)
</script>


<style scoped>
.community {
  direction: rtl;
  margin-top: 2.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

/* ==========================================
   Tabs
========================================== */

.community__header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom:
    1px solid #e5e7eb;
}

.community__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding:0.85rem 1rem;
  border: 0;
  border-bottom:3px solid transparent;
  background: transparent;
  color: #64748b;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.community__tab:hover {
  color: #15803d;
}

.community__tab--active {
  border-bottom-color: #15803d;
  color: #15803d;
}

.community__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6rem;
  height: 1.6rem;
  padding:0 0.4rem;
  border-radius: 999px;
  background:  #f1f5f9;
  color:   #475569;
  font-size:  0.75rem;
}


/* ==========================================
   Content
========================================== */

.community__content {
  min-height:
    200px;
}

.review-summary,
.question-summary {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 1.5rem;

  margin-bottom: 1.5rem;
}

.review-summary h2,
.question-summary h2 {
  margin:
    0
    0
    0.5rem;

  color: #111827;

  font-size:
    1.25rem;
}

.question-summary p,
.review-summary__description {
  margin:
    0.5rem
    0
    0;

  color:
    #64748b;

  font-size:
    0.88rem;

  line-height:
    1.8;
}

.review-summary__rating {
  display: flex;

  align-items: baseline;

  gap: 0.3rem;

  margin-top:
    0.5rem;
}

.review-summary__rating strong {
  color:
    #111827;

  font-size:
    1.5rem;
}

.review-summary__rating span {
  color:
    #64748b;

  font-size:
    0.8rem;
}


/* ==========================================
   Stars
========================================== */

.stars {
  display: flex;

  direction: ltr;

  gap: 0.12rem;

  margin-top:
    0.25rem;
}

.star {
  color:
    #d1d5db;

  font-size:
    1.2rem;
}

.star--filled {
  color:
    #f59e0b;
}

.stars--small .star {
  font-size:
    1rem;
}


/* ==========================================
   Buttons
========================================== */

.primary-button,
.secondary-button,
.answer-button,
.text-button,
.close-button {
  font-family: inherit;

  cursor: pointer;
}

.primary-button {
  padding:
    0.75rem
    1.25rem;

  border:
    1px solid #15803d;

  border-radius:
    0.7rem;

  background:
    #15803d;

  color:
    #ffffff;

  font-size:
    0.88rem;

  font-weight:
    800;

  transition:
    background 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background:
    #166534;
}

.primary-button:disabled {
  opacity:
    0.6;

  cursor:
    not-allowed;
}

.primary-button--small {
  padding:
    0.6rem
    1rem;
}

.secondary-button {
  padding:
    0.75rem
    1.25rem;

  border:
    1px solid #d1d5db;

  border-radius:
    0.7rem;

  background:
    #ffffff;

  color:
    #374151;

  font-size:
    0.85rem;

  font-weight:
    700;
}

.secondary-button--small {
  padding:
    0.6rem
    1rem;
}

.answer-button {
  border: 0;

  background:
    transparent;

  color:
    #15803d;

  font-size:
    0.82rem;

  font-weight:
    800;
}

.text-button {
  margin-right:
    0.5rem;

  border: 0;

  background:
    transparent;

  color:
    inherit;

  text-decoration:
    underline;
}

.close-button {
  border: 0;

  background:
    transparent;

  color:
    #64748b;

  font-size:
    1.5rem;

  line-height:
    1;
}


/* ==========================================
   Forms
========================================== */

.community-form {
  margin-bottom:
    1.5rem;

  padding:
    1.25rem;

  border:
    1px solid #dcfce7;

  border-radius:
    0.9rem;

  background:
    #f8fdf9;
}

.community-form__header {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom:
    1.2rem;
}

.community-form__header h3 {
  margin: 0;

  color:
    #111827;

  font-size:
    1rem;
}

.community-form__header p {
  margin:
    0.35rem
    0
    0;

  color:
    #64748b;

  font-size:
    0.78rem;
}

.form-group {
  margin-bottom:
    1rem;
}

.form-group label {
  display:
    block;

  margin-bottom:
    0.45rem;

  color:
    #374151;

  font-size:
    0.85rem;

  font-weight:
    700;
}

.optional {
  color:
    #94a3b8;

  font-size:
    0.72rem;

  font-weight:
    400;
}

.form-group input,
.form-group textarea,
.answer-form textarea {
  width:
    100%;

  box-sizing:
    border-box;

  padding:
    0.75rem
    0.85rem;

  border:
    1px solid #d1d5db;

  border-radius:
    0.65rem;

  background:
    #ffffff;

  color:
    #111827;

  font-family:
    inherit;

  font-size:
    0.88rem;

  outline:
    none;

  resize:
    vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.answer-form textarea:focus {
  border-color:
    #15803d;

  box-shadow:
    0 0 0 3px
    rgba(21, 128, 61, 0.08);
}

.community-form__actions {
  display: flex;

  align-items: center;

  gap:
    0.6rem;

  margin-top:
    1rem;
}


/* ==========================================
   Rating input
========================================== */

.rating-input {
  display:
    inline-flex;

  direction:
    ltr;

  gap:
    0.2rem;
}

.rating-star {
  padding: 0;

  border: 0;

  background:
    transparent;

  color:
    #d1d5db;

  font-size:
    1.8rem;

  cursor:
    pointer;
}

.rating-star--active {
  color:
    #f59e0b;
}


/* ==========================================
   Review cards
========================================== */

.review-list,
.question-list {
  display: grid;

  gap:
    1rem;
}

.review-card {
  padding:
    1.2rem;

  border:
    1px solid #e5e7eb;

  border-radius:
    0.85rem;

  background:
    #ffffff;
}

.review-card__header,
.answer-card__header {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap:
    1rem;
}

.user-name {
  color:
    #1f2937;

  font-size:
    0.9rem;
}

.review-card__title {
  margin:
    0.8rem
    0
    0.35rem;

  color:
    #111827;

  font-size:
    0.95rem;
}

.review-card__body,
.answer-card__body,
.question-card__body {
  white-space:
    pre-wrap;

  overflow-wrap:
    anywhere;

  color:
    #374151;

  font-size:
    0.88rem;

  line-height:
    1.9;
}


/* ==========================================
   Badges
========================================== */

.community-badges {
  display: flex;

  flex-wrap: wrap;

  gap:
    0.35rem;

  margin-top:
    0.35rem;
}

.community-badge {
  display:
    inline-flex;

  align-items:
    center;

  padding:
    0.22rem
    0.5rem;

  border-radius:
    999px;

  font-size:
    0.7rem;

  font-weight:
    800;
}

.community-badge--verified {
  background:
    #ecfdf5;

  color:
    #047857;
}

.community-badge--official {
  background:
    #eff6ff;

  color:
    #1d4ed8;
}


/* ==========================================
   Questions
========================================== */

.question-card {
  padding:
    1.25rem;

  border:
    1px solid #e5e7eb;

  border-radius:
    0.9rem;

  background:
    #ffffff;
}

.question-card__author {
  display: flex;

  align-items: center;

  gap:
    0.7rem;
}

.question-card__author strong {
  display:
    block;

  color:
    #1f2937;

  font-size:
    0.88rem;
}

.question-mark {
  display:
    inline-flex;

  align-items:
    center;
  justify-content:
    center;

  width:
    2.2rem;
  height:
    2.2rem;

  border-radius:
    50%;

  background:
    #f0fdf4;

  color:
    #15803d;

  font-size:
    1rem;

  font-weight:
    900;
}

.question-card__meta {
  display: flex;

  align-items:
    center;
  justify-content:
    space-between;

  margin-top:
    1rem;

  padding-top:
    0.8rem;

  border-top:
    1px solid #f1f5f9;

  color:
    #64748b;

  font-size:
    0.78rem;
}


/* ==========================================
   Answers
========================================== */

.answer-form {
  margin-top:
    1rem;

  padding:
    1rem;

  border-radius:
    0.75rem;

  background:
    #f8fafc;
}

.answer-list {
  display:
    grid;

  gap:
    0.75rem;

  margin-top:
    1rem;

  padding-right:
    1rem;

  border-right:
    2px solid #e5e7eb;
}

.answer-card {
  padding:
    1rem;

  border:
    1px solid #f1f5f9;

  border-radius:
    0.75rem;

  background:
    #f8fafc;
}

.answer-card--official {
  border-color:
    #dbeafe;

  background:
    #f8fbff;
}

.no-answer {
  margin:
    1rem
    0
    0;

  color:
    #94a3b8;

  font-size:
    0.8rem;
}


/* ==========================================
   Date
========================================== */

.community-date {
  display:
    block;

  margin-top:
    0.15rem;

  color:
    #94a3b8;

  font-size:
    0.7rem;

  white-space:
    nowrap;
}


/* ==========================================
   Messages
========================================== */

.form-message,
.community-message {
  margin-top:
    0.75rem;

  padding:
    0.7rem
    0.85rem;

  border-radius:
    0.65rem;

  font-size:
    0.8rem;
}

.form-message--error,
.community-message--error {
  border:
    1px solid #fecaca;

  background:
    #fef2f2;

  color:
    #b91c1c;
}

.form-message--success {
  border:
    1px solid #bbf7d0;

  background:
    #f0fdf4;

  color:
    #166534;
}


/* ==========================================
   Loading
========================================== */

.community-loading {
  display: flex;

  align-items:
    center;
  justify-content:
    center;

  gap:
    0.6rem;

  min-height:
    140px;

  color:
    #64748b;

  font-size:
    0.85rem;
}

.community-spinner {
  width:
    1.2rem;
  height:
    1.2rem;

  border:
    2px solid #dcfce7;

  border-top-color:
    #15803d;

  border-radius:
    50%;

  animation:
    community-spin
    0.7s
    linear
    infinite;
}

@keyframes community-spin {
  to {
    transform:
      rotate(360deg);
  }
}


/* ==========================================
   Empty
========================================== */

.community-empty {
  display: flex;

  flex-direction:
    column;

  align-items:
    center;

  padding:
    2.5rem
    1rem;

  text-align:
    center;

  color:
    #64748b;
}

.community-empty__icon {
  display:
    flex;

  align-items:
    center;
  justify-content:
    center;

  width:
    3.5rem;
  height:
    3.5rem;

  margin-bottom:
    0.8rem;

  border-radius:
    50%;

  background:
    #f0fdf4;

  color:
    #15803d;

  font-size:
    1.8rem;
}

.community-empty strong {
  color:
    #374151;
}

.community-empty p {
  margin:
    0.4rem
    0
    1rem;

  font-size:
    0.82rem;

  line-height:
    1.8;
}


/* ==========================================
   Mobile
========================================== */

@media (max-width: 600px) {
  .community {
    margin-top:
      1.5rem;

    padding-top:
      1.25rem;
  }

  .community__header {
    width:
      100%;
  }

  .community__tab {
    flex:
      1;

    justify-content:
      center;

    padding:
      0.8rem
      0.4rem;

    font-size:
      0.82rem;
  }

  .review-summary,
  .question-summary {
    flex-direction:
      column;
  }

  .review-summary > .primary-button,
  .question-summary > .primary-button {
    width:
      100%;
  }

  .review-card__header,
  .answer-card__header {
    flex-direction:
      column;

    gap:
      0.4rem;
  }

  .community-form {
    padding:
      1rem;
  }

  .community-form__actions {
    align-items:stretch;
    flex-direction: column;
  }

  .community-form__actions button {
    width: 100%;
  }

  .answer-list {
    padding-right: 0.6rem;
  }
}

.helpful-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.78rem;
}
.helpful-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #ffffff;
  color: #475569;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}
.helpful-btn:hover:not(:disabled) {
  border-color: #86efac;
  background: #f0fdf4;
  color: #15803d;
}
.helpful-btn.active {
  border-color: #86efac;
  background: #dcfce7;
  color: #166534;
}

.helpful-btn:disabled {
  opacity: 0.55;
  cursor: wait;
}
</style>