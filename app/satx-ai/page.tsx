import type { Metadata } from "next";
import SatxAiChat from "@/components/SatxAiChat";

export const metadata: Metadata = {
  title: "SATX AI — Saturnx",
  description:
    "SATX AI — your AI engineering and procurement assistant for IT, networking, electrical, industrial, ELV, CCTV, and RFQs.",
  openGraph: {
    images: ["/satx-ai-logo.png"],
  },
  twitter: {
    images: ["/satx-ai-logo.png"],
  },
};

export default function SatxAiPage() {
  return (
    <main id="top" className="satx-ai-page">
      <section className="hero satx-ai-hero" aria-label="SATX AI">
        <div className="container">
          <p className="hero-tag satx-fade-in">POWERED BY SATURNX</p>
          <h1 className="satx-ai-logo-wrap satx-fade-in satx-fade-in--delay-1">
            <img
              src="/satx-ai-logo.png"
              alt="SATX AI"
              className="satx-ai-logo"
              width={320}
              height={80}
            />
          </h1>
          <p className="hero-sub satx-ai-page__subtitle satx-fade-in satx-fade-in--delay-2">
            Your AI Engineering &amp; Procurement Assistant
          </p>
          <p className="satx-ai-page__desc satx-fade-in satx-fade-in--delay-3">
            IT, networking, servers, Microsoft, cybersecurity, electrical, industrial,
            civil, MEP, HVAC, ELV, CCTV, fire alarm, audio visual, and AI automation —
            with RFQ support and no invented pricing.
          </p>
        </div>
      </section>

      <section className="section satx-ai-section">
        <div className="container">
          <SatxAiChat />
        </div>
      </section>
    </main>
  );
}
