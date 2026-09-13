import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SkipLink } from '@/components/SkipLink'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { getSiteSettings } from '@/lib/content'

/**
 * Chrome for the public site. Kept in a route group so /keystatic renders the
 * CMS on its own, without the site header, footer or smooth scrolling.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <MotionProvider intensity={settings?.motionIntensity ?? 'full'}>
      <SkipLink label={settings?.skipLinkLabel ?? ''} />
      <SmoothScroll />
      <SiteHeader />
      <div id="main" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
    </MotionProvider>
  )
}
