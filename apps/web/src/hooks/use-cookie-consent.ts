"use client";

import { useCookieConsent } from "@/context/cookie-consent-provider";

/**
 * Hook to check if a specific cookie category is allowed
 * 
 * @example
 * const { isAllowed, openConsentModal } = useCookieConsentCheck();
 * 
 * // Check if a specific category is allowed
 * if (isAllowed('performance')) {
 *   // Initialize analytics
 * }
 * 
 * // Direct check functions
 * if (isAnalyticsAllowed()) {
 *   // Initialize analytics
 * }
 */
export function useCookieConsentCheck() {
    const {
        consent,
        openConsentModal,
        acceptAll
    } = useCookieConsent();

    /**
     * Check if a specific cookie category is allowed
     */
    const isAllowed = (category: 'necessary' | 'performance' | 'functionality' | 'targeting') => {
        return !!consent[category];
    };

    /**
     * Check if analytics/performance cookies are allowed
     */
    const isAnalyticsAllowed = () => {
        return isAllowed('performance');
    };

    /**
     * Check if functionality cookies are allowed
     */
    const isFunctionalityAllowed = () => {
        return isAllowed('functionality');
    };

    /**
     * Check if targeting/advertising cookies are allowed
     */
    const isTargetingAllowed = () => {
        return isAllowed('targeting');
    };

    /**
     * Check if the user has interacted with the consent modal
     */
    const hasInteracted = () => {
        return consent.hasInteracted;
    };

    return {
        isAllowed,
        isAnalyticsAllowed,
        isFunctionalityAllowed,
        isTargetingAllowed,
        hasInteracted,
        openConsentModal,
        acceptAll
    };
} 