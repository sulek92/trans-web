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

export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
