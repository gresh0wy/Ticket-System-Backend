class ErrorControllers {
    notFound(req, res) {
        return res.status(404).json({ message: 'Strona nie istnieje' })

    }

    forbidden(req, res) {
        res.status(403).json({ message: 'brak uprawnień' })
    }
}

module.exports = new ErrorControllers()