# Dokumentacja API — Ticket System

---

## Informacje ogólne

- **Base URL:** `http://localhost:3000/api` - wszytskie zapytania o zgłoszenia
- **Base URL:** `http://localhost:3000/auth` - autoryzacja użytkownika
- **Format:** JSON
- **Autentykacja:** JWT w HttpOnly cookie (`authToken`)

---

## Autentykacja

### POST `/auth/login`
Logowanie użytkownika.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Zalogowano pomyślnie, ustawia cookie `authToken` |
| 400 | Brakuje wymaganych pól |
| 401 | Nieprawidłowe dane logowania |
| 500 | Błąd serwera |

---

### POST `/auth/register`
Rejestracja nowego użytkownika.

**Body:**
```json
{
  "imie": "string (min. 1 znak)",
  "nazwisko": "string (min. 1 znak)",
  "username": "string (min. 3 znaki)",
  "password": "string (min. 8 znaków)",
  "email": "string (poprawny format email)"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 201 | Pomyślnie stworzono użytkownika |
| 400 | Brakuje wymaganych pól / nieprawidłowy email / za krótki username lub hasło |
| 409 | Użytkownik z takim emailem lub username już istnieje |
| 500 | Błąd serwera |

---

### POST `/auth/logout`
Wylogowanie użytkownika — czyści cookie `authToken`.

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Wylogowano pomyślnie |

---

## Użytkownicy

> Wymagane: zalogowanie (`verifyToken`)
> Oznaczone FOR ADMIN wymagają uprawnień admina (`checkAdmin`)

---

### GET `/auth/users` FOR ADMIN
Pobiera listę wszystkich użytkowników.

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Lista użytkowników (bez haseł) |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak użytkowników w bazie |
| 500 | Błąd serwera |

---

### GET `/auth/users/me`
Pobiera dane zalogowanego użytkownika.

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Dane użytkownika |
| 401 | Brak tokenu |
| 404 | Brak użytkownika |
| 500 | Błąd serwera |

---

### PATCH `/auth/users/me`
Edycja własnych danych. Wszystkie pola opcjonalne — wysyłasz tylko te które chcesz zmienić.

**Body:**
```json
{
  "imie": "string",
  "nazwisko": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Dane zaktualizowane |
| 401 | Brak tokenu |
| 404 | Brak użytkownika |
| 500 | Błąd serwera |

---

### PATCH `/auth/users/me/password`
Zmiana hasła zalogowanego użytkownika.

**Body:**
```json
{
  "password": "string (nowe hasło)"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Hasło zmienione |
| 400 | Brakuje hasła |
| 401 | Brak tokenu |
| 404 | Brak użytkownika |
| 500 | Błąd serwera |

---

### PATCH `/auth/users/:id` FOR ADMIN
Edycja danych dowolnego użytkownika przez admina. Wszystkie pola opcjonalne.

**Params:**
- `id` — ID użytkownika

**Body:**
```json
{
  "imie": "string",
  "nazwisko": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "is_admin": "boolean"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Dane zaktualizowane |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak użytkownika |
| 500 | Błąd serwera |

---

### DELETE `/auth/users/:id` FOR ADMIN
Usuwa użytkownika.

**Params:**
- `id` — ID użytkownika

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Użytkownik usunięty |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak użytkownika |
| 500 | Błąd serwera |

---

## Zgłoszenia (Tickets)

> Oznaczone FOR ADMIN wymagają uprawnień admina

---

### POST `/tickets`
Tworzy nowe zgłoszenie.

**Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 201 | Zgłoszenie utworzone |
| 500 | Błąd serwera |

---

### GET `/tickets` FOR ADMIN
Pobiera listę wszystkich zgłoszeń.

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Lista zgłoszeń |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 500 | Błąd serwera |

---

### GET `/ticketsDetails/:id` FOR ADMIN
Pobiera szczegóły konkretnego zgłoszenia.

**Params:**
- `id` — ID zgłoszenia

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Szczegóły zgłoszenia |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak zgłoszenia |
| 500 | Błąd serwera |

---

### GET `/tickets/:id/status`
Pobiera status zgłoszenia (dostępne dla użytkownika).

**Params:**
- `id` — ID zgłoszenia

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Status zgłoszenia |
| 404 | Brak zgłoszenia |
| 500 | Błąd serwera |

---

### PATCH `/tickets/:id` FOR ADMIN
Edytuje zgłoszenie.

**Params:**
- `id` — ID zgłoszenia

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "status": "string"
}
```

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Zgłoszenie zaktualizowane |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak zgłoszenia |
| 500 | Błąd serwera |

---

### DELETE `/tickets/:id` FOR ADMIN
Usuwa zgłoszenie.

**Params:**
- `id` — ID zgłoszenia

**Odpowiedzi:**
| Status | Opis |
|--------|------|
| 200 | Zgłoszenie usunięte |
| 401 | Brak tokenu |
| 403 | Brak uprawnień |
| 404 | Brak zgłoszenia |
| 500 | Błąd serwera |

---

## Bezpieczeństwo

- Hasła hashowane przez `bcrypt` (salt rounds: 10-12)
- JWT przechowywany w HttpOnly cookie — niedostępny dla JavaScript
- `helmet` — bezpieczne nagłówki HTTP
- Rate limiting na `/auth/login` — max 20 requestów / 15 minut
- Zapytania SQL z placeholderami `?` — ochrona przed SQL injection
- Jednolite komunikaty błędów przy logowaniu — ochrona przed enumeracją użytkowników
