const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', (req, res) => {
    res.render('index'); 
});

router.post('/', async (req, res)=>{
    //console.log(req.body);
    const { funcion } = req.body;
    const newFunc = {
        funcion
    };
    //console.log(newFunc);
    await pool.query('INSERT INTO funcionprueba SET ?', [newFunc]);
    res.send('Received');
    
});

module.exports = router;