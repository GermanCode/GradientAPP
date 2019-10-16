const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');



passport.use('local.signin', new LocalStrategy({
    usernameField: 'id_Persona',
    passwordField: 'apellido',
    passReqToCallback: true
}, async (req, id_Persona, apellido, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM persona WHERE id_Persona = ?', [id_Persona]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.mathPassword(apellido, user.apellido);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome' + user.nombre));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else {
            return done(null, false, req.flash('message', 'User don´t finded'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'id_Persona',
    passwordField: 'apellido',
    passReqToCallback: true
}, async (req, id_Persona, apellido, done) => {
    console.log(req.body);
    const { nombre } = req.body;
    const { telefono } = req.body;
    const newUser = {
        id_Persona,
        nombre,
        apellido,
        telefono
    };
    newUser.apellido = await helpers.encryptPassword(apellido);
    const result = await pool.query('INSERT INTO persona SET ?', [newUser]);
    //newUser.id = result.insertId;
    //console.log(result);
    return done(null, newUser);
}));

  passport.serializeUser((user, done) => {
       done(null, user.id_Persona);
  });

 passport.deserializeUser( async (id_Persona, done) => {
    const rows = await pool.query('SELECT * FROM persona WHERE id_Persona = ?', [id_Persona]);
    done(null, rows[0]);
 });