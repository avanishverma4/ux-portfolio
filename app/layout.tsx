import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import Loader from '@/components/Loader'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Awanish Verma — Senior UI/UX Designer',
  description:
    'Senior UX Specialist blending empathy with data-driven research to turn complex user journeys into simple, elegant interfaces.',
  openGraph: {
    title: 'Awanish Verma — Senior UI/UX Designer',
    description:
      'Senior UX Specialist blending empathy with data-driven research to turn complex user journeys into simple, elegant interfaces.',
    url: 'https://awanishverma.com',
    siteName: 'Awanish Verma',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awanish Verma — Senior UI/UX Designer',
    description:
      'Senior UX Specialist blending empathy with data-driven research to turn complex user journeys into simple, elegant interfaces.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "xul78cyh8y");`,
          }}
        />
      </head>
      <body>
        <Loader />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
