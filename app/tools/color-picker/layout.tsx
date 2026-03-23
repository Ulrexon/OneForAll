import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Picker & Extractor | Selector de Paleta de Color | AllForWeb",
  description: "Extract exact colors from images. Extrae paletas de colores de imágenes nativamente o usa nuestra rueda de color interactiva para obtener HEX, RGB y HSL.",
  keywords: "image color picker, selector de color online, paleta de colores de una imagen, hex color extractor, extraer codigo de color",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
