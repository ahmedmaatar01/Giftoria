/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable Next/Image optimization for better performance
    unoptimized: false,
    // Allow loading images from local and production Laravel API domains
    domains: ["localhost", "127.0.0.1", "api.giftoria.me", "i0.wp.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.giftoria.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
    ],
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error', 'warn'] } : false,
  },
  // Disable static generation to avoid prerendering errors with client hooks
  experimental: {
    serverComponentsExternalPackages: [],
    forceSwcTransforms: true,
  },
  // Force server-side rendering instead of static generation
  output: 'standalone',
  // Force dynamic rendering for all pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable static optimization to prevent prerendering issues
  trailingSlash: false,
  // Force all pages to be dynamic
  generateEtags: false,
};

export default nextConfig;
