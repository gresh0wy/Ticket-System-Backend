class GlobalConroler {
    showHome(req, res) {

        res.status(200).json({ message: 'strona główna' })
    }
    showLogin(req, res) {
        res.render('pages/loginPage',
            {
                title: 'Strona logowania'
            }
        )
    }


}

module.exports = new GlobalConroler()