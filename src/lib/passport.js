const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'id_Persona',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, id_Persona, password, done) => {
    const rows = await pool.query('SELECT * FROM persona inner join roles_persona on fk_Persona_Rol = id_Persona  where id_Persona = ?', [id_Persona]);
    console.log(rows);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.mathPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome ' + user.nombre + user.fk_Rol_Persona));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else {
            return done(null, false, req.flash('message', 'User don´t finded'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'id_Persona',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, id_Persona, password, done) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { telefono } = req.body;
    const { curso } = req.body;
    const { fk_Rol_Persona } = req.body;
    const newUser = {
        id_Persona,
        nombre,
        apellido,
        telefono,
        curso,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO persona SET ?', [newUser]);
    
    return done(null, newUser);
}));

  passport.serializeUser((user, done) => {
       done(null, user.id_Persona);
  });

 passport.deserializeUser( async (id_Persona, done) => {
    const rows = await pool.query('SELECT * FROM persona inner join roles_persona on fk_Persona_Rol = id_Persona  where id_Persona = ?', [id_Persona]);
    done(null, rows[0]);
 });