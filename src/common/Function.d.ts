declare module '@/common/Function' {
    export function encryptData(data: any): string;
    export function decryptData(encryptedData: string): any;
    export function reverseDateString(dateString: string): string;
}