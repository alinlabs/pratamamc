export const formatPhoneInput = (value: string): string => {
  if (!value) return ''; // Allow empty
  
  // If user is trying to delete down to the prefix or delete completely
  const trimmed = value.trim();
  if (trimmed === '+' || trimmed === '+6' || trimmed === '+62' || trimmed === '6' || trimmed === '62' || trimmed === '+62 ') {
    return '';
  }

  // Extract all digit characters
  let digits = value.replace(/[^\d]/g, '');

  // Strip leading country code or leading zero
  if (digits.startsWith('62')) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // If they cleared everything or only entered '0' / '62'
  if (digits.length === 0) {
    return '+62 ';
  }

  // Format: +62 8XX-XXXX-XXXX
  let formatted = '+62 ';
  for (let i = 0; i < digits.length; i++) {
    if (i === 3 || i === 7) {
      formatted += '-';
    }
    formatted += digits[i];
  }

  return formatted;
};

export const cleanPhoneNumber = (value: string): string => {
  if (!value) return '';
  let digits = value.replace(/[^\d]/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  } else if (!digits.startsWith('62') && digits.length > 0) {
    digits = '62' + digits;
  }
  return digits;
};

export const formatSocialInput = (value: string): string => {
  if (!value) return '';
  
  // Remove spaces and multiple @
  let handle = value.trim();
  
  // Remove all @ symbols
  handle = handle.replace(/@/g, '');
  
  if (handle.length === 0) {
    if (value === '@') return ''; // Allow full deletion
    return '@';
  }

  // Make sure it starts with @
  return '@' + handle;
};
