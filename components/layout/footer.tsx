import Link from "next/link";
import { Mail, MapPin, Phone, Sunrise } from "lucide-react";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Container } from "@/components/ui/container";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/ui/social-icons";

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/shop" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return & Refund Policy", href: "/return-refund-policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-fg">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Fajar Mart home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6]">
              <Sunrise className="size-5 text-white" strokeWidth={2.25} />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Fajar<span className="text-primary">Mart</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm text-footer-muted">
            Your trusted multi-category marketplace — quality products, fast delivery and
            support that actually helps, every single day.
          </p>
          <div className="flex flex-col gap-2 text-sm text-footer-muted">
            <a href="mailto:support@fajarmart.com" className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="size-4" /> support@fajarmart.com
            </a>
            <a href="tel:+18005551234" className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="size-4" /> +1 (800) 555-1234
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> 42 Dawn Avenue, Suite 100, New York
            </span>
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{column.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-footer-muted transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-footer-border">
        <Container className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Stay in the loop</h3>
            <p className="text-sm text-footer-muted">Subscribe for new arrivals and deals in your inbox.</p>
            <NewsletterForm dark />
          </div>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-footer-border text-footer-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-white hover:shadow-glow-primary"
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </Container>
      </div>

      <div className="border-t border-footer-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-footer-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Fajar Mart. All rights reserved.</p>
          <p>Designed for a modern, multi-category shopping experience.</p>
        </Container>
      </div>
    </footer>
  );
}
