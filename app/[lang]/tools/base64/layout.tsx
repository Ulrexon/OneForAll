import type { Metadata } from "next";
import { getDictionary } from "../../../../get-dictionary";
import type { Locale } from "../../../../i18n-config";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> | { lang: string } 
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang);
  
  return {
    title: `${dict.dashboard.tools.base64.title} | AllForWeb`,
    description: dict.dashboard.tools.base64.desc,
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
