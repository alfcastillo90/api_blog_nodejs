'use strict'

var mongoose = require('mongoose');
var app =  require('./app');
var port = 3900;

var url = 'mongodb://localhost:27017/api_rest_blog';
var opciones = {
    userNewUrlParser: true
}

mongoose.set('useFindAndModify', false); //desactivaremos los metodos antiguos de mongo
mongoose.Promise = global.Promise; // uso de promersas

mongoose.connect(url, opciones).then(() => {
    console.log('¡¡¡la conexión a la base de datos se ha sido correcta!!!');

    // Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:'+port);
    });
});

