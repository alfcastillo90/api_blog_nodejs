'use strict'

// Cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS

// Añadir prefijos a rutas
app.get('/probando', (req, res) => {
    return  res.status(200).send({
        curso: 'Master en frameworks',
        autor: 'Victor Robles WEB',
        url: 'victorroblesweb.es'
    });
});

// Exportar modulo (fichero actual)
module.exports = app;