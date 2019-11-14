const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { isLoggedIn2, isNotLoggedIn2 } = require('../lib/auth2');
const pool = require('../database');
const fs = require('fs');
const FileReader = require('filereader');

router.get('/soluciones', isLoggedIn, async (req, res)=>{
    const user = req.user;
    console.log(user);
    const soluciones = await pool.query('select * from soluciones inner join persona on id_Persona = fk_Estudiante');
    console.log(soluciones);
    res.render('soluciones/list_soluciones', { user, soluciones });    
 });

 router.get('/soluciones/details_solucion/:fk_ejercicio/:fk_estudiante', isLoggedIn, async (req, res)=>{
    const { fk_ejercicio, fk_estudiante } = req.params;
    console.log("view " + fk_ejercicio);
    console.log(req.user);
    const solucion = await pool.query('SELECT * FROM ejercicios inner join soluciones on fk_Ejercicio = id_ejercicio inner join persona on fk_Estudiante = id_Persona WHERE id_Ejercicio = ? and fk_Estudiante = ?', [fk_ejercicio, fk_estudiante]);
    console.log(solucion);

        solucion[0].fecha_Ini = solucion[0].fecha_Ini.toDateString();
        solucion[0].fecha_Fin = solucion[0].fecha_Fin.toDateString();

    res.render('soluciones/details_solucion', { solucion: solucion[0] });
    
});

module.exports = router;