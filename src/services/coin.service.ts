import axios from "axios";
import apiClient from "@/core/api/client";
import type {
  CoinDetail,
  CoinFilters,
  CoinKind,
  CoinPage,
  PackDetail,
} from "@/types/coin.types";

// Public coin endpoints reject unknown parameters. Do not inject the shared
// client's _t or guest session_key metadata into these read-only requests.
const publicClient = axios.create({
  baseURL: apiClient.defaults.baseURL,
  timeout: 15000,
});
export const coinService = {
  async list(
    kind: CoinKind,
    params: Record<string, string>,
    signal?: AbortSignal,
  ) {
    const { data } = await publicClient.get<CoinPage>(
      kind === "pack" ? "/coins/packs/" : "/coins/",
      { params, signal },
    );
    return data;
  },
  async filters(signal?: AbortSignal) {
    return (await publicClient.get<CoinFilters>("/coins/filters/", { signal }))
      .data;
  },
  async coin(slug: string, signal?: AbortSignal) {
    return (
      await publicClient.get<CoinDetail>(
        `/coins/${encodeURIComponent(slug)}/`,
        { signal },
      )
    ).data;
  },
  async pack(slug: string, signal?: AbortSignal) {
    return (
      await publicClient.get<PackDetail>(
        `/coins/packs/${encodeURIComponent(slug)}/`,
        { signal },
      )
    ).data;
  },
};
export function coinError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404)
      return "این سکه یا پک پیدا نشد یا هنوز منتشر نشده است.";
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const messages = Object.values(data)
        .flat()
        .filter((v): v is string => typeof v === "string");
      if (messages.length) return messages.join("؛ ");
    }
    return "دریافت اطلاعات ممکن نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.";
  }
  return error instanceof Error
    ? error.message
    : "عملیات انجام نشد. دوباره تلاش کنید.";
}
