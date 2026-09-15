import type { Metadata } from 'next'
import { getSeoDefaults } from '@/lib/content'
import { hasImage } from '@/lib/media'
import { neueMontreal } from './fonts'
import './globals.css'

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
        ? [seo.defaultOgImage.src]
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
    <html lang="en" className={neueMontreal.variable}>
      <body>{children}</body>
    </html>
  )
}
