import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter & Text Analyzer | Contador de Palabras | AllForWeb",
  description: "Count words, characters, and reading time. Contador de palabras, letras y extractor de palabras clave en tiempo real para SEO y escritores.",
  keywords: "word counter, contador de palabras online, text analyzer, contar caracteres, buscador de densidad de palabras clave",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
