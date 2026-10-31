import type { APIRoute } from 'astro'

const baseUrl = 'https://naal.org.tr'

const entries = [
  { url: baseUrl, changeFrequency: 'daily', priority: 1 },
  // Instagram sayfaları şimdilik gizli.
  // { url: `${baseUrl}/instagram`, changeFrequency: 'daily', priority: 0.8 },
  // { url: `${baseUrl}/instagram/accounts`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/certificates`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/clubs`, changeFrequency: 'weekly', priority: 0.6 },
]

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString()
  const urls = entries
    .map(({ url, changeFrequency, priority }) =>
      `<url><loc>${url}</loc><lastmod>${lastModified}</lastmod><changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`
    )
    .join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  )
}
