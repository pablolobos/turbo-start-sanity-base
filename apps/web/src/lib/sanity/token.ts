// Use process.env conditionally to support both server and client components
export const token = typeof process !== 'undefined' && process.env
  ? process.env.SANITY_API_READ_TOKEN
  : undefined;
