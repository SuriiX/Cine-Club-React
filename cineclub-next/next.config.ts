import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // <-- AÑADE ESTA LÍNEA
};

export default nextConfig;