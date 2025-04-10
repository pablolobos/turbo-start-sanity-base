import { sanityFetch } from "@/lib/sanity/live";
import { NAVBAR_QUERY } from "@/lib/sanity/query";
import type { NAVBAR_QUERYResult } from "@/lib/sanity/sanity.types";
import { IconPicker } from "@/types/icon-picker";

import { Logo } from "./logo";
import { NavbarClientDynamic as NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";


export async function NavbarServer() {
  const navbarData = await sanityFetch({ query: NAVBAR_QUERY });
  return <Navbar navbarData={navbarData.data} />;
}

export function Navbar({ navbarData }: { navbarData: NAVBAR_QUERYResult }) {
  const { logo, siteTitle } = navbarData ?? {};

  return (
    <section className="md:border-b">
      <nav className="flex flex-col items-center gap-4">
        <div>
          <Logo src={logo} alt={siteTitle} priority />
        </div>
        <div className="w-full">
          <NavbarClient data={navbarData} />
        </div>
      </nav>
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
