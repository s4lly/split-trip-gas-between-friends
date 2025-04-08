import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/maps/api/staticmap/**",
      },
    ],
  },

  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Docker
  output: "standalone",

  // # part of vite migration
  // https://nextjs.org/docs/app/building-your-application/upgrading/from-vite

  // Outputs a Single-Page Application (SPA).
  // output: 'export',

  // Changes the build output directory to `./dist/`.
  // distDir: "./dist",
};

export default nextConfig;
