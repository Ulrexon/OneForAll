const fs = require('fs');
const path = require('path');

const TOOL_ROUTES = {
  'pomodoro': 'zenPomodoro',
  'typing-test': 'typingTest',
  'text-analyzer': 'textAnalyzer',
  'color-picker': 'colorPicker',
  'qr-generator': 'qrGenerator',
  'glassmorphism': 'glassmorphism',
  'image-converter': 'imageConverter',
  'base64': 'base64',
  'json': 'json',
  'jwt': 'jwt',
  'uuid': 'uuid',
  'vat-calculator': 'vatCalculator',
  'time-calculator': 'timeCalculator'
};

const BASE_DIR = path.join(__dirname, 'app', '[lang]', 'tools');

Object.entries(TOOL_ROUTES).forEach(([folder, dictKey]) => {
  const layoutPath = path.join(BASE_DIR, folder, 'layout.tsx');
  
  // Some folders might not have a layout.tsx yet, we will just create/overwrite them to be perfect
  const layoutContent = `import type { Metadata } from "next";
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
    title: \`\${dict.dashboard.tools.${dictKey}.title} | AllForWeb\`,
    description: dict.dashboard.tools.${dictKey}.desc,
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
`;

  fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
  console.log(`Updated layout for: ${folder}`);
});
