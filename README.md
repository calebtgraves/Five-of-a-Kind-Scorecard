# Five-of-a-Kind Scorecard

A digital scorecard for the classic dice game Five-of-a-Kind (Yahtzee). Track scores for multiple players across all 13 categories with automatic total calculations, bonuses, and more.

Built with Preact, TypeScript, and Tailwind CSS. Available as a web app, installable PWA, and will soon be available on the google play store.

The Web app can be found [here](https://calebtgraves.github.io/Five-of-a-Kind-Scorecard/)

## Features

- **1-100 players** with named scorecards
- **13 scoring categories** — upper section (Ones through Sixes) and lower section (3-of-a-Kind, 4-of-a-Kind, Full House, Small Straight, Large Straight, Five-of-a-Kind, Chance)
- **Auto-calculated totals** including upper section bonus (+35 if subtotal >= 63) and multiple Five-of-a-Kind bonuses (+100 each)
- **Undo** — reverse the last score entry
- **6 themes** — 3 dark and 3 light options
- **Offline support** — works without an internet connection as a PWA
- **Multiple platforms** — web and (soon) Android

## Tech Stack

- [Preact](https://preactjs.com/) — UI framework
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vite](https://vite.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Capacitor](https://capacitorjs.com/) — native mobile builds
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — PWA support
