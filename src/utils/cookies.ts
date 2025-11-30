/**
 * Utility functions for handling cookies in the browser
 */

export const setCookie = (name: string, value: string, hours: number = 24) => {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${
    process.env.NODE_ENV === 'production' ? ';Secure' : ''
  }`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
