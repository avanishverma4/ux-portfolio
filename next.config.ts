import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Pin the file-tracing root to this project. There is an unrelated
   * package.json/package-lock.json in the home directory, so Next's workspace
   * inference walks up and picks `~` instead — which traces the wrong tree into
   * the `standalone` output below.
   */
  outputFileTracingRoot: import.meta.dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
};

export default nextConfig;
