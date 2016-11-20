var express = require("express");
var CitasRouter = express.Router();
var Citas = require("../models/Citas");
var Clientes = require("../models/Clientes");
var Salidas = require("../utils/salidas");

//Ver citas
CitasRouter.get("/", function (req, res) {

    Citas.find(function (err, save) {
        if (err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });
});

//Agendar cita
CitasRouter.post("/agendar", function (req, res) {
    var obj = {
        nombre: req.body.nombre,
        fecha: req.body.fecha
    };

    Citas.find({"fecha": req.body.fecha}, function (err, cita) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (cita.length) {
            res.json(Salidas.ya_existe("Ya existe una cita para ese día!!"));
        } else {
            var newCita = new Citas(obj);
            newCita.save(function (err, save) {
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
        }
    });


});

CitasRouter.get("/obtenerCalendario/:id", function (req, res) {

    Clientes.aggregate(
        {"$unwind": "$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        {"$match": {"tratamientos.trabajos.id_empleado": parseInt(req.params.id)}},
        {
            "$project": {
                "startsAt": "$tratamientos.trabajos.fecha",
                "title": {"$concat": ["$tratamientos.nombre_tratamiento", " - ", "$nombre", " ", "$apellido"]},
                "color": {
                    "primary": {"$literal": "#e3bc08"},
                    "secondary": {"$literal": "#fdf1ba"}
                }
            }
        }
        , function (err, save) {
            if (err) res.json(Salidas.error(err));
            else if (save.length) {
                res.json(Salidas.exito(save));
            } else {
                res.json(Salidas.no_encontro("No hay trabajos"));
            }
        }
    );

});

CitasRouter.get("/obtenerCalendario", function (req, res) {

    Clientes.aggregate(
        {"$unwind": "$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        // {"$match": {"tratamientos.trabajos.id_empleado": parseInt(req.params.id)}},
        {
            "$project": {
                "startsAt": "$tratamientos.trabajos.fecha",
                "title": {"$concat": ["$tratamientos.nombre_tratamiento", " - ", "$nombre", " ", "$apellido"]},
                "color": {
                    "primary": {"$literal": "#e3bc08"},
                    "secondary": {"$literal": "#fdf1ba"}
                }
            }
        }
        , function (err, save) {
            if (err) res.json(Salidas.error(err));
            else if (save.length) {
                res.json(Salidas.exito(save));
            } else {
                res.json(Salidas.no_encontro("No hay trabajos"));
            }
        }
    );

});

CitasRouter.get("/obtenerCitas", function (req,res) {
   Citas.aggregate({"$project":{
        "startsAt": "$fecha",
        "title": "$nombre",
        "color": {
            "primary": {"$literal": "#e3bc08"},
            "secondary": {"$literal": "#fdf1ba"}
        }
    }}, function (err,save) {
       if (err) res.json(Salidas.error(err));
       else if (save.length) {
           res.json(Salidas.exito(save));
       } else {
           res.json(Salidas.no_encontro("No hay trabajos"));
       }
   });
});


//Cancelar cita fuera de tratamientos

module.exports = CitasRouter;
