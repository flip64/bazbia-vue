const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend.bazbia.ir"


function getVisitorId() {
  let visitorId = localStorage.getItem("bazbia_visitor_id")

  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem("bazbia_visitor_id", visitorId)
  }

  return visitorId
}


function getUTMParams() {
  const params = new URLSearchParams(window.location.search)

  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  }
}


function detectSource() {
  const params = new URLSearchParams(window.location.search)

  const utmSource = params.get("utm_source")

  if (utmSource) {
    return utmSource
  }

  const referrer = document.referrer

  if (!referrer) {
    return "direct"
  }

  try {
    const host = new URL(referrer).hostname.toLowerCase()

    if (host.includes("google.")) return "google"
    if (host.includes("torob.com")) return "torob"
    if (host.includes("eitaa.com")) return "eitaa"
    if (host.includes("rubika.ir")) return "rubika"
    if (host.includes("ble.ir")) return "bale"
    if (host.includes("instagram.com")) return "instagram"
    if (host.includes("t.me")) return "telegram"

    return host
  } catch {
    return "unknown"
  }
}


export async function trackPageView() {
  const utm = getUTMParams()

  const payload = {
    event_type: "page_view",

    path: window.location.pathname,

    page_url: window.location.href,

    referrer: document.referrer || "",

    source: detectSource(),

    visitor_id: getVisitorId(),

    ...utm,
  }

  try {
    await fetch(
      `${API_BASE_URL}/api/analytics/events/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    )
  } catch (error) {
    // آمار نباید باعث اختلال در سایت شود.
    console.debug(
      "Analytics request failed:",
      error
    )
  }
}
