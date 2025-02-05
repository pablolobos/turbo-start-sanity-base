"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Sheet, SheetTrigger } from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { QueryNavbarDataResult } from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import { SanityButtons } from "./sanity-buttons";
import { SanityIcon } from "./sanity-icon";

interface MenuItem {
  title: string;
  description: string;
  icon: JSX.Element;
  href?: string;
}

function MenuItemLink({
  item,
  setIsOpen,
}: {
  item: MenuItem;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground items-center focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      onClick={() => setIsOpen(false)}
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

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
}: {
  column: NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number];
  setIsOpen: (isOpen: boolean) => void;
}) {
  if (column.type !== "column") return null;
  return (
    <AccordionItem value={column.title ?? column._key} className="border-b-0">
      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline hover:bg-accent hover:text-accent-foreground pr-2 rounded-md">
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => (
          <MenuItemLink
            key={item._key}
            setIsOpen={setIsOpen}
            item={{
              description: item.description ?? "",
              href: item.href ?? "",
              icon: <SanityIcon icon={item.icon} className="size-5 shrink-0" />,
              title: item.name ?? "",
            }}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export function MobileNavbar({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) {
  const { logo, siteTitle, columns, buttons } = navbarData ?? {};
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block lg:hidden h-[75px]">
      <div className="flex items-center justify-between">
        <Logo src={logo} alt={siteTitle} priority />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                <Logo src={logo} alt={siteTitle} priority />
              </SheetTitle>
            </SheetHeader>

            <div className="mb-8 mt-8 flex flex-col gap-4">
              {columns?.map((column) => {
                if (column.type === "link") {
                  return (
                    <Link
                      key={`column-link-${column.name}-${column._key}`}
                      href={column.href ?? ""}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start",
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
                    <MobileNavbarAccordionColumn
                      column={column}
                      setIsOpen={setIsOpen}
                    />
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
