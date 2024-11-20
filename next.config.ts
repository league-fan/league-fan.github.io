import type { NextConfig } from "next";
const { version } = require("./package.json");

const nextConfig: NextConfig = {
  publicRuntimeConfig: { version },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/default/champions',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
