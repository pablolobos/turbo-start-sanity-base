"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";
import {
    setCookie,
    getCookie,
    deleteCookie,
    setupGoogleAnalytics
} from "@/lib/cookie-manager";

// Cookie consent types
type CookieCategory = "necessary" | "performance" | "functionality" | "targeting";

type CookieConsent = {
    necessary: boolean; // Always true
    performance: boolean;
    functionality: boolean;
    targeting: boolean;
    hasInteracted: boolean; // Whether the user has made any choice
};

const defaultConsent: CookieConsent = {
    necessary: true, // Always required
    performance: false,
    functionality: false,
    targeting: false,
    hasInteracted: false,
};

type CookieConsentContextType = {
    consent: CookieConsent;
    updateConsent: (category: CookieCategory, value: boolean) => void;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: () => void;
    isConsentModalOpen: boolean;
    openConsentModal: () => void;
    closeConsentModal: () => void;
    isInitialized: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }
    return context;
};

const CONSENT_STORAGE_KEY = "volvo-cookie-consent";

export function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved consent from localStorage on first render
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

            if (savedConsent) {
                try {
                    const parsedConsent = JSON.parse(savedConsent) as CookieConsent;
                    setConsent(prev => ({
                        ...parsedConsent,
                        necessary: true, // Always enforce necessary cookies
                    }));

                    // Apply saved consent settings to actual cookies
                    applyConsentSettings(parsedConsent);
                } catch (error) {
                    console.error("Error parsing saved cookie consent:", error);
                    // If parsing fails, reset to default
                    localStorage.removeItem(CONSENT_STORAGE_KEY);
                    setConsent(defaultConsent);
                }
            } else {
                // If no saved preferences, open the modal automatically
                setIsConsentModalOpen(true);
            }

            setIsInitialized(true);
        }
    }, []);

    // Apply consent settings to actual cookies
    const applyConsentSettings = (consentSettings: CookieConsent) => {
        // Handle analytics cookies (Google Analytics, etc.)
        setupGoogleAnalytics(consentSettings.performance);

        // Set a consent cookie that can be read server-side if needed
        setCookie("cookie-consent", JSON.stringify({
            necessary: consentSettings.necessary,
            performance: consentSettings.performance,
            functionality: consentSettings.functionality,
            targeting: consentSettings.targeting
        }), {
            expires: 365, // 1 year
            sameSite: "lax"
        });

        // If functionality cookies are rejected, remove them
        if (!consentSettings.functionality) {
            // Add functionality cookie deletion here if needed
        }

        // If targeting cookies are rejected, remove them
        if (!consentSettings.targeting) {
            // Add targeting/advertising cookie deletion here if needed
        }
    };

    // Update a single consent category
    const updateConsent = (category: CookieCategory, value: boolean) => {
        setConsent(prev => ({
            ...prev,
            [category]: category === "necessary" ? true : value, // Necessary cookies can't be disabled
        }));
    };

    // Accept all cookies
    const acceptAll = () => {
        const allAccepted: CookieConsent = {
            necessary: true,
            performance: true,
            functionality: true,
            targeting: true,
            hasInteracted: true,
        };

        setConsent(allAccepted);
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allAccepted));
        applyConsentSettings(allAccepted);
        setIsConsentModalOpen(false);
    };

    // Reject all optional cookies
    const rejectAll = () => {
        const allRejected: CookieConsent = {
            necessary: true, // Still required
            performance: false,
            functionality: false,
            targeting: false,
            hasInteracted: true,
        };

        setConsent(allRejected);
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allRejected));
        applyConsentSettings(allRejected);
        setIsConsentModalOpen(false);
    };

    // Save current preferences
    const savePreferences = () => {
        const updatedConsent = {
            ...consent,
            hasInteracted: true,
        };

        setConsent(updatedConsent);
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updatedConsent));
        applyConsentSettings(updatedConsent);
        setIsConsentModalOpen(false);
    };

    // Open consent modal
    const openConsentModal = () => {
        setIsConsentModalOpen(true);
    };

    // Close consent modal
    const closeConsentModal = () => {
        // If the user has interacted with the modal already, just close it
        if (consent.hasInteracted) {
            setIsConsentModalOpen(false);
            return;
        }

        // If user tries to close without making a choice, set default preferences and mark as interacted
        const defaultChoices: CookieConsent = {
            ...consent,
            hasInteracted: true,
        };

        setConsent(defaultChoices);
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(defaultChoices));
        applyConsentSettings(defaultChoices);
        setIsConsentModalOpen(false);
    };

    const contextValue: CookieConsentContextType = {
        consent,
        updateConsent,
        acceptAll,
        rejectAll,
        savePreferences,
        isConsentModalOpen,
        openConsentModal,
        closeConsentModal,
        isInitialized
    };

    return (
        <CookieConsentContext.Provider value={contextValue}>
            {children}
        </CookieConsentContext.Provider>
    );
} 