import type { MetadataRoute } from 'next'

const BASE = 'https://hellkang.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/space`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/program`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/test`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gift`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/focus`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
