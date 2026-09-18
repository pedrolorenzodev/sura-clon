import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
  /* El badge de dev se superpone a los screenshots de verificación y arruina la
     comparación pixel-perfect contra el Figma. Los errores se siguen mostrando. */
  devIndicators: false,
};

export default nextConfig;
