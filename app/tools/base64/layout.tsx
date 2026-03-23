import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder | Codificador Base64 | AllForWeb",
  description: "Encode or decode text in Base64 instantly. Codifica y decodifica textos y cadenas en formato Base64 al instante de forma segura.",
  keywords: "base64 encode, codificar base64, descodificar base64 online, base64 tool, base64 converter gratis",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
