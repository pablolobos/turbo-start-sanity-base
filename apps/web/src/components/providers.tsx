"use client";

import { useState, useEffect } from "react";
import type * as React from "react";

import { ThemeProvider } from "./theme-provider";
import { CookieConsentProvider } from "@/context/cookie-consent-provider";
import { CookieConsentModal, CookieConsentBanner } from "./cookie-consent-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  // Use client-side state to prevent duplicate rendering during hydration
  const [hasMounted, setHasMounted] = useState(false);

  // Wait until component has mounted to render children
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're fully mounted
    // This helps prevent flashes of duplicate content during hydration
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        setHasMounted(true);
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // First render will only include ThemeProvider to prevent duplicate content
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Apply key to force remount when hasMounted changes */}
      <CookieConsentProvider key={hasMounted ? 'mounted' : 'initial'}>
        {hasMounted ? children : null}
        {hasMounted && (
          <>
            <CookieConsentModal />
            <CookieConsentBanner />
          </>
        )}
      </CookieConsentProvider>
    </ThemeProvider>
  );
}
