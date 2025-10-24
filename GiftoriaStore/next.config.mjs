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
