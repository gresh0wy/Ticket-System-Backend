const pool = require('../database/dbConfig');

class ticketControllers {
    createTickets = async (req, res) => {
        const {
            imie_nazwisko,
            numer_wewnetrzny,
            miejsce_zdarzenia,
            dzial_docelowy,
            kategoria_zgloszenia,
            temat_zgloszenia,
            opis_zgloszenia,
            priorytet_zgloszenia,
            powtarzalnosc
        } = req.body;

        if (!imie_nazwisko || !numer_wewnetrzny || !miejsce_zdarzenia || !dzial_docelowy || !temat_zgloszenia || !opis_zgloszenia) {
            return res.status(400).json({
                error: "Brakuje wymaganych pól"
            })
        }

        try {
            const [row] = await pool.query(
                'INSERT INTO tickets (imie_nazwisko, numer_wewnetrzny, miejsce_zdarzenia,dzial_docelowy, kategoria_zgloszenia, temat_zgloszenia,opis_zgloszenia, priorytet_zgloszenia, powtarzalnosc,utworzone_przez) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [imie_nazwisko, numer_wewnetrzny, miejsce_zdarzenia, dzial_docelowy, kategoria_zgloszenia, temat_zgloszenia, opis_zgloszenia, priorytet_zgloszenia, powtarzalnosc, imie_nazwisko])

            res.status(201).json({
                message: "Zgłoszenie zostało utworzone",
                ticketId: Number(row.insertId)
            })
        } catch (err) {
            console.error('Błąd zapytania SQL:', err);
            res.status(500).json({ err: 'Błąd serwera' })

        }
    }

    showAllTickets = async (req, res) => {
        try {
            const [row] = await pool.query(
                'select * from tickets'
            )

            res.status(200).json(row)
        } catch (err) {
            console.error(`Błąd przy pobieraniu SQL: ${err}`)
            res.status(500).json({ err: `Błąd serwera` })
        }
    }
    
    showTickets = async (req, res) => {
        try {
            const ticketId = req.params.id
            const [row] = await pool.query(
                'SELECT * FROM tickets WHERE id = ?',
                [ticketId]
            )
            if (row.length === 0) {
                return res.status(404).json({ error: 'Zgłoszenie nie istnieje' })
            }
            res.status(200).json(row[0])
        } catch (err) {
            console.error(`Błąd przy pobieraniu zgłoszenia: ${err}`)
            res.status(500).json({ err: 'Błąd serwera' })
        }
    }

    deleteTickets = async (req, res) => {
        try {
            const ticketId = req.params.id
            const [row] = await pool.query(
                'DELETE FROM tickets WHERE id = ?', [ticketId]
            )
            if (row.affectedRows === 0) {
                return res.status(404).json({ error: `Zgłoszenie które chcesz usunąć nie istnieje` })
            }
            res.status(200).json({ message: 'Zgłoszenie zostało usunięte' })
        } catch (err) {
            console.error(`Błąd podczas usuwania: ${err}`)
            res.status(500).json({ err: 'Błąd serwera' })
        }
    }

    editTickets = async (req, res) => {
        const {
            dzial_docelowy,
            kategoria_zgloszenia,
            priorytet_zgloszenia,
            status_zgloszenia,
            przypisane_do,
            komentarz

        } = req.body;

        try {
            const ticketId = req.params.id

            const [row] = await pool.query(
                'UPDATE tickets SET dzial_docelowy = ?,  kategoria_zgloszenia = ?, priorytet_zgloszenia = ?, status_zgloszenia = ?,  przypisane_do  = ?,komentarz  = ? WHERE id = ?',
                [dzial_docelowy, kategoria_zgloszenia, priorytet_zgloszenia, status_zgloszenia, przypisane_do, komentarz, ticketId]
            )
            res.status(200).json({ message: 'Pomyślnie dokonano zmian' })
        } catch (err) {
            console.error(`Błąd podczas edycji: ${err}`)
            res.status(500).json({ err: 'Błąd serwera' })
        }
    }

    statusTickets = async (req, res) => {
        const { id } = req.params
        console.log(id);

        try {
            const [row] = await pool.query(
                'SELECT id AS `numer zgłoszenia`, imie_nazwisko AS `Imię i Nazwisko`, numer_wewnetrzny AS `Numer Wewnętrzny`, miejsce_zdarzenia AS `Miejsce Zdarzenia`, dzial_docelowy AS `Przypisane do działu`, kategoria_zgloszenia AS `Kategoria`, temat_zgloszenia AS `Temat`, opis_zgloszenia AS `Opis`, priorytet_zgloszenia AS `Priorytet`, powtarzalnosc AS `Powtarzalnosc`, status_zgloszenia AS `Status` , data_utworzenia AS `Data utworzenia`, przypisane_do AS `Do zgłoszenia został przypisany` FROM tickets WHERE id = ?',
                [id]
            )
            if (row.length === 0) {
                return res.status(404).json({ message: `Zgłoszenie o numerze id: ${id} nie istnieje` })
            }

            return res.status(200).json(row)

        } catch (error) {
            res.status(500).json({ message: 'błąd serwera' })
        }
    }

}

module.exports = new ticketControllers()

