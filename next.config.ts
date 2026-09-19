import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
  /* El badge de dev se superpone a los screenshots de verificación y arruina la
     comparación pixel-perfect contra el Figma. Los errores se siguen mostrando. */
  devIndicators: false,
  images: {
    /* Los assets vienen exportados de Figma en su tamaño final y con alfa. El
       optimizador los re-encodea a PNG con paleta y ensucia la transparencia:
       el ícono de fuego pasaba de 33x37 px de tinta a 35x48 y se veía recortado.
       En un clon pixel-perfect la fidelidad manda sobre la optimización. */
    unoptimized: true,
  },
};

export default nextConfig;
