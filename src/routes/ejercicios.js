const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/ejercicios', async (req, res)=>{

const ejercicios = await pool.query('SELECT * FROM ejercicios')
console.log(ejercicios);
res.render('ejercicios/list_ejercicios', { ejercicios });
});

router.get('/ejercicios/add_ejercicio', async (req, res) =>{
    res.render('ejercicios/add_ejercicio');
});

router.post('/add_ejercicio', async (req, res) =>  {
    const { fk_Docente, fecha_Ini, fecha_Fin, fun_Obj, desc_Ejer } = req.body;
    const newEjercicio = {
        fk_Docente,
        fecha_Ini,
        fecha_Fin,
        fun_Obj,
        desc_Ejer,
    };
    await pool.query('INSERT INTO ejercicios set ?', [newEjercicio]);
    req.flash('success', ' Ejercicio guardado correctamente');
    res.redirect('/ejercicios');
});

router.get('/ejercicios/edit_ejercicio/:id_ejercicio', async (req, res)=>{
    const { id_ejercicio } = req.params;
    console.log("pifiado " + id_ejercicio);
    const ejercicios = await pool.query('SELECT * FROM ejercicios WHERE id_Ejercicio = ?', [id_ejercicio]);
    //req.flash('success', 'Ejercicio Editado Correctamente');
    res.render('ejercicios/edit_ejercicio', { ejercicio: ejercicios[0] });
});

router.get('/ejercicios/delete/:id_ejercicio', async (req, res)=>{

    const {id_ejercicio} = req.params;
    pool.query('DELETE FROM ejercicios WHERE id_Ejercicio = ?', [id_ejercicio]);
    //req.flash('success', 'Link Removed sucessfully');
    res.redirect('/ejercicios');
});

module.exports = router;