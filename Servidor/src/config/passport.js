const passport = require('passport');
const user = require('../models/User.js');
const localStra = require('passport-local').Strategy;
let googleStra = require('passport-google-oauth20').Strategy;

passport.use(new localStra({
    usernameField: 'usuario',
    passwordField: 'password'
}, async (usuario, passowrd, done) => {
    await user.findOne({usuario})
    if(!user) {
        return done (null, false, {msg: 'No se encontro usuario registrado'})
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    user.findById(id)
    .then(user => {
        done(null, user)
    })
    .catch(err => {
        done(err, null)
    })
})