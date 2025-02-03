"use client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { LoaderCircle, Mail } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;

export default function SubscribeNewsletterForm() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <span className="flex items-center gap-2">
        {pending ? (
          <>
            <LoaderCircle
              className="-ms-1 me-2 animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <p>Subscribing...</p>
          </>
        ) : (
          <>
            <Mail
              className="-ms-1 me-2"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <p>Subscribe</p>
          </>
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
    <section className="">
      <div className="container mx-auto px-4 bg-gray-50 py-16">
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">{title}</h2>
          {subTitle && (
            <div className="mb-8 text-gray-600">
              <RichText richText={subTitle} />
            </div>
          )}
          <Form
            className="flex items-center justify-center gap-2"
            action={async (formData) => {
              // TODO: Implement newsletter subscription flow
              // 1. Validate email format and domain
              // 2. Check for existing subscription to prevent duplicates
              // 3. Add rate limiting to prevent spam (max 3 attempts per IP/hour)
              // 4. Send confirmation email with double opt-in link
              // 5. Store subscription with status=pending in database
              // 6. On confirmation, update status=active
              // 7. Add to email service provider list (e.g. Mailchimp/SendGrid)
              // 8. Log analytics event for conversion tracking
              // 9. Handle errors gracefully with user feedback
              // 10. Implement unsubscribe functionality later

              // For now, just return the email for testing
              return {
                email: formData.get("email"),
              };
            }}
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="max-w-[300px] bg-white"
            />
            <SubscribeNewsletterForm />
          </Form>
          {helperText && (
            <div className="mt-4 text-xs text-gray-500">
              <RichText richText={helperText} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
