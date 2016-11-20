/**
 * Created by Diego on 22/8/2016.
 */
var express = require("express");
var TrabajosRouter = express.Router();
var Trabajos = require("../models/Trabajos");
var Salidas = require("../utils/salidas");

//Ver trabajos
TrabajosRouter.get("/", function (req,res) {
    Trabajos.find(function(err,save) {
        if(err) res.json(Salidas.error(err));
        else if(save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });
});

//Agregar trabajo
TrabajosRouter.post("/agregar", function (req,res){
   var obj = {
       nombre_trabajo: req.body.nombre_trabajo,
       precio: req.body.precio
   };

    var newTrabajo = new Trabajos(obj);
    newTrabajo.save(function (err,save){
        if(err) res.json(Salidas.error(err));
        else if(save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });

});

//Modificar trabajos
TrabajosRouter.post("/modificar/:id", function (req,res) {
    var precio = parseFloat(req.body.precio);
    var id = req.params.id;
    console.log(req.body.precio);

    if(precio <= 0) {
        res.json(Salidas.error("El precio es menor que cero"));
    } else {
        Trabajos.findOneAndUpdate({_id:id}, req.body, function (err,save) {
            if(err) {
                res.json(Salidas.error(err));
            } else if (save) {
                res.json(Salidas.exito("Modificado exitosamente"));
            } else {
                res.json(Salidas.inesperado());
            }
        });
    }

});

//Eliminar trabajos
TrabajosRouter.delete("/borrar/:id", function (req,res) {
    Trabajos.remove({_id:req.params.id}, function (err) {
        if (err) {
            res.json(Salidas.error(err));
        } else {
            res.json(Salidas.exito("Trabajo con ID " + req.params.id + " borrado"));
        }
    });
});

module.exports = TrabajosRouter;