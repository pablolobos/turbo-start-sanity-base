/**
 * Utility functions for cookie management
 */

interface CookieOptions {
    expires?: Date | number; // Date object or days as number
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value and options
 */
export function setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
): void {
    if (typeof window === 'undefined') return;

    const cookieOptions: CookieOptions = {
        path: '/',
        ...options,
    };

    // Handle expiration
    if (typeof cookieOptions.expires === 'number') {
        const days = cookieOptions.expires;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + days);
        cookieOptions.expires = expiry;
    }

    // Build cookie string
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Add options to cookie string
    if (cookieOptions.expires) {
        cookieString += `; expires=${cookieOptions.expires instanceof Date
            ? cookieOptions.expires.toUTCString()
            : cookieOptions.expires
            }`;
    }

    if (cookieOptions.path) {
        cookieString += `; path=${cookieOptions.path}`;
    }

    if (cookieOptions.domain) {
        cookieString += `; domain=${cookieOptions.domain}`;
    }

    if (cookieOptions.secure) {
        cookieString += '; secure';
    }

    if (cookieOptions.sameSite) {
        cookieString += `; samesite=${cookieOptions.sameSite}`;
    }

    // Set the cookie
    document.cookie = cookieString;
}

/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const decodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (cookie) {
            const trimmedCookie = cookie.trim();
            // Check if this cookie's name matches the target name
            if (trimmedCookie.indexOf(decodedName + '=') === 0) {
                // Return the cookie value
                return decodeURIComponent(
                    trimmedCookie.substring(decodedName.length + 1)
                );
            }
        }
    }

    return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, options: Omit<CookieOptions, 'expires'> = {}): void {
    // Set cookie with expiration in the past to remove it
    setCookie(name, '', {
        ...options,
        expires: new Date(0), // Set to epoch time
    });
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
    return getCookie(name) !== null;
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const result: Record<string, string> = {};
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (cookie) {
            const trimmedCookie = cookie.trim();
            const separatorIndex = trimmedCookie.indexOf('=');

            if (separatorIndex > 0) {
                const name = decodeURIComponent(trimmedCookie.substring(0, separatorIndex));
                const value = decodeURIComponent(trimmedCookie.substring(separatorIndex + 1));
                result[name] = value;
            }
        }
    }

    return result;
}

/**
 * Utility to manage Google Analytics cookies
 */
export function setupGoogleAnalytics(allow: boolean): void {
    if (typeof window === 'undefined') return;

    // If analytics not allowed, remove Google Analytics cookies
    if (!allow) {
        const gaCookies = Object.keys(getAllCookies()).filter(
            name => name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')
        );

        gaCookies.forEach(name => {
            deleteCookie(name);
        });

        // Disable tracking via window property
        const win = window as Window & typeof globalThis & {
            'ga-disable-GA_MEASUREMENT_ID': boolean;
        };
        win['ga-disable-GA_MEASUREMENT_ID'] = true;
    } else {
        // Enable tracking
        const win = window as Window & typeof globalThis & {
            'ga-disable-GA_MEASUREMENT_ID': boolean;
        };
        win['ga-disable-GA_MEASUREMENT_ID'] = false;
    }
} 