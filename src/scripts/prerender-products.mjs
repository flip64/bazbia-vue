import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises'

import {
  resolve,
} from 'node:path'


// ==========================================
// Configuration
// ==========================================

const SITE_URL =
  'https://bazbia.ir'

const API_URL =
  'https://backend.bazbia.ir/api'

const SITEMAP_URL =
  'https://backend.bazbia.ir/sitemap.xml'

const DIST =
  resolve('dist')

const SEO_DIR =
  resolve(
    DIST,
    'seo-pages',
  )


// ==========================================
// Helpers
// ==========================================

const escapeHtml =
  value =>
    String(value ?? '')
      .replaceAll(
        '&',
        '&amp;',
      )
      .replaceAll(
        '<',
        '&lt;',
      )
      .replaceAll(
        '>',
        '&gt;',
      )
      .replaceAll(
        '"',
        '&quot;',
      )
      .replaceAll(
        "'",
        '&#039;',
      )


const plainText =
  value =>
    String(value ?? '')
      .replace(
        /<[^>]*>/g,
        ' ',
      )
      .replace(
        /\s+/g,
        ' ',
      )
      .trim()


function descriptionFor(
  product,
) {
  const text =
    plainText(
      product.description,
    )

  if (
    text.length >= 70
  ) {
    return (
      text
        .slice(
          0,
          157,
        )
        .trimEnd() +
      (
        text.length > 157
          ? '…'
          : ''
      )
    )
  }

  return (
    `خرید ${product.name} ` +
    'با بررسی مشخصات، تصاویر، موجودی و قیمت روز ' +
    'از فروشگاه اینترنتی بازبیا.'
  )
}


function imageFor(
  product,
) {
  return (
    product.images?.find(
      image =>
        image.is_main,
    )?.image ||

    product.images?.[0]?.image ||

    `${SITE_URL}/bazbia_log.svg`
  )
}


function variantFor(
  product,
) {
  return (
    product.variants?.find(
      variant =>
        variant.in_stock,
    ) ||

    product.variants?.[0] ||

    null
  )
}


// ==========================================
// Requests
// ==========================================

async function fetchText(
  url,
) {
  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            'application/xml,text/plain,*/*',
        },
      },
    )

  if (
    !response.ok
  ) {
    throw new Error(
      `${url} returned HTTP ${response.status}`,
    )
  }

  return response.text()
}


async function fetchJson(
  url,
) {
  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            'application/json',
        },
      },
    )

  if (
    !response.ok
  ) {
    throw new Error(
      `${url} returned HTTP ${response.status}`,
    )
  }

  return response.json()
}


// ==========================================
// Product HTML
// ==========================================

function renderProductHtml(
  template,
  product,
) {
  const canonical =
    (
      `${SITE_URL}/product/` +
      encodeURIComponent(
        product.slug,
      )
    )

  const title =
    (
      `خرید ${product.name} ` +
      '| قیمت و مشخصات – بازبیا'
    )

  const description =
    descriptionFor(
      product,
    )

  const image =
    imageFor(
      product,
    )

  const variant =
    variantFor(
      product,
    )

  /*
   * قیمت‌های بازبیا به تومان هستند.
   * Schema گوگل با IRR یعنی ریال کار می‌کند.
   */
  const price =
    Number(
      variant?.final_price ??
      variant?.discount_price ??
      variant?.price ??
      product.base_price ??
      0,
    ) * 10

  const inStock =
    Boolean(
      variant?.in_stock ??
      (
        Number(
          variant?.stock ??
          product.quantity ??
          0,
        ) > 0
      ),
    )


  // ========================================
  // Product Schema
  // ========================================

  const structuredData = {
    '@context':
      'https://schema.org',

    '@type':
      'Product',

    name:
      product.name,

    description,

    image:
      (
        product.images
          ?.map(
            item =>
              item.image,
          )
          .filter(Boolean) ||

        [image]
      ),

    sku:
      (
        variant?.sku ||
        String(product.id)
      ),

    category:
      product.category?.name,

    offers: {
      '@type':
        'Offer',

      url:
        canonical,

      priceCurrency:
        'IRR',

      price,

      availability:
        inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',

      itemCondition:
        'https://schema.org/NewCondition',
    },
  }


  // ========================================
  // SEO Head
  // ========================================

  const head = [
    `<title>${escapeHtml(title)}</title>`,

    (
      '<meta name="description" ' +
      `content="${escapeHtml(description)}">`
    ),

    (
      '<link rel="canonical" ' +
      `href="${escapeHtml(canonical)}">`
    ),

    '<meta property="og:type" content="product">',

    (
      '<meta property="og:site_name" ' +
      'content="بازبیا">'
    ),

    (
      '<meta property="og:title" ' +
      `content="${escapeHtml(title)}">`
    ),

    (
      '<meta property="og:description" ' +
      `content="${escapeHtml(description)}">`
    ),

    (
      '<meta property="og:url" ' +
      `content="${escapeHtml(canonical)}">`
    ),

    (
      '<meta property="og:image" ' +
      `content="${escapeHtml(image)}">`
    ),

    (
      '<script type="application/ld+json">' +
      JSON
        .stringify(
          structuredData,
        )
        .replaceAll(
          '<',
          '\\u003c',
        ) +
      '</script>'
    ),
  ].join(
    '\n    ',
  )


  // ========================================
  // HTML fallback for crawlers
  // ========================================

  const fallback =
    (
      '<main class="seo-product">' +

      `<h1>${escapeHtml(product.name)}</h1>` +

      `<p>${escapeHtml(description)}</p>` +

      (
        `<img src="${escapeHtml(image)}" ` +
        `alt="${escapeHtml(product.name)}">`
      ) +

      (
        `<p>${inStock ? 'موجود' : 'ناموجود'}</p>`
      ) +

      '</main>'
    )


  /*
   * متادیتای عمومی index.html حذف و
   * متادیتای اختصاصی محصول جایگزین می‌شود.
   */
  const cleanTemplate =
    template
      .replace(
        /\s*<meta\s+name="description"[\s\S]*?>/i,
        '',
      )
      .replace(
        /\s*<link\s+rel="canonical"[\s\S]*?>/i,
        '',
      )


  return (
    cleanTemplate
      .replace(
        /<title>[\s\S]*?<\/title>/i,
        head,
      )
      .replace(
        '<div id="app"></div>',
        `<div id="app">${fallback}</div>`,
      )
  )
}


// ==========================================
// Read and save sitemap
// ==========================================

const sitemap =
  await fetchText(
    SITEMAP_URL,
  )

await writeFile(
  resolve(
    DIST,
    'sitemap.xml',
  ),

  sitemap,

  'utf8',
)


// ==========================================
// Extract product slugs
// ==========================================

const slugs =
  [
    ...sitemap.matchAll(
      /<loc>https:\/\/bazbia\.ir\/product\/([^<]+)<\/loc>/g,
    ),
  ]
    .map(
      match =>
        decodeURIComponent(
          match[1],
        ),
    )
    .filter(
      (
        slug,
        index,
        all,
      ) =>
        all.indexOf(slug) === index,
    )


// ==========================================
// Prepare output
// ==========================================

const template =
  await readFile(
    resolve(
      DIST,
      'index.html',
    ),

    'utf8',
  )

await mkdir(
  SEO_DIR,
  {
    recursive:
      true,
  },
)


// ==========================================
// Generate product pages
// ==========================================

let completed =
  0

let failed =
  0

const queue =
  [...slugs]


async function worker() {
  while (
    queue.length
  ) {
    const slug =
      queue.shift()

    try {
      const product =
        await fetchJson(
          (
            `${API_URL}/products/` +
            `${encodeURIComponent(slug)}/`
          ),
        )

      const html =
        renderProductHtml(
          template,
          product,
        )

      await writeFile(
        resolve(
          SEO_DIR,
          `product-${slug}.html`,
        ),

        html,

        'utf8',
      )

      completed +=
        1

    } catch (
      error
    ) {
      failed +=
        1

      console.warn(
        (
          `SEO skipped: ${slug} ` +
          `(${error.message})`
        ),
      )
    }
  }
}


// شش درخواست هم‌زمان برای سریع‌تر شدن build
await Promise.all(
  Array.from(
    {
      length:
        6,
    },

    worker,
  ),
)


console.log(
  (
    `SEO pages generated: ${completed}; ` +
    `skipped: ${failed}; ` +
    `sitemap URLs: ${slugs.length}`
  ),
)


if (
  completed === 0
) {
  throw new Error(
    'No product SEO pages were generated',
  )
  }
