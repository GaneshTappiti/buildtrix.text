/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  images: {
    domains: ['lovable.dev'],
  },
  // Fix chunk loading issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Suppress webpack cache warnings for optional platform-specific packages
    config.infrastructureLogging = {
      level: 'error',
    }
    
    // Ignore webpack cache warnings for platform-specific binaries
    config.ignoreWarnings = [
      /Managed item.*isn't a directory or doesn't contain a package\.json/,
    ]
    
    // Improve chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    }
    
    return config
  },
  // Enable static exports if needed
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
