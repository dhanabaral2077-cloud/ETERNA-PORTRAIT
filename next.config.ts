import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.paypalobjects.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.pinterest.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
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
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    NEXT_PUBLIC_APPS_SCRIPT_URL: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL,
    // Add Supabase service role key for server-side access
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    GELATO_API_KEY: process.env.GELATO_API_KEY,
    ADMIN_SECRET: process.env.ADMIN_SECRET,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: *.google.com *.gstatic.com; style-src 'self' 'unsafe-inline' https: http: *.googleapis.com; img-src 'self' data: https: http: *.google-analytics.com *.googletagmanager.com; font-src 'self' data: https: http: fonts.gstatic.com; connect-src 'self' https: http: *.google-analytics.com *.googleapis.com; frame-src 'self' https: http: *.google.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/shop/digital',
        permanent: true,
      },
      {
        source: '/testimonials',
        destination: '/reviews',
        permanent: true,
      },
      {
        source: '/how-it-works',
        destination: '/guide/photos',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/shop/digital',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
