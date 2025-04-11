"use client";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, LoaderCircle } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

import { newsletterSubmission } from "@/action/newsletter-submission";
import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

// const InteractiveGridPattern = dynamic(
//   () =>
//     import("@workspace/ui/components/interactive-grid-pattern").then(
//       (mod) => mod.InteractiveGridPattern,
//     ),
//   {
//     ssr: false,
//   },
// );

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;
export default function SubscribeNewsletterButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      size="icon"
      type="submit"
      disabled={pending}
      className="bg-zinc-200 hover:bg-zinc-300 size-8 aspect-square"
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      <span className="flex justify-center items-center gap-2">
        {pending ? (
          <LoaderCircle
            className="text-black animate-spin"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="text-black"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </span>
    </Button>
  );
}

export function SubscribeNewsletter({
  title,
  subTitle,
  helperText,
}: SubscribeNewsletterProps) {
  return (
    <section id="subscribe" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative bg-gray-50 mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 rounded-3xl overflow-hidden container">
        <div className="z-10 relative mx-auto text-center">
          <h2 className="mb-4 font-semibold text-gray-900 text-xl sm:text-3xl md:text-5xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-6 sm:mb-8 text-gray-600 text-sm sm:text-base text-balance"
            />
          )}
          <Form
            className="flex sm:flex-row flex-col justify-center items-center gap-3 sm:gap-2"
            action={newsletterSubmission}
          >
            <div className="flex justify-between items-center bg-white drop-shadow-lg p-2 pl-4 border rounded-xl md:w-96">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="bg-transparent border-e-0 rounded-e-none outline-none focus-visible:ring-0 w-full"
              />
              <SubscribeNewsletterButton />
            </div>
          </Form>
          {helperText && (
            <RichText
              richText={helperText}
              className="opacity-80 mt-3 sm:mt-4 text-gray-800 text-sm"
            />
          )}
        </div>
        {/* <InteractiveGridPattern
          className={cn(
            "absolute scale-125 inset-0 -z-0 w-full opacity-50",
            "[mask-image:radial-gradient(1000px_circle_at_center,transparent,white)]",
          )}
        /> */}
      </div>
    </section>
  );
}
