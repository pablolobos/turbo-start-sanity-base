import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { queryFooterData } from "@/lib/sanity/query";
import type { QueryFooterDataResult } from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";
import { CookieConsentButton } from "./cookie-consent-button";

interface SocialLinksProps {
  data: NonNullable<QueryFooterDataResult>["socialLinks"];
}

interface FooterProps {
  data: NonNullable<QueryFooterDataResult>;
}

async function fetchFooterData() {
  const response = await sanityFetch({
    query: queryFooterData,
  });
  return response;
}

export async function FooterServer() {
  const footerData = await fetchFooterData();
  if (!footerData?.data) return <FooterSkeleton />;
  return <Footer data={footerData.data} />;
}

function SocialLinks({ data }: SocialLinksProps) {
  if (!data) return null;

  const { facebook, twitter, instagram, youtube, linkedin } = data;

  const socialLinks = [
    {
      url: instagram,
      Icon: InstagramIcon,
      label: "Follow us on Instagram",
    },
    { url: facebook, Icon: FacebookIcon, label: "Follow us on Facebook" },
    { url: twitter, Icon: XIcon, label: "Follow us on Twitter" },
    { url: linkedin, Icon: LinkedinIcon, label: "Follow us on LinkedIn" },
    {
      url: youtube,
      Icon: YoutubeIcon,
      label: "Subscribe to our YouTube channel",
    },
  ].filter((link) => link.url);

  return (
    <ul className="flex items-center space-x-6 text-muted-foreground">
      {socialLinks.map(({ url, Icon, label }, index) => (
        <li
          key={`social-link-${url}-${index.toString()}`}
          className="font-medium hover:text-primary"
        >
          <Link
            href={url ?? "#"}
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon className="fill-muted-foreground hover:fill-primary/80" />
            <span className="sr-only">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FooterSkeleton() {
  return (
    <section className="mt-16 pb-8">
      <div className="mx-auto px-4 md:px-6 container">
        <footer className="h-[500px] lg:h-auto">
          <div className="flex lg:flex-row flex-col justify-between items-center gap-10 lg:text-left text-center">
            <div className="flex flex-col justify-between items-center lg:items-start gap-6 w-full max-w-96 shrink">
              <div>
                <span className="flex justify-center lg:justify-start items-center gap-4">
                  <div className="bg-muted rounded w-[80px] h-[40px] animate-pulse" />
                </span>
                <div className="bg-muted mt-6 rounded w-full h-16 animate-pulse" />
              </div>
              <div className="flex items-center space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-muted rounded w-6 h-6 animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="gap-6 lg:gap-20 grid grid-cols-3">
              {[1, 2, 3].map((col) => (
                <div key={col}>
                  <div className="bg-muted mb-6 rounded w-24 h-6 animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-muted rounded w-full h-4 animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 mt-20 pt-8 border-t lg:text-left text-center">
            <div className="bg-muted rounded w-48 h-4 animate-pulse" />
            <div className="flex justify-center lg:justify-start gap-4">
              <div className="bg-muted rounded w-32 h-4 animate-pulse" />
              <div className="bg-muted rounded w-24 h-4 animate-pulse" />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function Footer({ data }: FooterProps) {
  const { subtitle, columns, socialLinks, logo, siteTitle } = data;
  const year = new Date().getFullYear();

  return (
    <section className="bg-background-alt mt-20 pt-12 pb-24">
      <div className="mx-auto container">
        <footer className="h-[500px] lg:h-auto">
          <div className="flex flex-col justify-between items-center gap-10 mx-auto px-4 md:px-6 max-w-7xl lg:text-left text-center">
            <div className="gap-6 lg:gap-28 grid grid-cols-3 lg:mr-20 w-full">
              {Array.isArray(columns) && columns?.length > 0 &&
                columns.map((column, index) => (
                  <div key={`column-${column?._key}-${index}`}>
                    <h3 className="mb-6 font-semibold">{column?.title}</h3>
                    {column?.links && column?.links?.length > 0 && (
                      <ul className="space-y-4 text-muted-foreground text-sm">
                        {column?.links?.map((link, index) => (
                          <li
                            key={`${link?._key}-${index}-column-${column?._key}`}
                            className="font-medium hover:text-primary"
                          >
                            <Link
                              href={link.href ?? "#"}
                              target={link.openInNewTab ? "_blank" : undefined}
                              rel={
                                link.openInNewTab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              }
              <div className="flex flex-col justify-between items-center lg:items-start gap-6 md:gap-8 w-full max-w-96 shrink">
                {socialLinks && <SocialLinks data={socialLinks} />}
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t">
            <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 mx-auto px-4 md:px-6 max-w-7xl font-normal text-muted-foreground text-sm lg:text-left text-center">
              <p>
                © {year} Todos los derechos reservados Volvo Chile SPA.
              </p>
              <ul className="flex justify-center lg:justify-start gap-4">
                <li className="hover:text-primary">
                  <Link href="/terms">Terms and Conditions</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/privacy">Políticas de privacidad</Link>
                </li>
                <li className="hover:text-primary">
                  <CookieConsentButton />
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
