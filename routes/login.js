const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})


passport.use(new LocalStrategy({ usernameField: 'emailId' }, (emailId, password, done) => {
    User.findOne({ emailId: emailId })
        .then(user => {
            if (!user)
                return done(null, false, { message: `User not found with this email` })
            else {
                try {
                    if (bcrypt.compare(password, user.password)) {
                        return done(null, user)
                    }
                    else {
                        return done(null, false, { message: `Incorrect password` })
                    }

                } catch (e) {
                    return done(null, false, { message: e })
                }
            }
        }).catch(err => {
            return done(null, false, { message: err })
        })
}))

module.exports = passport;