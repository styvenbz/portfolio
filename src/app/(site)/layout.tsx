import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

/**
 * Chrome for the public site. Kept in a route group so /keystatic renders the
 * CMS on its own, without the site header and footer.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
