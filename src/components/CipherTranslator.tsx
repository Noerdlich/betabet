import React, { useState } from 'react';
import { encrypt, decrypt } from '../utils/cipher';
import './CipherTranslator.css';

const CipherTranslator: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [cipherText, setCipherText] = useState('');

  const handlePlainTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPlainText(text);
    setCipherText(encrypt(text));
  };

  const handleCipherTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCipherText(text);
    setPlainText(decrypt(text));
  };

  const handleSwap = () => {
    const temp = plainText;
    setPlainText(cipherText);
    setCipherText(temp);
  };

  const handleClear = () => {
    setPlainText('');
    setCipherText('');
  };

  const handleCopyPlainText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyCipherText = async () => {
    try {
      await navigator.clipboard.writeText(cipherText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <>
      <div className="App-header">
        <h1>Betabet</h1>
        <img src="/logo512.png" alt="Betabet Logo" className="app-logo" />
        <p className="subtitle">Chiffrieren und dechiffrieren von Texten</p>
      </div>
      <div className="App-main">
        <div className="cipher-container">

      <div className="cipher-content">
        <div className="cipher-panel">
          <div className="cipher-panel-header">
            <span className="cipher-panel-title">Klartext</span>
            <span className="char-count" data-testid="plaintext-char-count">
              {plainText.length} Zeichen
            </span>
          </div>
          <textarea
            className="cipher-textarea"
            value={plainText}
            onChange={handlePlainTextChange}
            placeholder="Geben Sie hier Ihren Text ein..."
            data-testid="plaintext-input"
            aria-label="Klartext eingeben"
          />
          <button
            className="cipher-button"
            onClick={handleCopyPlainText}
            disabled={!plainText}
            data-testid="copy-plaintext-button"
            style={{ marginTop: '0.5rem' }}
          >
            📋 Kopieren
          </button>
        </div>

        <div className="cipher-divider">
          <button
            className="cipher-swap-button"
            onClick={handleSwap}
            data-testid="swap-button"
            aria-label="Texte tauschen"
            title="Texte tauschen"
          >
            ⇄
          </button>
        </div>

        <div className="cipher-panel">
          <div className="cipher-panel-header">
            <span className="cipher-panel-title">Chiffretext</span>
            <span className="char-count" data-testid="ciphertext-char-count">
              {cipherText.length} Zeichen
            </span>
          </div>
          <textarea
            className="cipher-textarea"
            value={cipherText}
            onChange={handleCipherTextChange}
            placeholder="...oder geben Sie verschlüsselten Text ein"
            data-testid="ciphertext-input"
            aria-label="Chiffretext eingeben"
          />
          <button
            className="cipher-button"
            onClick={handleCopyCipherText}
            disabled={!cipherText}
            data-testid="copy-ciphertext-button"
            style={{ marginTop: '0.5rem' }}
          >
            📋 Kopieren
          </button>
        </div>
      </div>

      <div className="cipher-actions">
        <button
          className="cipher-button"
          onClick={handleClear}
          disabled={!plainText && !cipherText}
          data-testid="clear-button"
        >
          🗑️ Löschen
        </button>
      </div>
        </div>
      </div>
    </>
  );
};

export default CipherTranslator;
