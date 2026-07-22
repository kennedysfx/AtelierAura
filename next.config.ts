import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;