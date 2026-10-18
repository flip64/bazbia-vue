export const money = (value: string | number | null | undefined) =>
  value == null ? "—" : Number(value).toLocaleString("fa-IR");
export const number = (value: string | number | null | undefined) =>
  value == null || value === ""
    ? "نامشخص"
    : Number(value).toLocaleString("fa-IR", {
        maximumFractionDigits: 6,
        useGrouping: false,
      });
export const calendars: Record<string, string> = {
  solar_hijri: "هجری شمسی",
  lunar_hijri: "هجری قمری",
  gregorian: "میلادی",
  imperial_iran: "شاهنشاهی",
  regnal: "سال سلطنت",
  other: "سایر",
};
export const views: Record<string, string> = {
  obverse: "روی سکه",
  reverse: "پشت سکه",
  edge: "لبه",
  detail: "جزئیات",
  pack: "نمای پک",
  certificate: "گواهی",
};
export function latinDigits(value: string): string {
  return value
    .trim()
    .replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
    .replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c)));
}
export function safeURL(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, window.location.origin);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
