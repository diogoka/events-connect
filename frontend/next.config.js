/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
        pathname: '/img/**',
      }
    ],
    domains: ['firebasestorage.googleapis.com'],
  }
}

module.exports = nextConfig
