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
  '0': '8',
  '1': '3',
  '2': '1',
  '3': '5',
  '4': '9',
  '5': '0',
  '6': '6',
  '7': '7',
  '8': '4',
  '9': '2',
  '!': '!',
  '"': '"',
  '#': '\'',
  '$': '@',
  '%': '\\',
  '&': '-',
  '\'': '$',
  '(': ':',
  ')': '[',
  '*': ']',
  '+': '€',
  ',': '?',
  '-': '{',
  '.': '}',
  '/': '=',
  ':': '°',
  ';': '>',
  '<': '^',
  '=': '(',
  '>': ')',
  '?': '<',
  '@': ',',
  '[': '§',
  '\\': '+',
  ']': '%',
  '^': '.',
  '_': '#',
  '{': '/',
  '|': ';',
  '}': '*',
  '~': '|',
  '€': 'ß',
  '°': '~',
  '§': '&',
  'ß': '_',
  'Ä': 'Ü',
  'Ö': 'Ä',
  'Ü': 'Ö',
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
 * - Preserves spaces and unmapped characters
 * - Handles both uppercase and lowercase letters
 * - Supports special characters and umlauts
 */
export const encrypt = (text: string, mapping: CipherMapping = DEFAULT_CIPHER_MAPPING): string => {
  let result = '';
  
  for (const char of text) {
    // First check if the character itself is in the mapping
    if (mapping[char]) {
      result += mapping[char];
    } else {
      // Try uppercase version for letters
      const upperChar = char.toUpperCase();
      
      if (mapping[upperChar]) {
        // Apply cipher mapping and preserve original case
        const encrypted = mapping[upperChar];
        const wasLowerCase = char === char.toLowerCase() && char !== char.toUpperCase();
        result += wasLowerCase ? encrypted.toLowerCase() : encrypted;
      } else {
        // Keep unchanged (spaces, unmapped characters, etc.)
        result += char;
      }
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
