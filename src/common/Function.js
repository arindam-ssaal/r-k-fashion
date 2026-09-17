import CryptoJS from 'crypto-js';

const secretKey = '11BBW2VOY0vWcZSX6qAg3u_EWXXkgZBpX54Cmd94PT5WcEJJ3ARmURpV3RrbqnrnmI45KMBB2MBX29f1dz';

export function encryptData(data) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
}

export function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

export const reverseDateString = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};