'use strict'

var validator = require('validator');
var fs = require('fs');
var Article = require('../models/article');

var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;
        console.log(hola);
        return res.status(200).send({
            curso: 'Master en frameworks',
            autor: 'Victor Robles WEB',
            url: 'victorroblesweb.es',
            hola: hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción de test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        // recoger parametros por post
        var params = req.body;
        console.log(params);
        //validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_content && validate_title) {
            //Crear objeto a guardar
            var article = new Article();
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                //Devolver una respuesta
                return res.status(200).send({
                    result: 'success',
                    article: articleStored
                });
            });
        } else {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
    },

    getArticles: (req, res) => {
        var query = Article.find({});
        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }
        //Find
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req, res) => {
        //Recoger el id de la url
        var articleId = req.params.id;
        //Comprobar si es diferente a null
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (!article || err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            //Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req, res) => {
        //Recoger el id del articulo por la url
        var articleId = req.params.id;
        // Recoger los datos que llegan por put
        var params = req.body;
        console.log(params);
        //validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        //Find and update
        if (validate_content && validate_title) {
            Article.findOneAndUpdate({
                _id: articleId
            }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }

                return res.status(200).send({
                    result: 'success',
                    article: articleUpdated
                });
            });
        } else {
            return res.status(200).send({
                message: 'La validación no es correcta'
            });
        }
    },

    delete: (req, res) => {
        // Recoger el id de la url;
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({
            _id: articleId
        }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            return res.status(200).send({
                result: 'success',
                article: articleRemoved
            });
        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        // Conseguir nombre y extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        // Extensión del fichero
        var extension_split = file_name.split('\.');

        // Comprobar la extensión, solo imagenes, si no es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es valida'
                });
            });
        } else {
            //Si todo es valido
            var articleId = req.params.id;
            //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo.
            Article.findOneAndUpdate(
                {_id: articleId}, 
                {image: file_name}, 
                {new: true}, //con el objetivo que devuelva el objeto despues de ser actualizado
                (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
            )
        }
    }, // end upload file

    getImage: (req, res) => {
        
    }
}; // end controller

module.exports = controller;