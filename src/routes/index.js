const express = require('express');
const router = express.Router();
const algebra = require('algebra.js');
const nerdamer = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/nerdamer.core.js');
const Calculus = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Calculus');
const Solve = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Solve');
const Extra = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Extra');

const pool = require('../database');

router.get('/', (req, res) => {
    res.render('index'); 
});

router.post('/', async (req, res)=>{
//Recibimos la funcion ingresada y la almacenamos en una vairable llamada "funcion"
    const { funcion } = req.body;
//Parseamos esa funcion para hacerla entendible por la maquina, con la ayuda de Algebra.JS
    var value = algebra.parse(funcion);
//Hacemos uso de la biblioteca Merdaner para las derivadas paraciales
    var derivX = nerdamer.diff(value, 'x');
//Verificamos si es multivariada la funcion.
    if(funcion.indexOf('y') !== null){
    var derivY = nerdamer.diff(value, 'y');
    }else{
        derivY = 0;
    }
//Visualizamos por consola las derivadas
    console.log(derivX.text());
    console.log(derivY.text());
// Agregamos la funcion a la bd
    const newFunc = {
        funcion
    };
    console.log(newFunc);
    await pool.query('INSERT INTO funcionprueba SET ?', [newFunc]);
    res.send('Received');
    
});

module.exports = router;