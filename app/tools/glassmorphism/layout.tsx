import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glassmorphism CSS Generator | Generador CSS Cristal | AllForWeb",
  description: "Create stunning glassmorphism UI elements instantly. Generador visual de CSS para efecto cristal con blur, transparencia y bordes suaves para tus diseños web.",
  keywords: "glassmorphism generator, css glass effect, efecto cristal css, ui design tools, css backdrop-filter, frosted glass css",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
