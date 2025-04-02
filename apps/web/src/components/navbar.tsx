import { sanityFetch } from "@/lib/sanity/live";
import { NAVBAR_QUERY } from "@/lib/sanity/query";
import type { Navbar } from "@/lib/sanity/sanity.types";
import { IconPicker } from "@/types/icon-picker";

import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

type NavbarData = {
  _id: string;
  columns: Array<{
    _key: string;
    type: "column" | "link";
    title: string | null;
    name: string | null;
    description: string | null;
    openInNewTab: boolean | null;
    href: string | null;
    links: Array<{
      _key: string;
      name: string | null;
      icon: IconPicker | null;
      description: string | null;
      openInNewTab: boolean | null;
      href: string | null;
    }>;
  }> | null;
  buttons: Array<{
    text: string | null;
    variant: "default" | "link" | "outline" | "secondary" | null;
    _key: string;
    _type: "button";
    openInNewTab: boolean | null;
    href: string | null;
  }> | null;
  logo: string | null;
  siteTitle: string | null;
};

export async function NavbarServer() {
  const navbarData = await sanityFetch({ query: NAVBAR_QUERY });
  return <Navbar navbarData={navbarData.data} />;
}

export function Navbar({ navbarData }: { navbarData: NavbarData }) {
  const { logo, siteTitle } = navbarData ?? {};

  return (
    <section className="py-3 md:border-b">
      <div className="mx-auto px-4 md:px-6 container">
        <nav className="items-center gap-4 grid grid-cols-[auto_1fr]">
          <Logo src={logo} alt={siteTitle} priority />

          <NavbarClient data={navbarData} />
        </nav>
      </div>
    </section>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="py-4 md:border-b h-[75px]">
      <div className="mx-auto px-4 md:px-6 container">
        <nav className="items-center gap-4 grid grid-cols-[auto_1fr]">
          <div className="bg-muted rounded w-[170px] h-[40px] animate-pulse" />
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
}
