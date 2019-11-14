const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const fs = require('fs');
const FileReader = require('filereader');


router.get('/ejercicios', isLoggedIn, async (req, res)=>{
    var c = req.user.curso;
    console.log(c);
    var r = req.user.fk_Rol_Persona;
    console.log(r);
    const user = req.user;
    console.log(user);
    // Si el rol es '1' = Estudiante
    if(r==1){
        const ejercicios = await pool.query('select * from ejercicios inner join curso on fk_Curso = id_Curso where desc_Curso = ?', c);
        //const p3 = await pool.query('select * from soluciones inner join estudiante on fk_Estudiante = fk_Persona and fk_Curso = 1 group by fk_Ejercicio');
        console.log(ejercicios);
        res.render('ejercicios/list_ejercicios', { user, ejercicios });    
    }else{
        const ejercicios = await pool.query('select * from ejercicios inner join curso on fk_Curso = id_Curso');
        console.log(ejercicios);
        res.render('ejercicios/list_ejercicios', { user, ejercicios });
    }

});

router.get('/ejercicios/add_ejercicio', isLoggedIn, async (req, res) =>{
    res.render('ejercicios/add_ejercicio');
});

router.post('/ejercicios/add_ejercicio', isLoggedIn, async (req, res) =>  {
    const { fk_Docente, fecha_Ini, fecha_Fin, func_Obj, desc_Ejer, fk_Curso } = req.body;
 
    const newEjercicio = {
        fk_Docente,
        fecha_Ini,
        fecha_Fin,
        func_Obj,
        desc_Ejer,
        fk_Curso
    };
    await pool.query('INSERT INTO ejercicios set ?', [newEjercicio]);
    req.flash('success', ' Ejercicio guardado correctamente');
    res.redirect('/ejercicios');
});

router.post('/ejercicios/edit_ejercicios/:id_ejercicio', isLoggedIn, async (req, res) =>{
    
    var user = req.user;
    console.log(user.id_Persona);
    let fk_Solucion = req.files.solucion;
    const {id_ejercicio} = req.params;
    const { fk_Docente, fecha_Ini } = req.body;
    console.log(req.body);
    const newEjercicio = {
        fk_Docente,
        fecha_Ini,
        fk_Solucion,
        fk_Estudiante: req.user.id_Persona
    };
    await pool.query('UPDATE ejercicios SET ? WHERE id_ejercicio = ?', [newEjercicio, id_ejercicio]);
    res.redirect('/ejercicios');
});

router.get('/ejercicios/edit_ejercicio/:id_ejercicio', isLoggedIn, async (req, res)=>{
    const { id_ejercicio } = req.params;
    console.log("pifiado " + id_ejercicio);
    const ejercicios = await pool.query('SELECT * FROM ejercicios WHERE id_Ejercicio = ?', [id_ejercicio]);
    //req.flash('success', 'Ejercicio Editado Correctamente');
    res.render('ejercicios/edit_ejercicio', { ejercicio: ejercicios[0] });
});

router.get('/ejercicios/delete/:id_ejercicio', isLoggedIn, async (req, res)=>{

    const {id_ejercicio} = req.params;
    pool.query('DELETE FROM ejercicios WHERE id_Ejercicio = ?', [id_ejercicio]);
    //req.flash('success', 'Link Removed sucessfully');
    res.redirect('/ejercicios');
});

router.post('/ejercicios/solve_ejercicio/:id_ejercicio', isLoggedIn, async (req, res) =>{

    try {       
        const fk_Estudiante = req.user.id_Persona;
        const { fk_Ejercicio, img_Solucion } = req.body;
        const newSolucion = {
        fk_Ejercicio,
        fk_Estudiante,
        img_Solucion
    };
    await pool.query('INSERT INTO soluciones SET ?', [newSolucion]);
    req.flash('success', 'Ejercicio Enviado Correctamente');
    res.redirect('/ejercicios');
        
    } catch (error) {
       /* if(error == ''){
            hacer algo
        }*/
        console.log('Error ' + error);
        req.flash('message', ' Error: El ejercicio ya se encuentra registrado como resuelto');
        res.redirect('/ejercicios');
        
    }
    
});

router.get('/ejercicios/solve_ejercicio/:id_ejercicio', isLoggedIn, async (req, res)=>{
    const { id_ejercicio } = req.params;
    console.log("solve " + id_ejercicio);
    console.log(req.user);
    const ejercicios = await pool.query('SELECT * FROM ejercicios inner join soluciones on fk_Ejercicio = id_ejercicio WHERE id_Ejercicio = ? and fk_Estudiante = ?', [id_ejercicio, req.user.id_Persona]);
    if(ejercicios.length > 0){

        ejercicios[0].fecha_Ini = ejercicios[0].fecha_Ini.toLocaleString();
        ejercicios[0].fecha_Fin = ejercicios[0].fecha_Fin.toDateString();

    res.render('ejercicios/solve_ejercicio', { ejercicio: ejercicios[0], existe: 'disabled', texto: ' Ejercicio registrado, fecha de envio: '+ ejercicios[0].fec_Creacion.toLocaleString() +'', visible: 'true', novisible: 'false' });
    }else{
        const ejercicios = await pool.query('SELECT * FROM ejercicios  WHERE id_Ejercicio = ?', [id_ejercicio]);
        ejercicios[0].fecha_Ini = ejercicios[0].fecha_Ini.toLocaleString();
        ejercicios[0].fecha_Fin = ejercicios[0].fecha_Fin.toDateString();
        console.log(ejercicios);
        res.render('ejercicios/solve_ejercicio', { ejercicio: ejercicios[0], visible: 'false' });
    }
    
});

module.exports = router;