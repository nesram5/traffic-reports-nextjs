/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = {
  serverRuntimeConfig: {
    
      COMUNNITY: process.env.COMUNNITY,
      ZABBIX_USER: process.env.ZABBIX_USER,
      ZABBIX_PASSWORD: process.env.ZABBIX_PASSWORD,
      MONGO_DB: process.env.MONGO_DB,
      SERVER: process.env.SERVER_URL,
      PORT: process.env.PORT
    },
  // Will be available on both server and client
  publicRuntimeConfig: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,      
      NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
      NEXT_PUBLIC_USERNAME: process.env.NEXT_PUBLIC_USERNAME
  }
}