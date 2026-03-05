# Testplan — LumaSpace

## Tool-Matrix

| Ebene              | Tool                                                  | Konfiguration          |
| ------------------ | ----------------------------------------------------- | ---------------------- |
| Unit / Integration | [Vitest](https://vitest.dev/)                         | `vitest.config.ts`     |
| Komponenten (UI)   | [React Testing Library](https://testing-library.com/) | (gleiche Konfig)       |
| E2E / Abnahme      | [Playwright](https://playwright.dev/)                 | `playwright.config.ts` |

---

## Muss-Kriterien (M)

### M1 — Produkte können online angezeigt werden

| ID   | Kriterium (aus Lastenheft)                  | Testtyp | Datei                  |
| ---- | ------------------------------------------- | ------- | ---------------------- |
| M1-a | Nutzer können die Produktübersicht aufrufen | E2E     | `e2e/products.spec.ts` |
| M1-b | Produktdetails sind einsehbar               | E2E     | `e2e/products.spec.ts` |

### M2 — Warenkorb-Funktionalität

| ID   | Kriterium (aus Lastenheft)                       | Testtyp    | Datei                                        |
| ---- | ------------------------------------------------ | ---------- | -------------------------------------------- |
| M2-a | Produkte können in den Warenkorb gelegt werden   | E2E        | `e2e/cart.spec.ts`                           |
| M2-a | Menge kann angepasst werden                      | E2E        | `e2e/cart.spec.ts`                           |
| M2-a | Produkte können entfernt werden                  | E2E        | `e2e/cart.spec.ts`                           |
| M2-b | Gesamtsumme wird korrekt berechnet und angezeigt | Komponente | `__tests__/components/cart-summary.test.tsx` |

### M3 — Bestellung abschließen

| ID   | Kriterium (aus Lastenheft)                                | Testtyp     | Datei                            |
| ---- | --------------------------------------------------------- | ----------- | -------------------------------- |
| M3-a | Bestellung kann mit gültigen Kundendaten ausgelöst werden | E2E         | `e2e/checkout.spec.ts`           |
| M3-b | Bestellung wird in der Datenbank gespeichert              | Integration | `__tests__/api/checkout.test.ts` |
| M3-c | Nach erfolgreichem Zahlen wird eine Bestätigung angezeigt | E2E         | `e2e/checkout.spec.ts`           |

### M4 — Registrierung und Login

| ID   | Kriterium (aus Lastenheft)            | Testtyp | Datei              |
| ---- | ------------------------------------- | ------- | ------------------ |
| M4-a | Neuer Benutzer kann sich registrieren | E2E     | `e2e/auth.spec.ts` |
| M4-b | Login auf Admin-Konto möglich         | E2E     | `e2e/auth.spec.ts` |
| M4-b | Login auf Kundenkonto möglich         | E2E     | `e2e/auth.spec.ts` |

### M5 — Admin-Übersicht

| ID   | Kriterium (aus Lastenheft)                                                      | Testtyp | Datei               |
| ---- | ------------------------------------------------------------------------------- | ------- | ------------------- |
| M5-a | Admin-Funktionen sind für Admin-Accounts verfügbar                              | E2E     | `e2e/admin.spec.ts` |
| M5-b | Normale Kundenkonten können nicht auf Admin-Seiten zugreifen (→ 403 / Redirect) | E2E     | `e2e/admin.spec.ts` |

---

## Kann-Kriterien (K)

### K1 — Such- und Filterfunktion

| ID   | Kriterium (aus Lastenheft)         | Testtyp     | Datei                            |
| ---- | ---------------------------------- | ----------- | -------------------------------- |
| K1-a | Produkte nach Namen filtern/suchen | E2E         | `e2e/search.spec.ts`             |
| K1-b | Produkte nach Preis filtern        | E2E         | `e2e/search.spec.ts`             |
| K1-c | Produkte nach Kategorie filtern    | Integration | `__tests__/lib/products.test.ts` |

### K2 — Produktvarianten

| ID   | Kriterium (aus Lastenheft)                                    | Testtyp    | Datei                                            |
| ---- | ------------------------------------------------------------- | ---------- | ------------------------------------------------ |
| K2-a | Produkt kann Varianten (Farbe, Größe …) besitzen              | Komponente | `__tests__/components/variant-selector.test.tsx` |
| K2-b | Ausgewählte Variante wird korrekt in den Warenkorb übernommen | E2E        | `e2e/cart.spec.ts`                               |

### K3 — Erweiterte Bestellstatus

| ID   | Kriterium (aus Lastenheft)                                                | Testtyp     | Datei                          |
| ---- | ------------------------------------------------------------------------- | ----------- | ------------------------------ |
| K3-a | Admin kann Bestellstatus setzen (z. B. „in Bearbeitung", „abgeschlossen") | Integration | `__tests__/api/orders.test.ts` |
| K3-b | Bestellhistorie ist auf dem Kundenkonto gespeichert und einsehbar         | E2E         | `e2e/orders.spec.ts`           |

### K4 — Erweiterte Optik

| ID   | Kriterium (aus Lastenheft) | Testtyp           | Anmerkung                               |
| ---- | -------------------------- | ----------------- | --------------------------------------- |
| K4-a | Dark Mode                  | Visuell / manuell | Playwright `prefers-color-scheme: dark` |
| K4-b | Animationen                | Manuell           | Smoke-Test: keine Layout-Sprünge        |
| K4-c | Aufwendiges Design         | Manuell           | Design-Review / Screenshot-Vergleich    |

---

## Tests lokal ausführen

```bash
# Unit + Integration
npm run test          # Vitest im Watch-Mode
npm run test:run      # Vitest einmalig (CI)

# E2E
npx playwright install   # einmalig
npm run test:e2e         # Playwright

# Qualitäts-Gates
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run format:check     # Prettier-Prüfung
```
