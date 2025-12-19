/**
 * Substitution cipher for German alphabet including umlauts
 * Maps each letter to another letter for encryption/decryption
 */

export interface CipherMapping {
  [key: string]: string;
}

/**
 * Default cipher mapping - can be customized
 * Maps A-Z and German umlauts (Ä, Ö, Ü, ß)
 */
export const DEFAULT_CIPHER_MAPPING: CipherMapping = {
  'A': 'Q',
  'B': 'W',
  'C': 'E',
  'D': 'R',
  'E': 'T',
  'F': 'Z',
  'G': 'U',
  'H': 'I',
  'I': 'O',
  'J': 'P',
  'K': 'A',
  'L': 'S',
  'M': 'D',
  'N': 'F',
  'O': 'G',
  'P': 'H',
  'Q': 'J',
  'R': 'K',
  'S': 'L',
  'T': 'Y',
  'U': 'X',
  'V': 'C',
  'W': 'V',
  'X': 'B',
  'Y': 'N',
  'Z': 'M',
  'Ä': 'Ü',
  'Ö': 'Ä',
  'Ü': 'Ö',
  'ß': 'ẞ',
};

/**
 * Creates a reverse mapping for decryption
 */
export const createReverseMapping = (mapping: CipherMapping): CipherMapping => {
  const reverseMap: CipherMapping = {};
  Object.entries(mapping).forEach(([key, value]) => {
    reverseMap[value] = key;
  });
  return reverseMap;
};

/**
 * Encrypts text using the provided cipher mapping
 * - Converts to uppercase for mapping
 * - Preserves spaces, numbers, and special characters
 * - Maintains original case in output
 */
export const encrypt = (text: string, mapping: CipherMapping = DEFAULT_CIPHER_MAPPING): string => {
  let result = '';
  
  for (const char of text) {
    const upperChar = char.toUpperCase();
    
    if (mapping[upperChar]) {
      // Apply cipher mapping and preserve original case
      const encrypted = mapping[upperChar];
      result += char === char.toLowerCase() ? encrypted.toLowerCase() : encrypted;
    } else {
      // Keep unchanged (spaces, numbers, punctuation, etc.)
      result += char;
    }
  }
  
  return result;
};

/**
 * Decrypts text using the reverse of the provided cipher mapping
 */
export const decrypt = (text: string, mapping: CipherMapping = DEFAULT_CIPHER_MAPPING): string => {
  const reverseMapping = createReverseMapping(mapping);
  return encrypt(text, reverseMapping);
};

/**
 * Validates that a cipher mapping is complete and bijective
 * (one-to-one mapping with no duplicates)
 */
export const validateMapping = (mapping: CipherMapping): { valid: boolean; error?: string } => {
  const values = Object.values(mapping);
  const uniqueValues = new Set(values);
  
  if (values.length !== uniqueValues.size) {
    return { valid: false, error: 'Mapping contains duplicate values' };
  }
  
  const keys = Object.keys(mapping);
  if (keys.length === 0) {
    return { valid: false, error: 'Mapping is empty' };
  }
  
  return { valid: true };
};
