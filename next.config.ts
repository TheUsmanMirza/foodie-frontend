import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'foodie.com',
      },
    ],
  },
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
