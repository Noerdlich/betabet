import { encrypt, decrypt, createReverseMapping, validateMapping, DEFAULT_CIPHER_MAPPING } from './cipher';

describe('cipher', () => {
  describe('encrypt', () => {
    it('should encrypt simple text', () => {
      expect(encrypt('HELLO')).toBe('MEVVI');
    });

    it('should preserve case', () => {
      expect(encrypt('Hello')).toBe('Mevvi');
      expect(encrypt('hello')).toBe('mevvi');
      expect(encrypt('HELLO')).toBe('MEVVI');
    });

    it('should handle German umlauts', () => {
      expect(encrypt('ÄÖÜSS')).toBe('ÜÄÖQQ');
      expect(encrypt('äöü')).toBe('üäö');
    });

    it('should preserve spaces', () => {
      expect(encrypt('HELLO WORLD')).toBe('MEVVI ZIKVD');
    });

    it('should encrypt numbers', () => {
      expect(encrypt('TEST123')).toBe('OEQO315');
    });

    it('should preserve special characters', () => {
      expect(encrypt('HELLO, WORLD!')).toBe('MEVVI? ZIKVD!');
    });

    it('should encrypt special characters according to mapping', () => {
      // Test some of the new special character mappings
      expect(encrypt('"')).toBe('"');
      expect(encrypt('#')).toBe('\'');
      expect(encrypt('$')).toBe('@');
      expect(encrypt('%')).toBe('\\');
      expect(encrypt('&')).toBe('-');
      expect(encrypt('\'')).toBe('$');
      expect(encrypt('(')).toBe(':');
      expect(encrypt(')')).toBe('[');
      expect(encrypt('*')).toBe(']');
      expect(encrypt('+')).toBe('€');
      expect(encrypt(',')).toBe('?');
      expect(encrypt('-')).toBe('{');
      expect(encrypt('.')).toBe('}');
      expect(encrypt('/')).toBe('=');
    });

    it('should encrypt more special characters', () => {
      expect(encrypt(':')).toBe('°');
      expect(encrypt(';')).toBe('>');
      expect(encrypt('<')).toBe('^');
      expect(encrypt('=')).toBe('(');
      expect(encrypt('>')).toBe(')');
      expect(encrypt('?')).toBe('<');
      expect(encrypt('@')).toBe(',');
      expect(encrypt('[')).toBe('§');
      expect(encrypt('\\')).toBe('+');
      expect(encrypt(']')).toBe('%');
      expect(encrypt('^')).toBe('.');
      expect(encrypt('_')).toBe('#');
    });

    it('should encrypt remaining special characters', () => {
      expect(encrypt('{')).toBe('/');
      expect(encrypt('|')).toBe(';');
      expect(encrypt('}')).toBe('*');
      expect(encrypt('~')).toBe('|');
      expect(encrypt('€')).toBe('ß');
      expect(encrypt('°')).toBe('~');
      expect(encrypt('§')).toBe('&');
    });

    it('should encrypt lowercase German special characters', () => {
      expect(encrypt('ß')).toBe('_');
      expect(encrypt('Ä')).toBe('Ü');
      expect(encrypt('Ö')).toBe('Ä');
      expect(encrypt('Ü')).toBe('Ö');
      expect(encrypt('ä')).toBe('ü');
      expect(encrypt('ö')).toBe('ä');
      expect(encrypt('ü')).toBe('ö');
    });

    it('should handle empty string', () => {
      expect(encrypt('')).toBe('');
    });

    it('should handle mixed content', () => {
      expect(encrypt('Das ist ein Test!')).toBe('Daq nqo enh Oeqo!');
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted text', () => {
      const original = 'HELLO';
      const encrypted = encrypt(original);
      expect(decrypt(encrypted)).toBe(original);
    });

    it('should decrypt with preserved case', () => {
      const original = 'Hello World';
      const encrypted = encrypt(original);
      expect(decrypt(encrypted)).toBe(original);
    });

    it('should decrypt German umlauts', () => {
      const original = 'Größe';
      const encrypted = encrypt(original);
      expect(decrypt(encrypted)).toBe(original);
    });

    it('should handle mixed content', () => {
      const original = 'Das ist ein Test 123!';
      const encrypted = encrypt(original);
      expect(decrypt(encrypted)).toBe(original);
    });
  });

  describe('createReverseMapping', () => {
    it('should create correct reverse mapping', () => {
      const mapping = { 'A': 'B', 'B': 'C', 'C': 'A' };
      const reverse = createReverseMapping(mapping);
      expect(reverse).toEqual({ 'B': 'A', 'C': 'B', 'A': 'C' });
    });

    it('should work with default mapping', () => {
      const reverse = createReverseMapping(DEFAULT_CIPHER_MAPPING);
      expect(Object.keys(reverse).length).toBe(Object.keys(DEFAULT_CIPHER_MAPPING).length);
      
      // Test that applying both mappings returns original
      expect(reverse[DEFAULT_CIPHER_MAPPING['A']]).toBe('A');
    });
  });

  describe('validateMapping', () => {
    it('should validate correct mapping', () => {
      const result = validateMapping(DEFAULT_CIPHER_MAPPING);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should detect duplicate values', () => {
      const invalidMapping = { 'A': 'B', 'C': 'B' };
      const result = validateMapping(invalidMapping);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Mapping contains duplicate values');
    });

    it('should detect empty mapping', () => {
      const result = validateMapping({});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Mapping is empty');
    });

    it('should validate custom mapping', () => {
      const customMapping = { 'A': 'Z', 'B': 'Y', 'C': 'X' };
      const result = validateMapping(customMapping);
      expect(result.valid).toBe(true);
    });
  });

  describe('bidirectional encryption/decryption', () => {
    it('should be reversible for all characters', () => {
      const testCases = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'äöüßÄÖÜ',
        '1234567890',
        'The Quick Brown Fox Jumps Over 13 Lazy Dogs!',
        'Größe, Äpfel & Übung = 100%',
      ];

      testCases.forEach(testCase => {
        const encrypted = encrypt(testCase);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(testCase);
      });
    });

    it('should be reversible for special characters', () => {
      const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_{|}~€°§';
      const encrypted = encrypt(specialChars);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(specialChars);
    });

    it('should be reversible for complex mixed text', () => {
      const complexText = 'Test: 100% @ {Zeit} = [Erfolg]! "Gut" & \'Super\' - €50 + $20';
      const encrypted = encrypt(complexText);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(complexText);
    });

    it('should handle German umlauts bidirectionally', () => {
      const germanText = 'äöüßÄÖÜ - Größe, Äpfel, Übung';
      const encrypted = encrypt(germanText);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(germanText);
    });
  });

  describe('special character edge cases', () => {
    it('should handle text with only special characters', () => {
      const specialOnly = '!@#$%^&*()';
      const encrypted = encrypt(specialOnly);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(specialOnly);
    });

    it('should handle brackets and braces correctly', () => {
      const brackets = '()[]{}<>';
      const encrypted = encrypt(brackets);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(brackets);
    });

    it('should handle punctuation correctly', () => {
      const punctuation = '.,;:!?-_';
      const encrypted = encrypt(punctuation);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(punctuation);
    });

    it('should handle currency and math symbols', () => {
      const symbols = '€$%^+=-@';
      const encrypted = encrypt(symbols);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(symbols);
    });
  });
});
