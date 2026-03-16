import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaibhav Srivastava | AI Product Management",
  description: "Strategic thought leader specializing in Product Strategy, AI/ML Innovation, and Growth Leadership",
  keywords: ["Product Strategy", "AI/ML", "Solution Architecture", "GTM", "Strategic Leadership"],
  authors: [{ name: "Vaibhav Srivastava" }],
  openGraph: {
    title: "Vaibhav Srivastava | AI Product Management",
    description: "Strategic thought leader specializing in Product Strategy, AI/ML Innovation, and Growth Leadership",
    type: "website",
    url: "https://vaibhavsrivastava.com",
    siteName: "Vaibhav Srivastava",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Srivastava | AI Product Management",
    description: "Strategic thought leader specializing in Product Strategy, AI/ML Innovation, and Growth Leadership",
  },
  metadataBase: new URL("https://vaibhavsrivastava.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vaibhav Srivastava",
              url: "https://vaibhavsrivastava.com",
              sameAs: [
                "https://www.linkedin.com/in/vaibhavsrivastava777/",
              ],
              jobTitle: "AI Product Management",
              description: "Strategic thought leader specializing in Product Strategy, AI/ML Innovation, and Growth Leadership",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
