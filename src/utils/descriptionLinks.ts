export type DescriptionPart = { text: string; href?: string }

// Parse inline Markdown links without interpreting any user-supplied HTML.
export function parseDescriptionLinks(text: string): DescriptionPart[] {
  const parts: DescriptionPart[] = []
  const pattern = /\[([^\]\n]+)\]\((https?:\/\/(?:[^\s()]+|\([^\s()]*\))+)\)/gi
  let cursor = 0

  for (const match of text.matchAll(pattern)) {
    const label = match[1]!
    const href = match[2]!
    try {
      const url = new URL(href)
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) continue
    } catch {
      continue
    }

    const index = match.index!
    if (index > cursor) parts.push({ text: text.slice(cursor, index) })
    parts.push({ text: label, href })
    cursor = index + match[0].length
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}
