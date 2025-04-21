import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}