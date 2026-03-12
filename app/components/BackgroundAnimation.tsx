"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; 

export default function BackgroundAnimation() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", // Ray tracing look connected to mouse
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
            color: "#6366f1" // Indigo
          }
        },
      },
    },
    particles: {
      color: {
        value: "#818cf8",
      },
      links: {
        color: "#4f46e5",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: 120, // High enough for modern dense network
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  };

  if (init) {
    return (
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-auto">
         <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="w-full h-full"
         />
         {/* Subtle overlay gradient to ensure text readability */}
         <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/80 to-indigo-950/90 pointer-events-none" />
      </div>
    );
  }

  return <div className="fixed inset-0 bg-black -z-10" />;
}
