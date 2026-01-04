<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Bypass Next/Image optimization as this project often serves local API images
    unoptimized: true,
    // Allow loading images from local Laravel API domains just in case validation applies
    domains: ["localhost", "127.0.0.1"],
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
    ],
  },
};

export default nextConfig;
=======
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
};

export default nextConfig;
>>>>>>> origin/main
