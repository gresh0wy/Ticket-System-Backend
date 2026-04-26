require('dotenv').config();
const pool = require('../database/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class authController {
    login = async (req, res) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Brakuje wymaganych pól' })
        }

        // token JWT_SECRET
        try {
            const [row] = await pool.query(
                'SELECT * FROM users WHERE username = ?',
                [username])

            if (row.length === 0) {
                return res.status(401).json({ error: 'Nieprawidłowe dane logowania' })
            }

            const user = row[0] //przypisujemy do usera obiekt użytkownika
            const isMatch = await bcrypt.compare(password, user.password) //sprawdzenie czy hasło się zgadza

            const token = jwt.sign({ id: user.id, firstNane: user.imie, lastName: user.nazwisko, admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '20m' })
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 12000 * (60 * 60)
            });

            if (isMatch) {
                return res.status(200).json({ message: 'pomyślnie zalogowano' })
            } else {
                return res.status(401).json({ error: 'nieprawidłowe dane logowania' })
            }

        } catch (error) {
            res.status(500).json({ error: 'Błąd serwera' })
        }


    }

    register = async (req, res) => {
        const { imie, nazwisko, username, password, email } = req.body
        if (!imie || !nazwisko || !username || !password || !email) {
            return res.status(400).json({ error: 'Brakuje wymaganych pól' })
        }
        //usuwanie białych znaków
        const firstName = imie.trim()
        const lastName = nazwisko.trim()
        const newUsername = username.trim()
        const newEmail = email.trim()


        // weryfikacja poprawności email
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Nieprawidłowy email' })
        }


        // walidacja  długośści znaków
        if (newUsername.length < 3) {
            return res.status(400).json({ error: 'Minimalna liczba znaków dla username to 3' })
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Minimalna liczba znaków dla hasła to 8' })
        }




        // wysyłanie zapytania
        try {
            // haszowanie
            const hashPass = await bcrypt.hash(password, 10)
            const [row] = await pool.query(
                'INSERT INTO users (imie, nazwisko, username, password, email) VALUES (?,?,?,?,?)',
                [firstName, lastName, newUsername, hashPass, newEmail]
            )
            res.status(201).json({ message: "pomyślnie stworzono użytkownika" })
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Użytkownik z takim emailem lub username już istnieje' })
            }
            res.status(500).json({ error: 'Błąd serwera' })
        }
    }

    logout = async (req, res) => {

        try {
            res.clearCookie('authToken', {
                httpOnly: true
            })
            return res.status(200).json({ message: 'wylogowano pomyślnie' })
        } catch (error) {
            res.status(500).json({ error: 'błąd serwera' })
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        const { imie, nazwisko, username, password, email, is_admin } = req.body
        const fields = []
        const value = []



        try {


            if (imie != undefined) { value.push(imie) && fields.push('imie = ?') }
            if (nazwisko != undefined) { value.push(nazwisko) && fields.push('nazwisko = ?') }
            if (username != undefined) { value.push(username) && fields.push('username = ?') }
            if (password != undefined) {
                value.push(value.password = await bcrypt.hash(password, 12)
                ) && fields.push('password = ?')
            }
            if (email != undefined) { value.push(email) && fields.push('email = ?') }
            if (is_admin != undefined) { value.push(is_admin) && fields.push('is_admin = ?') }





            const [row] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [id]
            )
            if (row.length === 0) {
                return res.status(404).json({ message: 'brak uzytkonika o podanym id' })
            }



            const [edit] = await pool.query(
                `UPDATE users SET ${fields} WHERE id = ?`,
                value.concat(id)
            )

            res.status(200).json(edit)
        } catch (error) {
            res.status(500).json({ message: `błąd serwera: ${error}` })
        }
    }

    delete = async (req, res) => {
        const { id } = req.params
        const [checkUsers] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        )
        if (checkUsers.length === 0) {
            return res.status(404).json({ message: 'uzytkonik nie istnieje' })
        }
        try {


            const [row] = await pool.query(
                'DELETE FROM users WHERE id = ?',
                [id]
            )
            res.status(200).json(row)
        } catch (error) {
            res.status(500).json({ message: 'błąd serwera' })
        }

    }

    editMe = async (req, res) => {
        const { id } = req.user
        const { imie, nazwisko, username, password, email } = req.body
        let fields = []
        let value = []

        const [findUsers] = await pool.query(
            'SELECT * FROM users WHERE  id = ?',
            [id]
        )
        if (findUsers.length === 0) {
            return res.status(404).json({ message: 'uytkownik nie istnieje' })
        }

        try {
            if (imie != undefined) { value.push(imie) && fields.push('imie = ?') }
            if (nazwisko != undefined) { value.push(nazwisko) && fields.push('nazwisko = ?') }
            if (username != undefined) { value.push(username) && fields.push('username = ?') }
            if (password != undefined) { value.push(await bcrypt.hash(password, 10)) && fields.push('password = ?') }
            if (email != undefined) { value.push(email) && fields.push('email = ?') }

            const [row] = await pool.query(
                `UPDATE users SET ${fields} WHERE id = ?`,
                value.concat(id)
            )

            res.status(200).json(row)
        } catch (error) {
            res.status(500).json({ message: `błąd serwera: ${error}` })
        }
    }

    changeMyPassword = async (req, res) => {
        const { id } = req.user
        const { password } = req.body
        if (!password) {
            return res.status(401).json({ message: "wypełnij wszytskie pola" })
        }
        try {
            const findUsers = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [id]
            )
            if (findUsers.length === 0) {
                return res.status(404).json({ message: "brak uytkownika" })
            }

            const hashPass = await bcrypt.hash(password, 10)
            const [row] = await pool.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashPass, id]
            )
            res.status(200).json(row)
        } catch (error) {
            res.status(500).json({ message: `błąd serwera: ${error}` })
        }
    }

    getUsers = async (req, res) => {

        try {
            const [findUsers] = await pool.query(
                'SELECT id, imie, nazwisko, username, email FROM users'
            )
            if (findUsers.length === 0) {
                return res.status(404).json({ message: 'brak uytwkoników w bazie' })
            }

            res.status(200).json(findUsers)
        } catch (error) {
            res.json(500).json({ message: `bład serwera: ${error}` })
        }
    }

    getMe = async (req, res) => {
        const { id } = req.user

        const [findMe] = await pool.query(
            'SELECT imie, nazwisko, username, email FROM users WHERE id = ?',
            [id]
        )
        if (id.length === 0) {
            return res.status(404).json({ message: 'podany uzytkownik nie istnieje' })
        }
        try {
            res.status(200).json(findMe)
        } catch (error) {
            res.status(500).json({ error: `błąd serwera: ${error}` })
        }
    }
}


module.exports = new authController()