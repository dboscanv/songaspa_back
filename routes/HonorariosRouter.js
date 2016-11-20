var express = require("express");
var HonorariosRouter = express.Router();
var Clientes = require("../models/Clientes");
var Honorarios = require("../models/Honorarios");
var Trabajos = require("../models/Trabajos");
var Salidas = require("../utils/salidas");

//Obtener los trabajos
HonorariosRouter.get("/:idEmpleado", function (req, res) {
    Clientes.aggregate(
        {"$match": {"tratamientos.finalizado":false}},
        {"$unwind":"$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        {"$unwind":"$pagos"},
        {"$match": {"pagos.cancelado_empleado":false,"tratamientos.trabajos.id_empleado":parseInt(req.params.idEmpleado)}},
        {"$project":{
            "comparacion": {
                "$eq": ["$tratamientos.trabajos._id","$pagos.trabajo_realizado"]
            },
            "trabajo":"$tratamientos.trabajos._id",
            "trabajo_popular":"$tratamientos.trabajos.id_trabajo",
            "pago":"$pagos.trabajo_realizado",
            "nombre": 1,
            "apellido": 1,
            "fecha":"$tratamientos.trabajos.fecha"
        } },
        {"$match": {"comparacion": true}}, function (err, trabajos){
            if (err) res.json(Salidas.error(err));
            else if (trabajos.length) {
                Trabajos.populate(trabajos,{path:"trabajo_popular"}, function (err,trabajos2) {
                    if (err) res.json(Salidas.error(err));
                    else if (trabajos.length) {
                         res.json(Salidas.exito(trabajos2));
                    } else {
                        res.json(Salidas.no_encontro("¡Este empleado no tiene trabajos pagados!"));
                    }
                });
            } else {
                res.json(Salidas.no_encontro("¡Este empleado no tiene trabajos pagados!"));
            }
        });


    // //Primero obtengo los trabajos POR ESE EMPLEADO
    // Clientes.aggregate({"$unwind": "$tratamientos"},
    //     {"$unwind": "$tratamientos.trabajos"},
    //     {"$project": {"trabajos": "$tratamientos.trabajos", "_id": 1, "nombre": 1, "apellido": 1}},
    //     {"$match": {"trabajos.id_empleado": parseInt(req.params.idEmpleado)}}, function (err, trabajos) {
    //         if (err) res.json(Salidas.error(err));
    //         else if (trabajos.length) {
    //             Trabajos.populate(trabajos, {path: "trabajos.id_trabajo"}, function (err, trabajosP) {
    //                 if (err) res.json(Salidas.error(err));
    //                 else {
    //                     //Ahora obtengo los pagos!!
    //                     Clientes.aggregate({"$unwind": "$pagos"},
    //                         {"$project": {"pagos": "$pagos", "_id": 0}},
    //                         function (err, pagos) {
    //                             if (err) res.json(Salidas.error(err));
    //                             else if (pagos.length) {
    //                                 console.log("Antes del for");
    //                                 var totalTrabajos = []; //array de trabajos listos
    //                                 //Iterar trabajos
    //                                 for (var x = 0; x < trabajosP.length; x++) {
    //                                     console.log("Esto es trabajos" + trabajosP[x].trabajos._id);
    //                                     //Iterar pagos
    //                                     for (var y = 0; y < pagos.length; y++) {
    //                                         console.log("Esto es pagos" + pagos[y].pagos.trabajo_realizado);
    //                                         console.log(parseInt(trabajosP[x].trabajos._id) == parseInt(pagos[y].pagos.trabajo_realizado));
    //                                         if (parseInt(trabajosP[x].trabajos._id) == parseInt(pagos[y].pagos.trabajo_realizado)) {
    //                                             console.log(JSON.stringify(pagos[y]));
    //                                             console.log("Consiguio un pago!!");
    //                                             if (!pagos[y].pagos.cancelado_empleado) {
    //                                                 totalTrabajos.push(trabajosP[x]);
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //
    //                                 if (totalTrabajos.length > 0) {
    //                                     res.json(Salidas.exito(totalTrabajos));
    //                                 } else {
    //                                     res.json(Salidas.no_encontro("¡Este empleado no tiene trabajos pagados!"));
    //                                 }
    //
    //                             } else res.json(Salidas.no_encontro("¡Este empleado no tiene trabajos pagados!"));
    //                         })
    //                 }
    //             });
    //
    //
    //         }
    //         else {
    //             res.json(Salidas.no_encontro("Este empleado no tiene trabajos pagados"));
    //         }
    //     });
});

HonorariosRouter.post("/pagar", function (req, res) {
    var objNewHonorario = {
        idempleado: req.body.idempleado,
        total_tratamientos: req.body.total_tratamientos,
        iva: req.body.iva,
        total_porcentaje: req.body.total_porcentaje,
        total_pagado: req.body.total_pagado,
        fecha_pago: req.body.fecha_pago
    };

    var Trabajos = req.body.Trabajos;

    //Colocarlos los trabajos como PAGADOS
    for (var x = 0; x < Trabajos.length; x++) {
        (function (trabajo) {
            console.log(trabajo);
            Clientes.findOneAndUpdate({"pagos.trabajo_realizado": trabajo.trabajo},{"pagos.$.cancelado_empleado":true}, function (err,save) {
                if(err) {
                    console.log("HUBO ERROR");
                    console.log(err);
                    res.json(Salidas.error(err));
                }
                 else {
                    console.log("Siga adelante mi capitan");
                }
            });
        })(Trabajos[x]);
    }



    //Guardar los honorarios :)))
    var newHon = new Honorarios(objNewHonorario);
    newHon.save(function (err,hon) {
        if (err) {
            res.json(Salidas.error(err));
        }
        else if (hon) {
            res.json(Salidas.exito(hon));
        }
        else {
            res.json(Salidas.inesperado());
        }
    });


});

HonorariosRouter.get("/", function (req,res){
    Honorarios.find({}).populate("idempleado").exec(function (err,save){
        if(err) res.json(Salidas.error(err));
        else if (save.length) res.json(Salidas.exito(save));
        else res.json(Salidas.no_encontro("No hay pagos"));
    });
});

module.exports = HonorariosRouter;