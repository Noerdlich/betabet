# Betabet Cipher

Eine moderne Web-Anwendung zur Ver- und Entschlüsselung von Texten mittels Substitutionschiffre. Die Anwendung bietet eine intuitive Benutzeroberfläche ähnlich wie Google Translate oder DeepL.

🔗 **Live Demo**: [https://noerdlich.github.io/betabet](https://noerdlich.github.io/betabet)

## Features

✨ **Bidirektionale Ver-/Entschlüsselung**
- Echtzeit-Verschlüsselung beim Tippen
- Echtzeit-Entschlüsselung beim Tippen
- Texte können in beide Richtungen konvertiert werden

🔤 **Deutsches Alphabet**
- Unterstützung für A-Z (Groß- und Kleinbuchstaben)
- Umlaute: Ä, Ö, Ü, ß
- Sonderzeichen, Zahlen und Leerzeichen bleiben erhalten

🎨 **Modernes UI/UX**
- Responsives Design für Desktop und Mobile
- Intuitive Bedienung mit Zwei-Feld-Layout
- Swap-Funktion zum Tauschen der Texte
- Copy-to-Clipboard Funktionalität
- Zeichenzähler für beide Felder

## Technologie-Stack

- **Frontend**: React 19.2 + TypeScript
- **Styling**: CSS3 mit Responsive Design
- **Testing**: 
  - Jest für Unit-Tests
  - React Testing Library für Komponenten-Tests
  - Playwright für E2E-Tests
- **Deployment**: GitHub Pages
- **Build Tool**: Create React App

## Installation

```bash
# Repository klonen
git clone https://github.com/Noerdlich/betabet.git
cd betabet

# Dependencies installieren
npm install

# Development Server starten
npm start
```

Die Anwendung läuft dann unter `http://localhost:3000`

## Verfügbare Scripts

```bash
# Development Server
npm start

# Production Build
npm run build

# Unit Tests ausführen
npm test

# E2E Tests ausführen
npm run test:e2e

# E2E Tests mit UI ausführen
npm run test:e2e:ui

# Auf GitHub Pages deployen
npm run deploy
```

## Verschlüsselungs-Mapping

Die Anwendung verwendet ein konfigurierbares Substitutions-Alphabet. Das Standard-Mapping ist in `src/utils/cipher.ts` definiert und kann nach Belieben angepasst werden:

```typescript
export const DEFAULT_CIPHER_MAPPING: CipherMapping = {
  'A': 'Q',
  'B': 'W',
  'C': 'E',
  // ... weitere Mappings
  'Ä': 'Ü',
  'Ö': 'Ä',
  'Ü': 'Ö',
  'ß': 'ẞ',
};
```

## Projektstruktur

```
betabet/
├── public/              # Statische Dateien
├── src/
│   ├── components/      # React Komponenten
│   │   ├── CipherTranslator.tsx
│   │   ├── CipherTranslator.css
│   │   └── CipherTranslator.test.tsx
│   ├── utils/           # Helper-Funktionen
│   │   ├── cipher.ts
│   │   └── cipher.test.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── e2e/                 # E2E Tests
│   └── cipher.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Testing

### Unit Tests

```bash
npm test
```

Die Unit-Tests decken ab:
- Verschlüsselungslogik
- Entschlüsselungslogik
- Mapping-Validierung
- Komponenten-Verhalten
- User-Interaktionen

### E2E Tests

```bash
# Alle Browser
npm run test:e2e

# Mit UI
npm run test:e2e:ui

# Mit sichtbarem Browser
npm run test:e2e:headed
```

Die E2E-Tests decken ab:
- Vollständige User-Journeys
- Bidirektionale Ver-/Entschlüsselung
- Responsive Design
- Accessibility
- Copy-to-Clipboard Funktionalität
- Cross-Browser-Kompatibilität

## Deployment auf GitHub Pages

Das Projekt ist für automatisches Deployment auf GitHub Pages konfiguriert:

1. **Manuelles Deployment**:
   ```bash
   npm run deploy
   ```

2. **Automatisches Deployment**: 
   - Push auf den `main` Branch triggert automatisch ein Deployment via GitHub Actions

## Cipher-Mapping anpassen

Um das Verschlüsselungs-Alphabet anzupassen:

1. Öffne `src/utils/cipher.ts`
2. Bearbeite das `DEFAULT_CIPHER_MAPPING` Objekt
3. Stelle sicher, dass jeder Buchstabe genau einem anderen zugeordnet ist (bijektive Abbildung)
4. Teste die Änderungen: `npm test`

## Beispiele

**Eingabe (Klartext)**: `Hallo Welt!`  
**Ausgabe (Chiffre)**: `Isssg Vtsy!`

**Eingabe (Klartext)**: `Das ist ein Test mit Ümlauten: ÄÖÜ`  
**Ausgabe (Chiffre)**: `Rql oly tof Ytly doy Ödsuxtf: ÜÄÖ`

## Browser-Unterstützung

- Chrome/Edge (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Lizenz

MIT License

## Autor

**Noerdlich**
- GitHub: [@Noerdlich](https://github.com/Noerdlich)
- Repository: [betabet](https://github.com/Noerdlich/betabet)

## Mitwirken

Contributions sind willkommen! Bitte erstelle ein Issue oder Pull Request.

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## Bekannte Einschränkungen

- Aktuell nur deutsche Umlaute unterstützt
- Clipboard API benötigt HTTPS (funktioniert in localhost und GitHub Pages)
- ß wird als ẞ verschlüsselt (großes Eszett)

## Roadmap

- [ ] Mehrere Cipher-Profile zur Auswahl
- [ ] Import/Export von benutzerdefinierten Mappings
- [ ] Unterstützung für weitere Alphabete
- [ ] Dark Mode
- [ ] Verschlüsselungs-Historie
- [ ] Teilen-Funktion für verschlüsselte Texte
