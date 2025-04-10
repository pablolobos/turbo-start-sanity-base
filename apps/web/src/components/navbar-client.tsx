"use client";

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
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
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
import type { NAVBAR_QUERYResult } from "@/lib/sanity/sanity.types";
import type { IconPicker } from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { SanityButtons } from "./sanity-buttons";
import { SanityIcon } from "./sanity-icon";

interface MenuItem {
  title: string;
  description: string | null;
  icon: IconPicker | null;
  href?: string;
}

interface NavbarColumnType {
  _key: string;
  type: "column";
  title: string | null;
  links: Array<{
    _key: string;
    type: "link" | "group";
    name: string | null;
    icon: IconPicker | null;
    description: string | null;
    openInNewTab: boolean | null;
    href: string | null;
    title?: string | null;
    links?: Array<{
      _key: string;
      name: string | null;
      icon: IconPicker | null;
      description: string | null;
      openInNewTab: boolean | null;
      href: string | null;
    }> | null;
  }> | null;
}

interface NavbarLinkType {
  _key: string;
  type: "link";
  name: string | null;
  description: string | null;
  openInNewTab: boolean | null;
  href: string | null;
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
      {item.icon && <SanityIcon icon={item.icon} className="size-5 shrink-0" />}
      <div className="">
        <div className="font-semibold text-sm">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
}: {
  column: NavbarColumnType;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <AccordionItem value={column.title ?? column._key} className="border-b-0">
      <AccordionTrigger className="hover:bg-accent mb-4 py-0 pr-2 rounded-md font-semibold hover:no-underline hover:text-accent-foreground">
        <div className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => (
          <MenuItemLink
            key={item._key}
            setIsOpen={setIsOpen}
            item={{
              title: item.name ?? "",
              description: item.description,
              href: item.href ?? "",
              icon: item.icon,
            }}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({ data }: { data: NonNullable<NAVBAR_QUERYResult> }) {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Logo src={data.logo} alt={data.siteTitle} priority />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-8 mb-8">
          {data.columns?.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={`column-link-${item.name}-${item._key}`}
                  href={item.href ?? ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                >
                  {item.name}
                </Link>
              );
            }
            return (
              <Accordion type="single" collapsible className="w-full" key={item._key}>
                <MobileNavbarAccordionColumn column={item as NavbarColumnType} setIsOpen={setIsOpen} />
              </Accordion>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <SanityButtons
            buttons={data.buttons ?? []}
            buttonClassName="w-full"
            className="flex flex-col gap-3 mt-2"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarColumnLink({ column }: { column: NavbarLinkType }) {
  return (
    <Link
      aria-label={`Link to ${column.name ?? column.href}`}
      href={column.href ?? ""}
      legacyBehavior
      passHref
    >
      <NavigationMenuLink
        className={cn(
          navigationMenuTriggerStyle(),
          "text-muted-foreground dark:text-neutral-300",
        )}
      >
        {column.name}
      </NavigationMenuLink>
    </Link>
  );
}

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return "w-80";
  if (itemCount <= 8) return "grid grid-cols-2 gap-2 w-[500px]";
  return "grid grid-cols-3 gap-2 w-[700px]";
}

function NavbarColumn({ column }: { column: NavbarColumnType }) {
  const layoutClass = useMemo(
    () => getColumnLayoutClass(column.links?.length ?? 0),
    [column.links?.length],
  );

  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-muted-foreground dark:text-neutral-300">
        <NavigationMenuTrigger>{column.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn("p-3", layoutClass)}>
            {column.links?.map((item) => (
              <li key={item._key}>
                {item.type === "group" ? (
                  <div className="space-y-2">
                    <h4 className="mb-2 font-medium text-muted-foreground text-sm">{item.title}</h4>
                    <div className="gap-2 grid pl-4">
                      {item.links?.map((groupLink) => (
                        <MenuItemLink
                          key={groupLink._key}
                          item={{
                            title: groupLink.name ?? "",
                            description: groupLink.description,
                            href: groupLink.href ?? "",
                            icon: groupLink.icon,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <MenuItemLink
                    item={{
                      title: item.name ?? "",
                      description: item.description,
                      href: item.href ?? "",
                      icon: item.icon,
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

function DesktopNavbar({ data }: { data: NonNullable<NAVBAR_QUERYResult> }) {
  return (
    <div className="bg-v-grayscale-300 w-full padding-center">
      <div className="items-center gap-8 grid grid-cols-[1fr_auto] w-full max-container padding-center">
        <NavigationMenu>
          {data.columns?.map((column) =>
            column.type === "column" ? (
              <NavbarColumn key={`nav-${column._key}`} column={column as NavbarColumnType} />
            ) : (
              <NavbarColumnLink key={`nav-${column._key}`} column={column as NavbarLinkType} />
            ),
          )}
        </NavigationMenu>
        <div className="flex justify-self-end items-center gap-4">
          <SanityButtons
            buttons={data.buttons ?? []}
            className="flex items-center gap-4"
            buttonClassName="boton"
          />
        </div>
      </div>
    </div>
  );
}

function NavbarClient({ data }: { data: NAVBAR_QUERYResult }) {
  const isMobile = useIsMobile();

  if (isMobile === undefined || !data) {
    return null; // Return null on initial render to avoid hydration mismatch or if data is null
  }

  return isMobile ? <MobileNavbar data={data} /> : <DesktopNavbar data={data} />;
}

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
export const NavbarClientDynamic = dynamic(() => Promise.resolve(NavbarClient), {
  ssr: false,
  loading: () => <NavbarSkeletonResponsive />,
});
