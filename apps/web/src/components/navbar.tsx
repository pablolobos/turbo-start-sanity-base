import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";

import { sanityFetch } from "@/lib/sanity/live";
import { queryNavbarData } from "@/lib/sanity/query";
import type { QueryNavbarDataResult } from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import { NavbarClient } from "./navbar-client";

export async function NavbarServer() {
  const navbarData = await sanityFetch({ query: queryNavbarData });
  return <Navbar navbarData={navbarData.data} />;
}

export function Navbar({ navbarData }: { navbarData: QueryNavbarDataResult }) {
  const { logo, siteTitle } = navbarData ?? {};

  return (
    <section className="py-4 h-[75px] md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Logo src={logo} alt={siteTitle} priority />
          <NavbarClient navbarData={navbarData} />
        </nav>
      </div>
    </section>
  );
}

function SkeletonMenuItemLink() {
  return (
    <div className="flex select-none gap-4 rounded-md p-3 leading-none items-center">
      <div className="size-5 rounded-md bg-muted animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonNavbarColumn() {
  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <SkeletonMenuItemLink />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

function SkeletonMobileNavbarAccordionColumn() {
  return (
    <AccordionItem value="skeleton" className="border-b-0">
      <AccordionTrigger className="mb-4 py-0 pr-2 rounded-md">
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {[1, 2, 3].map((i) => (
          <SkeletonMenuItemLink key={i} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function SkeletonMobileNavbar() {
  return (
    <div className="block lg:hidden h-[75px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="mb-8 mt-8 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Accordion
                  key={`accordion-skeleton-${i}`}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <SkeletonMobileNavbarAccordionColumn />
                </Accordion>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex mt-2 flex-col gap-3">
                {[1, 2].map((i) => (
                  <div
                    key={`button-skeleton-${i}`}
                    className="h-10 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <section className="py-4 h-[75px]">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-6 justify-center flex-grow">
            <div className="flex items-center">
              <NavigationMenu>
                {[1, 2, 3].map((i) => (
                  <SkeletonNavbarColumn key={`column-skeleton-${i}`} />
                ))}
              </NavigationMenu>
            </div>
          </div>

          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div
                key={`button-skeleton-${i}`}
                className="h-10 w-24 bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </nav>

        <SkeletonMobileNavbar />
      </div>
    </section>
  );
}
