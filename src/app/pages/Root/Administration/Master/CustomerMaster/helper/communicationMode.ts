export const convertToFullForm = (shortCode: 's' | 'e' | 'w') => {
    const mapping: { [key in 's' | 'e' | 'w']: string } = {
      s: "sms",
      e: "email",
      w: "whatsapp",
    };
    return mapping[shortCode] || "sms"; // Default to "sms" if unknown value
  };