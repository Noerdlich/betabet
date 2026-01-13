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
  '"': 'Ä',
  '#': '"',
  '$': '\'',
  '%': '@',
  '&': '\\',
  '\'': '-',
  '(': '$',
  ')': ':',
  '*': '[',
  '+': ']',
  ',': '€',
  '-': '?',
  '.': '{',
  '/': '}',
  ':': '=',
  ';': '°',
  '<': '>',
  '=': '^',
  '>': '(',
  '?': ')',
  '@': '<',
  '[': ',',
  '\\': 'Ö',
  ']': '§',
  '^': '+',
  '_': '%',
  '{': '.',
  '|': '#',
  '}': '/',
  '~': ';',
  '€': '*',
  '°': '|',
  '§': 'ß',
  'ß': '~',
  'Ä': 'Ü',
  'Ö': '&',
  'Ü': '_',
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
 * - Uses a special marker (◌) to preserve case when mapping to non-letter characters
 */
export const encrypt = (text: string, mapping: CipherMapping = DEFAULT_CIPHER_MAPPING): string => {
  let result = '';
  
  for (const char of text) {
    // First check if the character itself is in the mapping (lowercase umlauts, special chars)
    if (mapping[char]) {
      result += mapping[char];
    } else {
      // Try uppercase version for letters
      const upperChar = char.toUpperCase();
      
      if (mapping[upperChar]) {
        const encrypted = mapping[upperChar];
        const wasLowerCase = char === char.toLowerCase() && char !== char.toUpperCase();
        
        // If original was lowercase and encrypted value has no case, add marker
        if (wasLowerCase && encrypted === encrypted.toUpperCase() && encrypted === encrypted.toLowerCase()) {
          result += '◌' + encrypted;
        } else {
          // Normal case preservation for letters
          result += wasLowerCase ? encrypted.toLowerCase() : encrypted;
        }
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
 * - Handles the special marker (◌) for case preservation
 */
export const decrypt = (text: string, mapping: CipherMapping = DEFAULT_CIPHER_MAPPING): string => {
  const reverseMapping = createReverseMapping(mapping);
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    
    // Check for lowercase marker
    if (char === '◌' && i + 1 < text.length) {
      const nextChar = text[i + 1];
      if (reverseMapping[nextChar]) {
        result += reverseMapping[nextChar].toLowerCase();
        i += 2;
        continue;
      }
    }
    
    // Normal decryption
    if (reverseMapping[char]) {
      result += reverseMapping[char];
    } else {
      const upperChar = char.toUpperCase();
      
      if (reverseMapping[upperChar]) {
        const decrypted = reverseMapping[upperChar];
        const wasLowerCase = char === char.toLowerCase() && char !== char.toUpperCase();
        result += wasLowerCase ? decrypted.toLowerCase() : decrypted;
      } else {
        result += char;
      }
    }
    
    i++;
  }
  
  return result;
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
