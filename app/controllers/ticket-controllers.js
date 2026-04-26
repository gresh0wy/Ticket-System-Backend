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
            const { id } = req.params
            const [row] = await pool.query(
                'SELECT * FROM tickets WHERE id = ?',
                [id]
            )
            if (row.length === 0) {
                return res.status(404).json({ message: `Zgłoszenie o numerze id: ${id} nie istnieje` })
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

        const ticketData = [];
        const fieldsToUpdate = [];

        if (dzial_docelowy !== undefined) {
            fieldsToUpdate.push('dzial_docelowy = ?');
            ticketData.push(dzial_docelowy);
        }

        if (kategoria_zgloszenia !== undefined) {
            fieldsToUpdate.push('kategoria_zgloszenia = ?');
            ticketData.push(kategoria_zgloszenia);
        }

        if (priorytet_zgloszenia !== undefined) {
            fieldsToUpdate.push('priorytet_zgloszenia = ?');
            ticketData.push(priorytet_zgloszenia);
        }

        if (status_zgloszenia !== undefined) {
            fieldsToUpdate.push('status_zgloszenia = ?');
            ticketData.push(status_zgloszenia);
        }

        if (przypisane_do !== undefined) {
            fieldsToUpdate.push('przypisane_do = ?');
            ticketData.push(przypisane_do);
        }

        if (komentarz !== undefined) {
            fieldsToUpdate.push('komentarz = ?');
            ticketData.push(komentarz);
        }

        try {
            const ticketId = req.params.id;

            const query = `UPDATE tickets SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
            ticketData.push(ticketId);

            await pool.query(query, ticketData);

            res.status(200).json({ message: 'Pomyślnie dokonano zmian' });
        } catch (err) {
            console.error(`Błąd podczas edycji: ${err}`);
            res.status(500).json({ err: 'Błąd serwera' });
        }
    }

    statusTickets = async (req, res) => {
        const { id } = req.params


        try {
            const [row] = await pool.query(
                'SELECT id , imie_nazwisko , numer_wewnetrzny , miejsce_zdarzenia, dzial_docelowy , kategoria_zgloszenia , temat_zgloszenia, opis_zgloszenia , priorytet_zgloszenia , powtarzalnosc, status_zgloszenia , data_utworzenia , przypisane_do  FROM tickets WHERE id = ?',
                [id]
            )
            //  const [row] = await pool.query(
            //     'SELECT id AS `numer zgłoszenia`, imie_nazwisko AS `Imię i Nazwisko`, numer_wewnetrzny AS `Numer Wewnętrzny`, miejsce_zdarzenia AS `Miejsce Zdarzenia`, dzial_docelowy AS `Przypisane do działu`, kategoria_zgloszenia AS `Kategoria`, temat_zgloszenia AS `Temat`, opis_zgloszenia AS `Opis`, priorytet_zgloszenia AS `Priorytet`, powtarzalnosc AS `Powtarzalnosc`, status_zgloszenia AS `Status` , data_utworzenia AS `Data utworzenia`, przypisane_do AS `Do zgłoszenia został przypisany` FROM tickets WHERE id = ?',
            //     [id]
            // )
            if (row.length === 0) {
                return res.status(404).json({ message: `Zgłoszenie o numerze id: ${id} nie istnieje` })
            }


            res.status(200).json(row[0])

        } catch (error) {
            res.status(500).json({ message: 'błąd serwera' })
        }
    }

}

module.exports = new ticketControllers()

