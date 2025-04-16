"use client";

import { Button } from "@workspace/ui/components/button";
import { useCookieConsent } from "@/context/cookie-consent-provider";

interface CookieConsentButtonProps {
    variant?: "link" | "default" | "outline";
    className?: string;
}

/**
 * Button component that opens the cookie consent modal
 * Designed to be used in the footer or privacy policy pages
 */
export function CookieConsentButton({
    variant = "link",
    className = "",
}: CookieConsentButtonProps) {
    const { openConsentModal, isInitialized } = useCookieConsent();

    // Don't render until the provider is initialized
    if (!isInitialized) return null;

    return (
        <Button
            variant={variant}
            onClick={openConsentModal}
            className={className}
            type="button"
        >
            Preferencias de cookies
        </Button>
    );
} 