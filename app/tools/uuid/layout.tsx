import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "v4 UUID Generator | Generador de UUID v4 | AllForWeb",
  description: "Generate secure v4 UUIDs in bulk securely. Genera identificadores únicos universales (UUID v4) de forma criptográficamente segura online gratis.",
  keywords: "uuid generator, generador uuid v4, generar guid online, random uuid creator, creador de uuid",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
