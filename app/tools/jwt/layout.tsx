import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder Online | Decodificador JWT | AllForWeb",
  description: "Safely decode JSON Web Tokens. Decodifica e inspecciona tokens JWT (cabeceras y payloads) de forma segura directamente en tu navegador.",
  keywords: "jwt decoder, json web token, decodificar jwt online, jwt parser, leer token jwt",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
