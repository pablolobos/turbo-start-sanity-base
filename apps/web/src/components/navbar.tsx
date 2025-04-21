import { sanityFetch } from "@/lib/sanity/live";
import { NAVBAR_QUERY, queryFooterData } from "@/lib/sanity/query";
import type { NAVBAR_QUERYResult, QueryFooterDataResult } from "@/lib/sanity/sanity.types";
import { Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "./logo";
import { NavbarClientDynamic as NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";
import { Search } from "./search";

function ContactInfo({ data }: { data: NonNullable<QueryFooterDataResult> }) {
  if (!data.customerServicePhone && !data.roadEmergencyPhone && !data.roadEmergencyPhone2) return null;

  return (
    <div className="flex justify-end items-center gap-4 py-2 w-full text-sm padding-center">

      {data.customerServicePhone && (
        <a href={`tel:${data.customerServicePhone}`} className="flex items-center gap-2 hover:underline">
          <Phone className="size-4" />
          <span>Servicio al cliente: {data.customerServicePhone}</span>
        </a>
      )}
      {(data.roadEmergencyPhone || data.roadEmergencyPhone2) && (
        <a
          href={`tel:${data.roadEmergencyPhone}`}
          className="flex items-center gap-2 hover:underline"
        >
          <Phone className="size-4" />
          <span>
            Emergencia en ruta: {data.roadEmergencyPhone}
            {data.roadEmergencyPhone2 && ` / ${data.roadEmergencyPhone2}`}
          </span>
        </a>
      )}
      {data.contactPageUrl && (
        <Link href={data.contactPageUrl} className="hover:underline">
          Contacto
        </Link>
      )}
    </div>
  );
}

export async function NavbarServer() {
  const [navbarData, footerData] = await Promise.all([
    sanityFetch({ query: NAVBAR_QUERY }),
    sanityFetch({ query: queryFooterData })
  ]);
  return <Navbar navbarData={navbarData.data} footerData={footerData.data} />;
}

export function Navbar({
  navbarData,
  footerData
}: {
  navbarData: NAVBAR_QUERYResult;
  footerData: QueryFooterDataResult;
}) {
  if (!navbarData) return null;
  const { logo, siteTitle } = navbarData;

  return (
    <>
      <section className="relative flex flex-col gap-4">
        <nav className="relative flex flex-col items-center gap-4">
          <div className="hidden md:flex justify-end items-center py-2 w-full text-sm max-container padding-center">
            {footerData && <ContactInfo data={footerData} />}
          </div>
          <div className="flex justify-start items-center w-full h-[var(--header-main-height-mobile)] md:h-[var(--header-main-height)] max-container padding-center">
            <Logo src={logo} alt={siteTitle} priority />
            <div className="flex-1"></div>
            <Search />
          </div>
          <div className="top-[5px] md:top-auto right-[10px] md:right-auto absolute md:relative md:w-full">
          </div>
        </nav>
      </section>
      <NavbarClient data={navbarData} />
    </>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="py-4 h-[75px]">
      <div className="mx-auto px-4 md:px-6 container">
        <nav className="items-center gap-4 grid grid-cols-[auto_1fr]">
          <div className="bg-muted rounded w-[170px] h-[40px] animate-pulse" />
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
}
