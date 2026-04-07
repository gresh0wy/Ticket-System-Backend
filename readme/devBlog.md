# DevBlog #1 — Backend Ticket System (Update 01.04.2026)



## Stack
Node.js, Express, MySQL2, bcrypt, jsonwebtoken, helmet, express-rate-limit


## Autentykacja

Zaimplementowano pełny system rejestracji i logowania. Hasła są hashowane przez `bcrypt` przed zapisem do bazy. Po zalogowaniu generowany jest token JWT który trafia do **HttpOnly cookie** — dzięki temu JavaScript po stronie klienta nie ma do niego dostępu, co chroni przed atakami XSS.

Logout czyści cookie po stronie serwera.



## Middleware

Stworzono dwa middleware:

`verifyToken` — weryfikuje JWT z cookie, dekoduje dane i dokłada je do `req.user`. Każdy chroniony endpoint przechodzi przez ten middleware.

`checkAdmin` — sprawdza `req.user.is_admin`. Używany zawsze po `verifyToken`.

Kombinacja `isAdmin` grupuje oba i stosowana jest na trasach administracyjnych.



## Endpointy

**Auth**
- `POST /login` `POST /register` `POST /logout`
- `GET /users` — lista userów (admin)
- `GET /users/me` — własny profil
- `PATCH /users/me` — edycja własnych danych
- `PATCH /users/me/password` — zmiana hasła
- `PATCH /users/:id` — edycja użytkownika (admin)
- `DELETE /users/:id` — usuwanie użytkownika (admin)

**Tickets**
- `POST /tickets` — tworzenie zgłoszenia
- `GET /tickets` — wszystkie zgłoszenia (admin)
- `GET /tickets/:id/status` — status własnego zgłoszenia
- `GET /ticketsDetails/:id` — szczegóły zgłoszenia (admin)
- `PATCH /tickets/:id` — edycja zgłoszenia (admin)
- `DELETE /tickets/:id` — usuwanie zgłoszenia (admin)



## Bezpieczeństwo

`helmet` ustawia bezpieczne nagłówki HTTP. 
`Rate limiting` na `/auth/login` blokuje brute force — maksymalnie 20 requestów na 15 minut. Dynamiczne zapytania SQL z placeholderami `?` chronią przed SQL injection.




# DevBlog #2 — FIX (Update 07.04.2026)

- Redukcja niepotrzebnego kodu w auth-middleware oraz doprecyzowanie kodów będów.
- Token JWT przechowuje dodadkowo dwa parametry: imie oraz nazwisko.
- Rozpoczącie prac nad stworzeniem dokumentacji do API.
- Przygowotanie wstępnego środowiska dla frontendu (React + TS).