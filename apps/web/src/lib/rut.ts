/**
 * Cleans a RUT string by removing all non-alphanumeric characters
 */
export const cleanRut = (rut: string | undefined): string => {
    return (rut || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Validates a Chilean RUT
 */
export const validateRut = (rut: string | undefined): boolean => {
    if (!rut || rut.length < 2) return false;

    const cleanValue = cleanRut(rut);

    // Check basic format
    if (!/^[0-9]{7,8}[0-9K]$/i.test(cleanValue)) return false;

    // Separate digits and verifier
    const rutDigits = cleanValue.slice(0, -1);
    const verifier = cleanValue.slice(-1).toUpperCase();

    // Calculate verification digit
    let sum = 0;
    let multiplier = 2;

    // Iterate from right to left
    for (let i = rutDigits.length - 1; i >= 0; i--) {
        const digit = rutDigits[i] || '0';
        sum += parseInt(digit, 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedVerifier = 11 - (sum % 11);
    const calculatedVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'K' : expectedVerifier.toString();

    return calculatedVerifier === verifier;
} 