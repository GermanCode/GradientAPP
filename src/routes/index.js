const express = require('express');
const router = express.Router();
const Algebra = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Algebra.js');
const nerdamer = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/nerdamer.core.js');
const Calculus = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Calculus');
const Solve = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Solve');
const Extra = require('../public/javascript/nerdamer/jiggzson-nerdamer-305a486/Extra');

const pool = require('../database');

router.get('/', (req, res) => {
    res.render('index'); 
});

router.post('/', async (req, res)=>{
    let err = 0.00001;
//Recibimos la funcion ingresada y la almacenamos en una vairable llamada "funcion"
    const { funcion, x_inicial, y_inicial } = req.body;

    var x_i = nerdamer(x_inicial);
    var y_i = nerdamer(y_inicial);

//Parseamos esa funcion para hacerla entendible por la maquina, con la ayuda de Algebra.JS
    var func = nerdamer(funcion);
    console.log(func.text());
//Hacemos uso de la biblioteca Merdaner para las derivadas paraciales
    var derivX = nerdamer.diff(func, 'x');
//Verificamos si es multivariada la funcion.
    if(funcion.indexOf('y') !== null){
    var derivY = nerdamer.diff(func, 'y');
    }else{
        derivY = 0;
    }
//Visualizamos por consola las derivadas
    console.log(derivX.text());
    console.log(derivY.text());
//Generamos t symbol
var t = new nerdamer("t");

//Evaluamos la derivada parcial de x.
var fx1 = derivX.evaluate({x: x_i});
fx1 = fx1.evaluate({y: y_i});

//Evaluamos la derivada parcial de y.
var fy1 = derivY.evaluate({y: y_i});
fy1 = fy1.evaluate({x: x_i});

//Multiplicamos por t.
var fx1_t = t.multiply(fx1);
var fy1_t = t.multiply(fy1);

//Agregamos el vector inicial.
var fx1_t = x_i.add(fx1_t);
var fy1_t = y_i.add(fy1_t);

console.log(fx1_t.text());
console.log(fy1_t.text());


var e = nerdamer(func, {x: fx1_t, y: fy1_t});
e = nerdamer('simplify(' + e +')');

//Derivamos con respecto a t
var derivT = nerdamer.diff(e, 't');
console.log(derivT.text());
var sol = nerdamer.solve(derivT, 't');
console.log(sol.text());

//while(Math.abs(fx1) > err || Math.abs(fy1) > err){
    var g = func.evaluate({x: ifxt}, {y: ifyt});
    //console.log(g.text());
//}

// Agregamos la funcion a la bd
    const newFunc = {
        funcion
    };
    console.log(newFunc);
    await pool.query('INSERT INTO funcionprueba SET ?', [newFunc]);
    res.render('index', {data: funcion,
    visible: 'none',
    visible2: 'block',
    dX : derivX.text(),
    dY : derivY.text(),   
    x_i : x_i, 
    y_i : y_i
    });
    
});

module.exports = router;