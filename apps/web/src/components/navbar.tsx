import { Book, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { sanityFetch } from "@/lib/sanity/live";
import { queryNavbarData } from "@/lib/sanity/query";
import type { QueryNavbarDataResult } from "@/lib/sanity/sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  Button,
  buttonVariants,
} from "@workspace/ui/components/button";
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
import { SanityButtons } from "./sanity-buttons";
import { SanityIcon } from "./sanity-icon";

interface MenuItem {
  title: string;
  description: string;
  icon: JSX.Element;
  href?: string;
}

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

function MenuItemLink({ item }: { item: MenuItem }) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground items-center focus:bg-accent focus:text-accent-foreground"
      )}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div className="">
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

export async function NavbarServer() {
  const navbarData = await sanityFetch({ query: queryNavbarData });
  return <Navbar navbarData={navbarData.data} />;
}

function NavbarColumnLink({
  column,
}: {
  column: NonNullable<
    NonNullable<QueryNavbarDataResult>["columns"]
  >[number];
}) {
  if (column.type !== "link") return null;
  return (
    <Link
      className={cn(
        "text-muted-foreground",
        buttonVariants({
          variant: "ghost",
        })
      )}
      href={column.href ?? ""}
    >
      {column.name}
    </Link>
  );
}

function NavbarColumn({
  column,
}: {
  column: NonNullable<
    NonNullable<QueryNavbarDataResult>["columns"]
  >[number];
}) {
  if (column.type !== "column") return null;
  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-muted-foreground">
        <NavigationMenuTrigger>{column.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {column.links?.map((item) => (
              <li key={item._key}>
                <MenuItemLink
                  item={{
                    description: item.description ?? "",
                    href: item.href ?? "",
                    icon: (
                      <SanityIcon
                        icon={item.icon}
                        className="size-5 shrink-0"
                      />
                    ),
                    title: item.name ?? "",
                  }}
                />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

function MobileNavbarAccordionColumn({
  column,
}: {
  column: NonNullable<
    NonNullable<QueryNavbarDataResult>["columns"]
  >[number];
}) {
  if (column.type !== "column") return null;
  return (
    <AccordionItem
      value={column.title ?? column._key}
      className="border-b-0"
    >
      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline hover:bg-accent hover:text-accent-foreground pr-2 rounded-md">
        <div
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start"
          )}
        >
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => (
          <MenuItemLink
            key={item._key}
            item={{
              description: item.description ?? "",
              href: item.href ?? "",
              icon: <Book className="size-5 shrink-0" />,
              title: item.name ?? "",
            }}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) {
  const { logo, siteTitle, columns, buttons } = navbarData ?? {};
  return (
    <div className="block lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo ?? LOGO_URL}
            alt={siteTitle ?? "logo"}
            width={80}
            height={80}
            priority
          />
        </Link>

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
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={logo ?? LOGO_URL}
                    alt={siteTitle ?? "logo"}
                    width={80}
                    height={80}
                    priority
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>

            <div className="mb-8 mt-8 flex flex-col gap-4">
              {columns?.map((column) => {
                if (column.type === "link") {
                  return (
                    <Link
                      key={column.name}
                      href={column.href ?? ""}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start"
                      )}
                    >
                      {column.name}
                    </Link>
                  );
                }
                return (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={column._key}
                  >
                    <MobileNavbarAccordionColumn column={column} />
                  </Accordion>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <SanityButtons
                buttons={buttons ?? []}
                buttonClassName="w-full"
                className="flex mt-2 flex-col gap-3"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function Navbar({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) {
  const { logo, siteTitle, columns, buttons } = navbarData ?? {};

  return (
    <section className="py-4">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="hidden justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo ?? LOGO_URL}
              alt={siteTitle ?? "logo"}
              width={80}
              height={40}
              priority
            />
          </Link>
          <div className="flex items-center gap-6 justify-center flex-grow">
            <div className="flex items-center">
              <NavigationMenu>
                {columns?.map((column) =>
                  column.type === "column" ? (
                    <NavbarColumn key={column._key} column={column} />
                  ) : (
                    <NavbarColumnLink
                      key={column._key}
                      column={column}
                    />
                  )
                )}
              </NavigationMenu>
            </div>
          </div>

          <SanityButtons
            buttons={buttons ?? []}
            className="flex gap-2"
          />
        </nav>

        <MobileNavbar navbarData={navbarData} />
      </div>
    </section>
  );
}
