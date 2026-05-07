export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return (
      process.env.API_URL_INTERNAL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000'
    );
  }

  return process.env.NEXT_PUBLIC_API_URL || '/api/backend';
}
