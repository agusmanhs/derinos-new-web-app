import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Allow Herd local domain to fetch client scripts
  // @ts-ignore
  serverExternalPackages: [],
  // @ts-ignore
  allowedDevOrigins: ['derinos-new-web-app.test', 'localhost', '127.0.0.1'],
};

export default nextConfig;
