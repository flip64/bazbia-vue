export interface CoinNamed {
  id: number;
  name: string;
  name_en: string;
  slug: string;
}
export interface CoinChoice {
  value: string;
  label: string;
}
export interface CoinImage {
  id: number;
  url: string | null;
  alt_text: string | null;
  is_main: boolean;
  view_type: string | null;
  pack_item_id: number | null;
  caption: string;
}
export interface CoinCard {
  is_group?: boolean;
  images?: CoinImage[];
  id: number;
  name: string;
  slug: string;
  issuer: CoinNamed | null;
  period?: CoinNamed | null;
  denomination_label?: string;
  calendar: string;
  year_start?: number | null;
  year_end?: number | null;
  year?: number;
  construction?: string;
  shape?: string;
  mint_year?: number | null;
  min_price: string | null;
  currency: string;
  in_stock: boolean;
  image: CoinImage | null;
  is_complete?: boolean;
}
export interface CoinPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: CoinCard[];
}
export interface CoinFilters {
  issuers: CoinNamed[];
  periods: CoinNamed[];
  rulers: CoinNamed[];
  currencies: CoinNamed[];
  materials: CoinNamed[];
  themes: CoinNamed[];
  mints: CoinNamed[];
  years: { calendar: string; year: number }[];
  calendars: CoinChoice[];
  shapes: CoinChoice[];
  constructions: CoinChoice[];
  issue_kinds: CoinChoice[];
  conditions: CoinChoice[];
  finishes: CoinChoice[];
  ordering: CoinChoice[];
}
export interface PackItem {
  id: number;
  issue_id: number;
  coin_type_id: number;
  coin_slug: string;
  coin_name: string;
  year: number | null;
  calendar: string;
  finish: string;
  mint_mark: string;
  quantity: number;
  condition_grade: string;
  condition_label: string;
  notes: string;
  position: number;
}
export interface CoinSale {
  variant_label?: string;
  id: number;
  variant_id: number;
  product_id: number;
  product_slug: string;
  sku: string;
  price: string;
  discount_price: string | null;
  effective_price: string;
  available_stock: number;
  can_purchase: boolean;
  currency: string;
  sale_mode: "unique" | "similar";
  condition_notes: string;
  images: CoinImage[];
  condition_grade?: string;
  condition_label?: string;
  cleaned?: boolean | null;
  scratched?: boolean | null;
  corroded?: boolean | null;
  edge_damaged?: boolean | null;
  holed?: boolean | null;
  bent?: boolean | null;
  repaired?: boolean | null;
  defect_notes?: string;
  patina_description?: string;
  mint_error_description?: string;
  authenticity_notes?: string;
  grading_company?: string;
  certification_number?: string;
  certification_url?: string;
  grading_designation?: string;
  numeric_grade?: number | null;
  measured_weight_g?: string | null;
  measured_diameter_mm?: string | null;
  measured_thickness_mm?: string | null;
  packaging?: string;
  packaging_notes?: string;
  coin_count?: number;
  items?: PackItem[];
}
export interface CoinReference {
  catalog: string;
  number: string;
  url: string;
}
export interface CoinIssue {
  images: CoinImage[];
  description: string;
  id: number;
  year: number | null;
  calendar: string;
  date_status: string;
  date_status_label: string;
  date_inscription: string;
  gregorian_year_start: number | null;
  gregorian_year_end: number | null;
  mint: CoinNamed | null;
  mint_mark: string;
  variety_code: string;
  variety_description: string;
  finish: string;
  finish_label: string;
  mintage: number | null;
  references: CoinReference[];
  specimens: CoinSale[];
}
export interface CoinDetail {
  year_story?: string;
  group_slug?: string | null;
  images: CoinImage[];
  related_years?: { slug: string; year: number }[];
  mint_year?: number | null;
  introduction: string;
  story: string;
  story_sources: string;
  id: number;
  name: string;
  slug: string;
  issuer: CoinNamed;
  period: CoinNamed | null;
  ruler: CoinNamed | null;
  currency: CoinNamed | null;
  face_value: string | null;
  denomination_label: string;
  issue_kind: string;
  calendar: string;
  calendar_notes: string;
  year_start: number | null;
  year_end: number | null;
  construction: string;
  construction_label: string;
  shape: string;
  shape_label: string;
  shape_notes: string;
  side_count: number | null;
  has_hole: boolean | null;
  weight_g: string | null;
  diameter_mm: string | null;
  width_mm: string | null;
  height_mm: string | null;
  thickness_mm: string | null;
  edge_type: string;
  edge_label: string;
  edge_inscription: string;
  edge_notes: string;
  alignment_degrees: number | null;
  obverse_description: string;
  obverse_inscription: string;
  obverse_designer: string;
  reverse_description: string;
  reverse_inscription: string;
  reverse_designer: string;
  languages: string;
  themes: CoinNamed[];
  series_name: string;
  description: string;
  composition_parts: {
    part: string;
    part_label: string;
    position: number;
    material: CoinNamed;
    fineness: string | null;
    notes: string;
  }[];
  references: CoinReference[];
  issues: CoinIssue[];
}
export interface PackDetail {
  id: number;
  name: string;
  slug: string;
  year: number;
  calendar: string;
  calendar_notes: string;
  issuer: CoinNamed | null;
  is_complete: boolean;
  completeness_scope: string;
  packaging: string;
  description: string;
  variants: CoinSale[];
}
export type CoinKind = "coin" | "pack";

export interface CoinGroupDetail {
  id: number; slug: string; name: string;
  introduction: string; story: string; story_sources: string;
  images: CoinImage[]; years: CoinDetail[];
}
