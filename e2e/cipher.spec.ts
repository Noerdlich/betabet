import { test, expect } from '@playwright/test';

test.describe('Cipher Translator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page.getByText('Betabet')).toBeVisible();
  });

  test('should encrypt text when typing in plaintext field', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await plaintextInput.fill('HELLO');
    await expect(ciphertextInput).toHaveValue('MEVVI');
  });

  test('should decrypt text when typing in ciphertext field', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await ciphertextInput.fill('MEVVI');
    await expect(plaintextInput).toHaveValue('HELLO');
  });

  test('should preserve case in encryption', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await plaintextInput.fill('Hello World');
    await expect(ciphertextInput).toHaveValue('Mevvi Zikvd');
  });

  test('should handle German umlauts', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await plaintextInput.fill('Größe');
    
    // Verify encryption happened
    const cipherValue = await ciphertextInput.inputValue();
    expect(cipherValue.length).toBe(5);
    
    // Clear and verify decryption
    await plaintextInput.clear();
    await ciphertextInput.fill(cipherValue);
    await expect(plaintextInput).toHaveValue('Größe');
  });

  test('should update character count', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const charCount = page.getByTestId('plaintext-char-count');

    await expect(charCount).toHaveText('0 Zeichen');
    
    await plaintextInput.fill('TEST');
    await expect(charCount).toHaveText('4 Zeichen');
    
    await plaintextInput.fill('TEST MESSAGE');
    await expect(charCount).toHaveText('12 Zeichen');
  });

  test('should swap text fields', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');
    const swapButton = page.getByTestId('swap-button');

    await plaintextInput.fill('HELLO');
    await expect(ciphertextInput).toHaveValue('MEVVI');

    await swapButton.click();

    await expect(plaintextInput).toHaveValue('MEVVI');
    await expect(ciphertextInput).toHaveValue('HELLO');
  });

  test('should clear both fields', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');
    const clearButton = page.getByTestId('clear-button');

    await plaintextInput.fill('TEST');
    await expect(ciphertextInput).toHaveValue('OEQO');

    await clearButton.click();

    await expect(plaintextInput).toHaveValue('');
    await expect(ciphertextInput).toHaveValue('');
  });

  test('should disable clear button when fields are empty', async ({ page }) => {
    const clearButton = page.getByTestId('clear-button');
    await expect(clearButton).toBeDisabled();

    const plaintextInput = page.getByTestId('plaintext-input');
    await plaintextInput.fill('TEST');
    await expect(clearButton).toBeEnabled();

    await clearButton.click();
    await expect(clearButton).toBeDisabled();
  });

  test('should copy plaintext to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const plaintextInput = page.getByTestId('plaintext-input');
    const copyButton = page.getByTestId('copy-plaintext-button');

    await plaintextInput.fill('TEST MESSAGE');
    await copyButton.click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('TEST MESSAGE');
  });

  test('should copy ciphertext to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const plaintextInput = page.getByTestId('plaintext-input');
    const copyCipherButton = page.getByTestId('copy-ciphertext-button');

    await plaintextInput.fill('TEST');
    await copyCipherButton.click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('OEQO');
  });

  test('should handle long text', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');
    
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10);
    await plaintextInput.fill(longText);
    
    const cipherValue = await ciphertextInput.inputValue();
    expect(cipherValue.length).toBe(longText.length);
    
    // Verify decryption
    await plaintextInput.clear();
    await ciphertextInput.fill(cipherValue);
    await expect(plaintextInput).toHaveValue(longText);
  });

  test('should be bidirectional', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    const testText = 'Das ist ein Test mit Umlauten: ÄÖÜ äöü!';
    
    // Encrypt
    await plaintextInput.fill(testText);
    const encrypted = await ciphertextInput.inputValue();
    
    // Clear and decrypt
    await plaintextInput.clear();
    await ciphertextInput.clear();
    await ciphertextInput.fill(encrypted);
    
    await expect(plaintextInput).toHaveValue(testText);
  });

  test('should preserve special characters and numbers', async ({ page }) => {
    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await plaintextInput.fill('Test 123 @#$ 456!');
    
    const cipherValue = await ciphertextInput.inputValue();
    // 1->3, 2->1, 3->5
    expect(cipherValue).toContain('315');
    // @->',', #->'\', $->'@'
    expect(cipherValue).toContain(',\'@');
    // 4->9, 5->0, 6->6, !->!
    expect(cipherValue).toContain('906!');
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const plaintextInput = page.getByTestId('plaintext-input');
    const ciphertextInput = page.getByTestId('ciphertext-input');

    await plaintextInput.fill('MOBILE');
    // M->G, O->I, B->B, I->N, L->V, E->E
    await expect(ciphertextInput).toHaveValue('GIBNVE');
  });

  test('should display swap button on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const swapButton = page.getByTestId('swap-button');
    await expect(swapButton).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper aria labels', async ({ page }) => {
    await page.goto('/');

    const plaintextInput = page.getByLabel('Klartext eingeben');
    const ciphertextInput = page.getByLabel('Chiffretext eingeben');
    const swapButton = page.getByLabel('Texte tauschen');

    await expect(plaintextInput).toBeVisible();
    await expect(ciphertextInput).toBeVisible();
    await expect(swapButton).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    const plaintextInput = page.getByTestId('plaintext-input');
    
    await plaintextInput.focus();
    await page.keyboard.type('TEST');
    
    const ciphertextInput = page.getByTestId('ciphertext-input');
    await expect(ciphertextInput).toHaveValue('OEQO');
  });
});
