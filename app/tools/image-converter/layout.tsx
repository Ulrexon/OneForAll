import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Converter | Convertidor de Imágenes Online | AllForWeb",
  description: "Convert images to WebP, PNG, and JPEG. Convierte tus imágenes a diferentes formatos online gratis, rápido y 100% privado en tu navegador.",
  keywords: "image converter, convertidor de imagenes online, pasar png a jpg, webp converter, cambiar formato imagen gratis",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
