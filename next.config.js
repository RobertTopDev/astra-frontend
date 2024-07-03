/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, options) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  basePath: '',
  output: 'standalone',
}

module.exports = nextConfig
