var express = require("express");
var LoginRouter = express.Router();
var Clientes = require("../models/Clientes");
var Empleados = require("../models/Empleados");
var jwt = require("jwt-simple"); //Libreria para crear el token
var config = require("../utils/config");
var moment = require("moment");
var Salidas = require("../utils/salidas");
var validar = require("../utils/validaciones");

//Iniciar sesion como cliente
LoginRouter.post("/cliente", function (req, res) {
    var validacion = validar.nulo(req.body.cedula,req.body.clave);
    // var validarNumeros = validar.numeros(req.body.cedula);
    var validaciones = false;

    if(validacion !== true) {
        res.json(Salidas.advertencia(validacion));
    } else {
        validaciones = true;
    }

    if(validaciones) {
        Clientes.findOne({"_id": parseInt(req.body.cedula), "clave":req.body.clave}, function (err, save) {
            if (err) {
                res.json(err);
            } else if (save) {
                var payload = {
                    sub: save._id,
                    iat: moment().unix(),
                    exp: moment().add(14, "days").unix(),
                    nombre: save.nombre,
                    apellido: save.apellido,
                    sexo: save.sexo,
                    edad: save.edad,
                    cargoCodigo: 3,
                    fechanac: save.fechanac,
                    direccion: save.direccion
                };
                console.log(save.edad);
                var token = jwt.encode(payload,config.TOKEN_SECRET);
                res.json(Salidas.exito(token));
            } else {
                res.json(Salidas.no_encontro("Usuario o clave invalida"));
            }
        });
    }

});

//Iniciar sesión como empleado
LoginRouter.post("/empleado", function (req,res) {
    var validacion = validar.nulo(req.body.cedula,req.body.clave);

    if(validacion !== true) {
        res.json(Salidas.advertencia(validacion));
    } else {
        Empleados.findOne({"_id": req.body.cedula, "contra": req.body.clave}, function (err, save) {
            if (err) {
                res.json(err);
            } else if (save) {
                var cargoCodigo = 5;
                if (save.cargo == "Presidenta") {
                    cargoCodigo = 1;
                } else if (save.cargo == "Masajista" || save.cargo == "Terapeuta" || save.cargo == "Secretaria") {
                    cargoCodigo = 2;
                }

                var payload = {
                    sub: save._id,
                    iat: moment().unix(),
                    exp: moment().add(14, "days").unix(),
                    nombre: save.nombre,
                    apellido: save.apellido,
                    cargo: save.cargo,
                    edad: save.edad,
                    cargoCodigo: cargoCodigo,
                    correo: save.correo,
                    fechanac: save.fechanac
                };
                var token = jwt.encode(payload,config.TOKEN_SECRET);
                res.json(Salidas.exito(token));
            } else {
                res.json(Salidas.no_encontro("Cédula o clave invalida"));
            }
        });
    }
});


module.exports = LoginRouter;