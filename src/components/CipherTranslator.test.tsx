import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CipherTranslator from './CipherTranslator';

describe('CipherTranslator', () => {
  describe('Initial Render', () => {
    it('should render the component', () => {
      render(<CipherTranslator />);
      expect(screen.getByText('Alphabet v1.1')).toBeInTheDocument();
    });

    it('should render both text areas', () => {
      render(<CipherTranslator />);
      expect(screen.getByTestId('plaintext-input')).toBeInTheDocument();
      expect(screen.getByTestId('ciphertext-input')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<CipherTranslator />);
      expect(screen.getByTestId('swap-button')).toBeInTheDocument();
      expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    });

    it('should show character counts', () => {
      render(<CipherTranslator />);
      expect(screen.getByTestId('plaintext-char-count')).toHaveTextContent('0 Zeichen');
      expect(screen.getByTestId('ciphertext-char-count')).toHaveTextContent('0 Zeichen');
    });
  });

  describe('Encryption Flow', () => {
    it('should encrypt text when typing in plaintext field', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      await user.type(plaintextInput, 'HELLO');

      expect(plaintextInput.value).toBe('HELLO');
      expect(ciphertextInput.value).toBe('MEVVI');
    });

    it('should update character count when typing', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input');
      await user.type(plaintextInput, 'TEST');

      expect(screen.getByTestId('plaintext-char-count')).toHaveTextContent('4 Zeichen');
      expect(screen.getByTestId('ciphertext-char-count')).toHaveTextContent('4 Zeichen');
    });

    it('should handle German umlauts', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      await user.type(plaintextInput, 'ÄÖÜ');

      expect(ciphertextInput.value).toBe('ÄÖÜ');
    });

    it('should preserve case', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      await user.type(plaintextInput, 'Hello');

      expect(ciphertextInput.value).toBe('Mevvi');
    });

    it('should preserve special characters and numbers', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      await user.type(plaintextInput, 'Test 123!');

      expect(ciphertextInput.value).toBe('Oeqo 123!');
    });
  });

  describe('Decryption Flow', () => {
    it('should decrypt text when typing in ciphertext field', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      await user.type(ciphertextInput, 'MEVVI');

      expect(ciphertextInput.value).toBe('MEVVI');
      expect(plaintextInput.value).toBe('HELLO');
    });

    it('should be reversible', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;

      // Encrypt
      await user.type(plaintextInput, 'TEST');
      const encrypted = ciphertextInput.value;

      // Clear
      await user.clear(plaintextInput);
      await user.clear(ciphertextInput);

      // Decrypt
      await user.type(ciphertextInput, encrypted);
      expect(plaintextInput.value).toBe('TEST');
    });
  });

  describe('Swap Functionality', () => {
    it('should swap text fields when swap button is clicked', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;
      const swapButton = screen.getByTestId('swap-button');

      await user.type(plaintextInput, 'HELLO');
      
      expect(plaintextInput.value).toBe('HELLO');
      expect(ciphertextInput.value).toBe('MEVVI');

      await user.click(swapButton);

      expect(plaintextInput.value).toBe('MEVVI');
      expect(ciphertextInput.value).toBe('HELLO');
    });
  });

  describe('Clear Functionality', () => {
    it('should clear both fields when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input') as HTMLTextAreaElement;
      const ciphertextInput = screen.getByTestId('ciphertext-input') as HTMLTextAreaElement;
      const clearButton = screen.getByTestId('clear-button');

      await user.type(plaintextInput, 'TEST');
      
      expect(plaintextInput.value).toBe('TEST');
      expect(ciphertextInput.value).toBe('OEQO');

      await user.click(clearButton);

      expect(plaintextInput.value).toBe('');
      expect(ciphertextInput.value).toBe('');
    });

    it('should disable clear button when both fields are empty', () => {
      render(<CipherTranslator />);
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Button States', () => {
    it('should disable clear button when both fields are empty', () => {
      render(<CipherTranslator />);
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton).toBeDisabled();
    });

    it('should disable copy buttons when fields are empty', () => {
      render(<CipherTranslator />);
      expect(screen.getByTestId('copy-plaintext-button')).toBeDisabled();
      expect(screen.getByTestId('copy-ciphertext-button')).toBeDisabled();
    });

    it('should enable copy buttons when fields have text', async () => {
      const user = userEvent.setup();
      render(<CipherTranslator />);
      
      const plaintextInput = screen.getByTestId('plaintext-input');
      await user.type(plaintextInput, 'TEST');

      expect(screen.getByTestId('copy-plaintext-button')).toBeEnabled();
      expect(screen.getByTestId('copy-ciphertext-button')).toBeEnabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      render(<CipherTranslator />);
      expect(screen.getByLabelText('Klartext eingeben')).toBeInTheDocument();
      expect(screen.getByLabelText('Chiffretext eingeben')).toBeInTheDocument();
      expect(screen.getByLabelText('Texte tauschen')).toBeInTheDocument();
    });
  });
});
