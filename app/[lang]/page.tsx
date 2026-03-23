import { getDictionary } from '../../get-dictionary'
import type { Locale } from '../../i18n-config'
import DashboardClient from './DashboardClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  // In Next.js 15+ / 16, params is a Promise that must be awaited.
  const resolvedParams = await Promise.resolve(params);
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang)
  
  return {
    title: `${dict.dashboard.title} | ${dict.dashboard.tabDev}`,
    description: dict.dashboard.subtitle
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang)

  return <DashboardClient dict={dict} lang={lang} />
}
