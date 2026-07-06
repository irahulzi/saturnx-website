export default function SiteFooter() {
  return (
    <footer className="footer" aria-label="Footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <img className="footer-logo" src="/logo.png" alt="Saturnx logo" />
          <p>
            Saturnx is a trusted technology &amp; engineering partner delivering IT
            infrastructure, software, cloud, cybersecurity, and site execution across
            Saudi Arabia.
          </p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <a href="/itservices.html#it">IT Services</a>
          <a href="/engineering.html#engineering">Engineering Services</a>
          <a href="/satx-ai">SATX AI</a>
          <a href="/itservices.html#contact">Request Proposal</a>
        </div>
        <div className="footer-col">
          <h4>Partners</h4>
          <a href="#top">HP</a>
          <a href="#top">Cisco</a>
          <a href="#top">Microsoft</a>
          <a href="#top">Lenovo</a>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="/itservices.html#it">IT Services</a>
          <a href="/engineering.html#engineering">Engineering Services</a>
          <a href="/satx-ai">SATX AI</a>
          <a href="/itservices.html#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="/index.html">About Us</a>
          <a href="#top">Careers</a>
          <a href="#top">Blogs</a>
          <a href="/itservices.html#contact">Contact Us</a>
        </div>
      </div>
      <div className="container footer-mid">
        <div className="footer-contact">
          <div className="footer-label">Contact Us</div>
          <div className="footer-address">Address: Dammam, Saudi Arabia</div>
          <div className="footer-phone">Phone: +966 53 202 5666</div>
          <a className="footer-email" href="mailto:hello@saturnsolutions.com.sa">
            Email: hello@saturnsolutions.com.sa
          </a>
        </div>
        <div className="footer-social">
          <a className="icon" href="#top" aria-label="Facebook">
            f
          </a>
          <a className="icon" href="#top" aria-label="X">
            x
          </a>
          <a
            className="icon"
            href="https://www.linkedin.com/company/saturnxsa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>
          <a className="icon" href="#top" aria-label="YouTube">
            ▶
          </a>
        </div>
        <div className="footer-support">
          <div className="footer-label">Support</div>
          <div className="support-buttons">
            <a
              className="btn btn-outline btn-small"
              href="https://anydesk.com/en/downloads/windows"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download AnyDesk
            </a>
            <a
              className="btn btn-outline btn-small"
              href="https://www.teamviewer.com/en/download/windows/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download TeamViewer
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2025 Saturnx. All Rights Reserved.
      </div>
    </footer>
  );
}
