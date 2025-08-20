# 📝 Ticket-System (Vue + Express + MongoDB)

Ein kleines Ticket-System mit **Vue 3 (Frontend)**, **Express (Backend)** und **MongoDB**.  
Unterstützt sowohl **lokale Mock-Daten** als auch **echte Datenbank-Anbindung**.

---

## 🚀 Voraussetzungen

- Paketmanager: `npm` oder `yarn`
- [Node.js](https://nodejs.org/) (>= 18 empfohlen)  
- [npm](https://www.npmjs.com/) (kommt mit Node.js mit)  
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (lokal oder via Docker)  

Überprüfen:
```bash
node -v
npm -v
mongod --version

---

## Projektstruktur

project-root/
│── client/          # Vue 3 Frontend
│   ├── src/         
│   └── package.json
│
│── server/          # Express + MongoDB Backend
│   ├── index.js
│   └── package.json
│
└── README.md

## Installation

# Backend
cd server
npm install

# Frontend
cd ../client
npm install

## Features

- Aufgaben erstellen, verschieben und löschen
- Drag-and-Drop zwischen Spalten (`To Do`, `In Progress`, `Done`)
- Offline-Modus mit lokalem `localStorage`
- Optional: Synchronisation mit einer REST-API (Node.js/MongoDB)
- Mobile responsive

---

## Entwicklermodus

cd client
npm run dev

## Production

cd client
npm run build

-> Das optimierte Build landet in client/dist/.

cd ../server
node index.js

Express liefert automatisch die Dateien aus ../client/dist/ aus.

## Datenbank

MongoDB

Standard-Verbindung: mongodb://localhost:27017/ticketdb
Konfiguration: in server/index.js

## Workflow

1. Datenbank starten
2. Änderungen vornehmen (npm run dev)
3. Build erstellen (npm run build)
4. Server starten (node index.js)

## TODO / Erweiterungen

- Benutzer-Authentifizierung
- Kommentare / Subtasks
- Labeling / Prioritäten
- Suche / Filter
- Realtime-Sync mit WebSockets

---

## Projekt lokal starten

```bash
# 1. Projekt klonen
git clone https://github.com/dein-benutzername/mini-ticket.git
cd mini-ticket

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev

