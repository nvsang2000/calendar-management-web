/* eslint-disable prettier/prettier */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    NEXT_PUBLIC_ENV_API_URL: process.env.NEXT_PUBLIC_ENV_API_URL,
    NEXT_PUBLIC_ENV_CLIENT_URL: process.env.NEXT_PUBLIC_ENV_CLIENT_URL,
    NEXT_PUBLIC_ENV_CLIENT_SECRET: process.env.NEXT_PUBLIC_ENV_CLIENT_SECRET,
    NEXT_PUBLIC_ENV_JWT_SECRET: process.env.NEXT_PUBLIC_ENV_JWT_SECRET,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

module.exports = nextConfig
