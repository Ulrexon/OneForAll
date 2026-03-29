import { MetadataRoute } from 'next'
import { i18n } from '../i18n-config'

const BASE_URL = 'https://allforweb.com'

const tools = [
  'base64',
  'color-picker',
  'glassmorphism',
  'image-converter',
  'json',
  'jwt',
  'pomodoro',
  'qr-generator',
  'text-analyzer',
  'time-calculator',
  'typing-test',
  'uuid',
  'vat-calculator',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  // Default routes (without lang prefix if we want, but in this project they seem to redirect or exist in [lang])
  // Let's create routes for each language
  i18n.locales.forEach((locale) => {
    // Home page for each locale
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })

    // Each tool for each locale
    tools.forEach((tool) => {
      routes.push({
        url: `${BASE_URL}/${locale}/tools/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  })

  return routes
}
