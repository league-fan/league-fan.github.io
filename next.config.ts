import type { NextConfig } from "next";
import nextMdx from '@next/mdx'

const withMDX = nextMdx({
  extension: /\.mdx?$/,
})

const nextConfig: NextConfig = {
  output: "export",
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
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  }
};

export default withMDX(nextConfig);
