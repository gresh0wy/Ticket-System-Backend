# System Ticketowy

**Wewnętrzny system zgłaszania problemów technicznych i utrzymaniowych** dla szpitali i placówek medycznych.

System umożliwia pracownikom szybkie i uporządkowane zgłaszanie awarii oraz usterek z różnych obszarów działalności placówki.

## O projekcie

Ticket-System to prosty, wewnętrzny system ticketowy stworzony z myślą o placówkach medycznych. Umożliwia zgłaszanie problemów z zakresu:

- Informatyki (IT)
- Aparatury medycznej
- Instalacji elektrycznych i technicznych
- Utrzymania budynku
- Cyberbezpieczeństwa
- Innych kategorii

Każde zgłoszenie pozwala na określenie:
- Miejsca zdarzenia
- Działu docelowego
- Priorytetu
- Informacji o powtarzalności problemu

---

## Roadmap (Plan rozwoju)

### Etap 0 – Struktura projektu
- Uporządkowanie struktury plików w folderze `app`

### Etap 1 – Podstawowy backend
- Utworzenie backendu z autoryzacją i podstawowymi endpointami zgłoszeń
- System logowania użytkowników
- Dokumentacja API

### Etap 2 – Komunikacja frontend–backend
- Integracja formularza zgłoszeniowego z API
- Wysyłanie ticketów z frontendu

### Etap 3
N/D

### Przyszłe funkcjonalności
N/D

---

## Technologie

### Frontend
- React
- HTML / CSS / JavaScript

### Backend
- Node.js
- Express

### Baza danych
- MariaDB

---

## Wymagania

- Node.js
- MariaDB
- Git

---

## Uruchomienie projektu lokalnie

### 1. Sklonowanie repozytorium

```bash
- git init
- git commit -m "commit"
- git branch -M main
- git remote add origin https://github.com/gresh0wy/Ticket-System-Backend.git
- git push -u origin main

```
### 2. Syworzenie pliku .env
- MARIADB_ROOT_PASSWORD="pass"
- MARIADB_DATABASE_NAME="dbName"
- MARIADB_USER="username"
- MARIADB_HOST="localhost"
- MARIADB_PORT=port
- JWT_SECRET=secret

### 3. instrukcje uruchomienia serwera (do uzupełnienia) 

- cd Ticket-System-Backend
- npm run dev

Uruchamianie serwera Feontendu 
- cd Ticket-System-Frontend
- npm run dev