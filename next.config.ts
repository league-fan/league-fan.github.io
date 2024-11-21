import type { NextConfig } from "next";
const { version } = require("./package.json");

const nextConfig: NextConfig = {
  output: "export",
  publicRuntimeConfig: { version },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.communitydragon.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
