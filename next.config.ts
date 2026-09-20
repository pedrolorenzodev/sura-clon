import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
  // no tocar: el badge de dev se cuela en los screenshots de verificación
  devIndicators: false,
  images: {
    // no tocar: el optimizador re-encodea a paleta y ensucia el alfa de los PNG recortados
    unoptimized: true,
  },
};

export default nextConfig;
