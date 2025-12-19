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
  'A': 'A',
  'B': 'B',
  'C': 'C',
  'D': 'D',
  'E': 'E',
  'F': 'F',
  'G': 'L',
  'H': 'M',
  'I': 'N',
  'J': 'R',
  'K': 'S',
  'L': 'V',
  'M': 'G',
  'N': 'H',
  'O': 'I',
  'P': 'X',
  'Q': 'J',
  'R': 'K',
  'S': 'Q',
  'T': 'O',
  'U': 'P',
  'V': 'T',
  'W': 'Z',
  'X': 'U',
  'Y': 'Y',
  'Z': 'W',
  'Ä': 'Ä',
  'Ö': 'Ö',
  'Ü': 'Ü',
  'ß': 'ß',
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
