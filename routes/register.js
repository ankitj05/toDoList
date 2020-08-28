var express = require('express');
var router = express.Router();
const User = require('../models/User');
var bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', checkNotAuthenticate, (req, res, next) => {
    // res.send('respond with a resource');
    res.render('register.ejs')
});


router.post('/', checkNotAuthenticate, (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.json({
                message: `There was an error: ${err}`
            })
        }

        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: hash
        })

        user.save().then(user => {
            // res.json({
            //     message: `User added successfully ${user}`
            // });
            res.redirect('/login');
        })
            .catch(err => {
                res.json({
                    message: `There was an error: ${err}`
                })
            })
    })
})

function checkNotAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


module.exports = router;
