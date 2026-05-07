export interface CreateLeadPayload {
  name: string;
  email: string;
  description: string;
  phone?: string;
  company?: string;
  palletType?: string;
  dimensions?: string;
  weight?: string;
  route?: string;
  preferredDate?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function normalizeErrorMessage(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return 'Form submission failed.';
  const message = (raw as { message?: unknown }).message;
  if (Array.isArray(message)) {
    const first = message.find((item) => typeof item === 'string');
    if (typeof first === 'string') return first;
  }
  if (typeof message === 'string') return message;
  return 'Form submission failed.';
}

export async function createLead(payload: CreateLeadPayload) {
  const response = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new Error(normalizeErrorMessage(body));
  }

  return response.json();
}
