import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | Formateador JSON | AllForWeb",
  description: "Format and validate complex JSON data. El mejor visor, editor y formateador de código JSON online gratuito para desarrolladores web.",
  keywords: "json formatter, formateador json online, ordenar formato json, json validator, beautify json",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
