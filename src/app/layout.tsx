import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getSeoDefaults } from '@/lib/content'
import { ogImageUrl, hasImage } from '@/lib/cloudinary'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoDefaults()

  return {
    metadataBase: seo?.siteUrl ? new URL(seo.siteUrl) : undefined,
    title: {
      default: seo?.defaultTitle ?? '',
      template: seo?.titleTemplate ?? '%s',
    },
    description: seo?.defaultDescription ?? undefined,
    openGraph: {
      type: 'website',
      title: seo?.defaultTitle ?? undefined,
      description: seo?.defaultDescription ?? undefined,
      images: hasImage(seo?.defaultOgImage)
        ? [ogImageUrl(seo.defaultOgImage.publicId)]
        : undefined,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
