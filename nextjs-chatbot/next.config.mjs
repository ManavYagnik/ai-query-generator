/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  // Ensure fetch is available globally
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'node-fetch': 'node-fetch',
      });
    }
    return config;
  },
  // Add output configuration for better Vercel compatibility
  output: 'standalone',
  // Ensure proper handling of environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
