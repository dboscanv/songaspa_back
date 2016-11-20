/**
 * Created by Diego on 18/8/2016.
 */
var express = require("express");
var EmpleadosRouter = express.Router();
var Empleados = require("../models/Empleados");
var Clientes = require("../models/Clientes");
var Salidas = require("../utils/salidas");
var moment = require("moment");

//Traer el total de empleados
EmpleadosRouter.get("/", function (req, res, next) {
    Empleados.find(function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            res.json(Salidas.exito(save));
        } else {
            res.json(Salidas.inesperado());
        }
    });
});

//Traer un empleado en especifico (con CI)
EmpleadosRouter.get("/:id", function (req, res, next) {
    Empleados.findOne({"_id": req.params.id}, function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            var otraFecha = moment(save.fechanac).format("YYYY-MM-DD");
            delete save.fechanac;
            var nuevaObj = JSON.parse(JSON.stringify(save));
            nuevaObj.fechanac = otraFecha;
            res.json(Salidas.exito(nuevaObj));
        } else {
            res.json(Salidas.inesperado());
        }
    });
});

//Ver trabajos de un empleado
EmpleadosRouter.get("/trabajos/:id", function (req, res, next) {

    Clientes.find({"tratamientos.trabajos.id_empleado": req.params.id}, {"tratamientos.trabajos": 1, "_id":0}, function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            res.json(Salidas.exito(save));
        } else {
            res.json(Salidas.inesperado());
        }
    })
});

//Crear Empleados
EmpleadosRouter.post("/crear", function (req, res, next) {
    var obj = {
        _id: req.body.cedula,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        contra: req.body.contra || 1234,
        cargo: req.body.cargo,
        edad: parseInt(moment(req.body.fechanac).toNow(true)),
        correo: req.body.correo,
        fechanac: req.body.fechanac
    };

    console.log(obj);
    console.log(obj.hasOwnProperty("_id"));

    var newEmpleado = new Empleados(obj);
    newEmpleado.save(function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        }
        else if (save) {
            res.json(Salidas.exito(save));
        }
        else {
            res.json(Salidas.inesperado());
        }
    });
});

//Eliminar empleado
EmpleadosRouter.delete("/borrar/:id", function (req, res, next) {
    Empleados.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.json(Salidas.error(err));
        } else {
            res.json(Salidas.exito("Empleado con ID " + req.params.id + " borrado"));
        }
    });
});

//Modificar empleado
EmpleadosRouter.post("/modificar", function (req, res) {
    // var obj = {
    //     _id: req.body._id,
    //     nombre: req.body.nombre,
    //     apellido: req.body.apellido,
    //     contra: req.body.contra,
    //     cargo: req.body.cargo,
    //     edad: req.body.edad,
    //     correo: req.body.correo,
    //     fechanac: req.body.fechanac
    // };

    req.body.edad = parseInt(moment(req.body.fechanac).toNow(true));

    Empleados.findOneAndUpdate({_id: req.body._id}, req.body, function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            res.json(Salidas.exito(save));
        } else {
            res.json(Salidas.inesperado());
        }
    });
});

//Cambiar contraseña
EmpleadosRouter.post("/cambiarClave", function (req,res) {
    var obj = {
        _id: req.body.cedula,
        clave_actual: req.body.clave_actual,
        clave: req.body.clave
    };

    Empleados.findOneAndUpdate({"_id":obj._id, "contra":obj.clave_actual}, {"contra":obj.clave}, function (err,save){
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            res.json(Salidas.exito(save));
        } else {
            res.json(Salidas.inesperado());
        }
    });

});

module.exports = EmpleadosRouter;
