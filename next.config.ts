import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
