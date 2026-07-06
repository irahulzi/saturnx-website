import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saturnx — Technology & Engineering",
  description:
    "Saturnx is a Saudi-based technology and engineering partner delivering IT infrastructure, cloud, cybersecurity, and practical site execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/style.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="satx-ai-bg">
        <SiteHeader />
        {children}
        <SiteFooter />
        <a
          href="https://wa.me/966532025666?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp" aria-hidden="true" />
        </a>
      </body>
    </html>
  );
}
