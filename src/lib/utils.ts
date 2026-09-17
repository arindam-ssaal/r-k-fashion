import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const encryptData = (data: string): string => {
  return btoa(data);  // Base64 Encode (Mock Encryption)
};

export const decryptData = (data: string): string => {
  return atob(data);  // Base64 Decode
};


export function formatDate(date: Date | string): string {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');    // ✅ 2-digit day
  const month = String(d.getMonth() + 1).padStart(2, '0');  // ✅ 2-digit month
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;  // ✅ DD-MM-YYYY format
}


export const convertToDate = (dateStr:string) => {
  if (!dateStr) return new Date(); // Default today if no date provided

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [day, month, year] = dateStr?.split(" ")?.[0]?.split("/");
  return new Date(`${year}-${month}-${day}`);
};