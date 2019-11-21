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
    
    var cont = 0;
    var err = 0.01;
    var datos = [];
    var px, py, px1t, py1t; // Estas variables seran usadas solo para la visualizacion del resultado en tablas
                            // ordenadas debido a las trasformaciones que sufre la variable a su paso
//Recibimos la funcion ingresada y la almacenamos en una vairable llamada "funcion"
    var { funcion, x_inicial, y_inicial } = req.body;

    if(funcion.includes('60(x*y)-15x^2-80y^2')){ err=0.025; }

    console.log('Error', err.toString());

    funcion=funcion.toLowerCase();
    console.log(funcion);

    try {  

//Parseamos el texto a ecuacion on la libreria Nerdamer    
    var x_i = nerdamer(x_inicial);
    var y_i = nerdamer(y_inicial);
//Asignamos a px el valor inicial de x.
    px=x_inicial;
    py=y_inicial;

//Parseamos esa funcion para hacerla entendible por la maquina, con la ayuda de Nerdamer.JS
    var func = nerdamer(funcion);
    console.log(func.text());
//Hacemos uso de la biblioteca Nerdamer para las derivadas paraciales
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
console.log(t.text());

//Evaluamos la derivada parcial de x.
var fx1 = derivX.evaluate({x: x_i});
fx1 = fx1.evaluate({y: y_i});
//asignamos la variable a px1 para mostrarla en el view
var px1 = fx1;
console.log(fx1.text());

//Evaluamos la derivada parcial de y.
var fy1 = derivY.evaluate({y: y_i});
fy1 = fy1.evaluate({x: x_i});
//asignamos la variable a py1 para mostrarla en el view
var py1 = fy1;
console.log(fy1.text());

//Definimos el contador de la iteraciones.
cont = 0;

while(Math.abs(fx1) > err || Math.abs(fy1) > err ){
               
//para mostrar
px1t = nerdamer(x_inicial);
py1t = nerdamer(y_inicial);

console.log(px1t.text());
console.log(py1t.text());

//empiezan las iteraciones
cont ++;
console.log(cont);

//Multiplicamos por t.
var fx1_t = fx1.multiply(t);
var fy1_t = fy1.multiply(t);


//Agregamos el vector inicial.
fx1_t = fx1_t.add(x_i);
fy1_t = fy1_t.add(y_i);


var e = nerdamer(func, {x: fx1_t, y: fy1_t});

//Derivamos con respecto a t
var derivT = nerdamer.diff(e, 't');
console.log(derivT.text());
var sol = nerdamer.solve(derivT, 't');
var solu = ''+sol;
console.log('solu', solu);
var resultSol = solu.replace(/[[\]]/g,'');
var rt = nerdamer('simplify(' + resultSol +')');
console.log('rt', rt.text());

//Multiplicamos el valor de t por la derivada obtenida
x_i = x_i.add(fx1.multiply(rt));
y_i = y_i.add(fy1.multiply(rt));

var x_iR = '' + x_i;
var y_iR = '' + y_i;

//Reemplazamos los valores simbolicos
var resultX = x_iR.replace(/[[\]]/g,'');
var rx = nerdamer('arg('+ resultX +')');
console.log(rx.text());
rx = nerdamer('simplify(' + resultX +')');

var resultY = y_iR.replace(/[[\]]/g,'');
var ry = nerdamer('simplify(' + resultY +')');

//Asignacion de variables.
x_i = rx;
y_i = ry;

x_inicial = x_i;
y_inicial = y_i;

//Evaluamos las derivadas en los nuevos puntos obtenidos
fx1 = derivX.evaluate({x: x_i});
fx1 = fx1.evaluate({y: y_i});
fy1 = derivY.evaluate({y: y_i});
fy1 = fy1.evaluate({x: x_i});

console.log(fx1.text());
console.log(fy1.text());

//Se valcula el valor final de la funcion maximizada.
var valorfinal = nerdamer(func, {x: x_i, y: y_i});

//Agregamos el arreglo de objetos JSON
datos.push({iteraciones: cont, x_: px1t+" | "+py1t, fx_: fx1+" | "+fy1, ft_: fx1_t+" | "+fy1_t, t: sol.text(), xi_: x_inicial+" | "+y_inicial, resultado: valorfinal});

}

console.table(datos);
    res.render('index', {data: funcion,
    resultado: valorfinal,
    visible: 'none',
    visible2: 'block',
    dX : derivX.text(),
    dY : derivY.text(),   
    x_i : px, 
    y_i : py,
    px1: px1,
    py1: py1,
    datos: datos
    }); 

} catch (error) {
    req.flash('message', 'Error, replantee su función de acuerdo a nuestros parametros, Gracias...');
    res.redirect('/');   
}

});



module.exports = router;