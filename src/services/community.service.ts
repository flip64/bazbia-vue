import apiClient from '@/core/api/client'



import type {
  CommunityList,
  CreateAnswerPayload,
  CreateQuestionPayload,
  CreateReviewPayload,
  HelpfulVoteResponse,

  PaginatedResponse,
  ProductAnswer,
  ProductQuestion,
  ProductReview,
} from '@/types/community.types'


// =========================================================
// Helpers
// =========================================================

function normalizeList<T>(
  data: T[] | PaginatedResponse<T>,
): CommunityList<T> {
  if (Array.isArray(data)) {
    return {
      items: data,
      count: data.length,
    }
  }

  return {
    items: data.results ?? [],
    count: Number(data.count ?? 0),
  }
}


function safeSlug(slug: string): string {
  return encodeURIComponent(slug)
}


// =========================================================
// Community Service
// =========================================================

export const communityService = {

  // =======================================================
  // Reviews
  // =======================================================
  async toggleReviewHelpful(reviewId: number): Promise<HelpfulVoteResponse> {
   const response = await apiClient.post<HelpfulVoteResponse>(`/reviews/${reviewId}/helpful/`)
   return response.data
  },

  async toggleAnswerHelpful(answerId: number): Promise<HelpfulVoteResponse> {
    const response = await apiClient.post<HelpfulVoteResponse>(`/answers/${answerId}/helpful/`)
    return response.data
  },


  async getReviews(
    slug: string,
  ): Promise<CommunityList<ProductReview>> {
    const response = await apiClient.get<
      ProductReview[] | PaginatedResponse<ProductReview>
    >(
      `/products/${safeSlug(slug)}/reviews/`,
    )

    return normalizeList(response.data)
  },


  async createReview(
    slug: string,
    payload: CreateReviewPayload,
  ): Promise<ProductReview> {
    const response = await apiClient.post<ProductReview>(
      `/products/${safeSlug(slug)}/reviews/`,
      payload,
    )

    return response.data
  },


  // =======================================================
  // Questions
  // =======================================================

  async getQuestions(
    slug: string,
  ): Promise<CommunityList<ProductQuestion>> {
    const response = await apiClient.get<
      ProductQuestion[] | PaginatedResponse<ProductQuestion>
    >(
      `/products/${safeSlug(slug)}/questions/`,
    )

    return normalizeList(response.data)
  },


  async createQuestion(
    slug: string,
    payload: CreateQuestionPayload,
  ): Promise<ProductQuestion> {
    const response = await apiClient.post<ProductQuestion>(
      `/products/${safeSlug(slug)}/questions/`,
      payload,
    )

    return response.data
  },


  // =======================================================
  // Answers
  // =======================================================

  async createAnswer(
    questionId: number,
    payload: CreateAnswerPayload,
  ): Promise<ProductAnswer> {
    const response = await apiClient.post<ProductAnswer>(
      `/questions/${questionId}/answers/`,
      payload,
    )

    return response.data
  },
}