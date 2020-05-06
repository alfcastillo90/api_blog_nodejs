'use strict'

var validator = require('validator');
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

            if(!articles) {
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
        if(!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo'
            }); 
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {
            if(!article || err) {
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
            }, params, {new: true}, (err, articleUpdated) => {
                if(err) {
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
        }, (err, articleRemoved)=> {
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
    }

}; // end controller

module.exports = controller;