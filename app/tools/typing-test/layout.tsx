import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Speed Test | Test de Mecanografía Online | AllForWeb",
  description: "Test your typing speed. Prueba tu velocidad de escritura, descubre tus Palabras por Minuto (WPM / PPM) y tu precisión al teclado online gratis. Ideal para programadores.",
  keywords: "typing speed test, test mecanografía, wpm test online, prueba velocidad teclado, monkeytype clone, mecanografia jugar",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
