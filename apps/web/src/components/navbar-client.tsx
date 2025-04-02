"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Sheet, SheetTrigger } from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Navbar } from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { SanityButtons } from "./sanity-buttons";
import { SanityIcon } from "./sanity-icon";
import { IconPicker } from "@/types/icon-picker";

type NavbarColumnLink = {
  _key: string;
  name: string | null;
  icon: IconPicker | null;
  description: string | null;
  openInNewTab: boolean | null;
  href: string | null;
};

type NavbarLinkGroup = {
  _key: string;
  type: "group";
  title: string;
  links: Array<NavbarColumnLink>;
};

type NavbarColumn = {
  _key: string;
  type: "column";
  title: string | null;
  links: Array<NavbarColumnLink | NavbarLinkGroup>;
};

type NavbarDirectLink = {
  _key: string;
  type: "link";
  name: string | null;
  description: string | null;
  openInNewTab: boolean | null;
  href: string | null;
};

type NavbarData = {
  _id: string;
  columns: Array<NavbarColumn | NavbarDirectLink> | null;
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

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

function MenuItemLink({
  item,
  setIsOpen,
}: {
  item: MenuItem;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground items-center focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div className="">
        <div className="font-semibold text-sm">{item.title}</div>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function NavbarLink({
  name,
  icon,
  description,
  openInNewTab,
  href,
}: Omit<NavbarColumnLink, "_key">) {
  return (
    <Button
      asChild
      variant="ghost"
      className="justify-start px-2 py-1.5 w-full h-auto"
    >
      <a
        href={href || "#"}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className="flex items-start gap-2"
      >
        {icon && <SanityIcon icon={icon} className="mt-0.5 w-4 h-4 shrink-0" />}
        <div>
          <div className="font-medium text-sm">{name}</div>
          {description && (
            <div className="text-muted-foreground text-sm line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </a>
    </Button>
  );
}

function MobileNavbarAccordionColumn({
  title,
  links,
}: {
  title: string | null;
  links: Array<NavbarColumnLink | NavbarLinkGroup>;
}) {
  return (
    <AccordionItem value={title || ""}>
      <AccordionTrigger className="text-sm">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="gap-4 grid">
          {links.map((link) => {
            if ('type' in link && link.type === 'group') {
              return (
                <div key={link._key} className="space-y-2">
                  <div className="font-medium text-sm">{link.title}</div>
                  <div className="gap-1 grid pl-2">
                    {link.links.map((groupLink) => (
                      <NavbarLink
                        key={groupLink._key}
                        name={groupLink.name}
                        icon={groupLink.icon}
                        description={groupLink.description}
                        openInNewTab={groupLink.openInNewTab}
                        href={groupLink.href}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // At this point TypeScript knows it's a NavbarColumnLink
            return (
              <NavbarLink
                key={link._key}
                name={link.name}
                icon={link.icon}
                description={link.description}
                openInNewTab={link.openInNewTab}
                href={link.href}
              />
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({ data }: { data: NavbarData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[540px] sm:max-w-none">
        <Accordion type="single" collapsible className="w-full">
          {data?.columns?.map((item) => {
            if (item.type === "column") {
              return (
                <MobileNavbarAccordionColumn
                  key={item._key}
                  title={item.title}
                  links={item.links}
                />
              );
            }
            if (item.type === "link") {
              return (
                <NavbarLink
                  key={item._key}
                  name={item.name}
                  icon={null}
                  description={item.description}
                  openInNewTab={item.openInNewTab}
                  href={item.href}
                />
              );
            }
            return null;
          })}
        </Accordion>
        {data?.buttons && (
          <div className="space-y-2 mt-6">
            <SanityButtons buttons={data.buttons} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DesktopNavbar({ data }: { data: NavbarData }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        {data?.columns?.map((item) => {
          if (item.type === "column") {
            return (
              <NavigationMenuItem key={item._key}>
                <NavigationMenuTrigger className="px-4 h-10">
                  {item.title}
                </NavigationMenuTrigger>
                <NavbarColumn title={item.title} links={item.links} />
              </NavigationMenuItem>
            );
          }
          if (item.type === "link") {
            return (
              <NavigationMenuItem key={item._key}>
                <NavigationMenuLink
                  className="flex items-center px-4 h-10"
                  href={item.href || "#"}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
          return null;
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function NavbarColumn({
  title,
  links,
}: {
  title: string | null;
  links: Array<NavbarColumnLink | NavbarLinkGroup>;
}) {
  return (
    <NavigationMenuContent>
      <div className="p-4 w-[400px]">
        {title && (
          <div className="mb-3 font-medium text-muted-foreground text-sm">{title}</div>
        )}
        <div className="gap-4 grid">
          {links.map((link) => {
            if ('type' in link && link.type === 'group') {
              return (
                <div key={link._key} className="space-y-2">
                  <div className="font-medium text-sm">{link.title}</div>
                  <div className="gap-1 grid pl-2">
                    {link.links.map((groupLink) => (
                      <NavbarLink
                        key={groupLink._key}
                        name={groupLink.name}
                        icon={groupLink.icon}
                        description={groupLink.description}
                        openInNewTab={groupLink.openInNewTab}
                        href={groupLink.href}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // At this point TypeScript knows it's a NavbarColumnLink
            return (
              <NavbarLink
                key={link._key}
                name={link.name}
                icon={link.icon}
                description={link.description}
                openInNewTab={link.openInNewTab}
                href={link.href}
              />
            );
          })}
        </div>
      </div>
    </NavigationMenuContent>
  );
}

export function Navbar({ data }: { data: NavbarData }) {
  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center h-16 container">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center">
            {data?.logo && (
              <img src={data.logo} alt={data?.siteTitle || ""} className="h-8" />
            )}
          </a>
          <DesktopNavbar data={data} />
        </div>
        <div className="flex items-center gap-4">
          <MobileNavbar data={data} />
          {data?.buttons && (
            <div className="hidden md:flex">
              <SanityButtons buttons={data.buttons} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const ClientSideNavbar = ({ data }: { data: NavbarData }) => {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return null; // Return null on initial render to avoid hydration mismatch
  }

  return isMobile ? (
    <MobileNavbar data={data} />
  ) : (
    <DesktopNavbar data={data} />
  );
};

function SkeletonMobileNavbar() {
  return (
    <div className="md:hidden">
      <div className="flex justify-end">
        <div className="bg-muted rounded-md w-12 h-12 animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden items-center gap-8 md:grid grid-cols-[1fr_auto] w-full">
      <div className="flex flex-1 justify-center items-center gap-2 max-w-max">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-item-skeleton-${index.toString()}`}
            className="bg-muted rounded w-32 h-12 animate-pulse"
          />
        ))}
      </div>

      <div className="justify-self-end">
        <div className="flex items-center gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`nav-button-skeleton-${index.toString()}`}
              className="bg-muted rounded-[10px] w-32 h-12 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <>
      <SkeletonMobileNavbar />
      <SkeletonDesktopNavbar />
    </>
  );
}

// Dynamically import the navbar with no SSR to avoid hydration issues
export const NavbarClient = dynamic(() => Promise.resolve(ClientSideNavbar), {
  ssr: false,
  loading: () => <NavbarSkeletonResponsive />,
});
