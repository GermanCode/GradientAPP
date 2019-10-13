const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local.signup', new LocalStrategy({
    usernameField: 'id_Persona',
    passwordField: 'apellidos',
    passReqToCallback: true
}, async (req, id_Persona, apellidos, done) =>{
    
    const { nombres } = req.body;
    const { curso } = req.body;
    const newUser = {

        id_Persona,
        nombres,
        apellidos,
        curso
    }

 }));

 //passport.serializeUser((usr, done)=>{

 //});