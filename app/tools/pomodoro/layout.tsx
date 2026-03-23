import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Timer & Ambient Noise | Temporizador Zen | AllForWeb",
  description: "Boost your productivity with our Zen Pomodoro timer featuring built-in algorithmic Brown Noise and Deep Work ambient sounds. Temporizador Pomodoro online con ruido blanco.",
  keywords: "pomodoro timer online, temporizador pomodoro gratis, study timer, brown noise generator, generador de ruido blanco estudiar, productivity desk tool",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
