require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const port = 3000

// parser
const cookieParser = require('cookie-parser')

// bezpieczenstwo
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Za dużo zapytań, spróbuj później' }
})
app.use('/auth/login', limiter)



app.use(express.static('public'))
app.use(helmet());

// Middleware do parsowania formularzy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

// routes
app.use(require('./routes/mainRoutes'))

//api

app.use('/api', require('./routes/api/ticketsRoutes'))
app.use('/auth', require('./routes/api/authRoutes'))

//errory
app.use(require('./routes/errorRoutes'))


app.listen(port, () => {
    console.log(`serwer słucha na porcie: ${port}`);
})
