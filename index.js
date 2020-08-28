const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const todo = require('./routes/todo');
const register = require('./routes/register');
const login = require('./routes/login');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

// read the .env file and pass it to process.env as object.
dotenv.config();

// used to serve the static pages present in the folder - public
app.use('/static', express.static('public'));

// middleware to recognize incoming request object as strings or arrays.
// to recognize JSON object, use express.json()
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
// template engine to populate html pages with dynamic content that is served on the go.
app.set('view engine', 'ejs');

// connect with mongodb.
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log(`connected to db`);
    app.listen(2000, () => console.log('Server Up and running'));
});


app.use('/', todo);
app.use('/register', register);
app.get('/login', checkNotAuthenticate, (req, res) => {
    res.render('login.ejs')
});


app.post('/login', checkNotAuthenticate,
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            successRedirect: '/',
            failureFlash: true
        }),
    (req, res) => {
        res.redirect('/')
    })

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkNotAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
