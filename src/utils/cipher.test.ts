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
      expect(encrypt('ÄÖÜSS')).toBe('ÄÖÜQQ');
      expect(encrypt('äöü')).toBe('äöü');
    });

    it('should preserve spaces', () => {
      expect(encrypt('HELLO WORLD')).toBe('MEVVI ZIKVD');
    });

    it('should encrypt numbers', () => {
      expect(encrypt('TEST123')).toBe('OEQO315');
    });

    it('should preserve special characters', () => {
      expect(encrypt('HELLO, WORLD!')).toBe('MEVVI, ZIKVD!');
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
  });
});
