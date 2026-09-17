'use client'

import { toast } from 'sonner'

export const __getCookieValue = (name: string, redirectOnMissing = true) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  let value = match ? match[2] : null;

  if (!value) {
    value = localStorage.getItem(name);
  }

  if (!value && redirectOnMissing) {

    //window.dispatchEvent(new Event('session-expired'));

    toast.error('Session expired. Please login again.', {
      style: {
        backgroundColor: '#f7edeb',
        color: '#ff6242',
      },
    });

    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);

    //throw new Error('Session expired');
    return null;
    //return false;   //null;
  }

  return value;
};