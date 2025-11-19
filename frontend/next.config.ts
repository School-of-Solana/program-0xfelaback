import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    outputFileTracingRoot: __dirname,
  },
}

export default nextConfig as NextConfig
