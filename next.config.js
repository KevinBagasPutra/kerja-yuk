// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  typescript: {
    // Masih valid di Next.js 16
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
