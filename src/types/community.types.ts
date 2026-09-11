export type CommunityStatus =
  | 'pending'
  | 'approved'
  | 'rejected'


export interface HelpfulVoteResponse {
  helpful: boolean
  helpful_count: number
}



// =========================================================
// Review
// =========================================================

export interface ProductReview {
  id: number
  product_id: number
  user_name: string

  rating: number
  title: string
  body: string

  is_verified_purchase: boolean
  status: CommunityStatus

  created_at: string
  updated_at: string
  helpful_count: number
  user_found_helpful: boolean

}


export interface CreateReviewPayload {
  rating: number
  title?: string
  body: string
}


// =========================================================
// Answer
// =========================================================

export interface ProductAnswer {
  id: number
  question_id: number
  user_name: string

  body: string

  is_verified_purchase: boolean
  is_official: boolean

  status: CommunityStatus

  created_at: string
  updated_at: string
  helpful_count: number
  user_found_helpful: boolean
}


export interface CreateAnswerPayload {
  body: string
}


// =========================================================
// Question
// =========================================================

export interface ProductQuestion {
  id: number
  product_id: number
  user_name: string

  body: string
  status: CommunityStatus

  answers: ProductAnswer[]
  answer_count: number

  created_at: string
  updated_at: string
}


export interface CreateQuestionPayload {
  body: string
}


// =========================================================
// Pagination
// =========================================================

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}


export interface CommunityList<T> {
  items: T[]
  count: number
}