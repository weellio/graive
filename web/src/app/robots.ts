import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://graive.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/auth/signin', '/auth/signup', '/privacy', '/terms'],
        disallow: [
          '/dashboard',
          '/learn/',
          '/account/',
          '/admin/',
          '/api/',
          '/join/',
          '/auth/confirm',
          '/auth/forgot-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
