import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom QR Generator | Crear Código QR Gratis | AllForWeb",
  description: "Create custom high-resolution QR codes. Generador de Códigos QR personalizados para URLs, WiFi y texto. Descárgalos en PNG gratis.",
  keywords: "qr code maker, crear codigo qr, generador qr gratis online, custom qr codes, crear codigo qr para wifi y enlaces",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
