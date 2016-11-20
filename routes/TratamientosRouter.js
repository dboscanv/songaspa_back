var express = require("express");
var TratamientosRouter = express.Router();
var Clientes = require("../models/Clientes");
var Empleados = require("../models/Empleados");
var Trabajos = require("../models/Trabajos");
var Salidas = require("../utils/salidas");
var mongoose = require("mongoose");
var moment = require("moment");

//Iniciar tratamiento
/*
 *
 * db.clientes.update({"_id":24732241}, {$push: {tratamientos: {
 nombre_tratamiento: "Plasma Rico en Plaquetas",
 precio: 5000,
 fecha_inicio: "31/08/2016",
 sesiones: 2,
 solvencia: false
 }}})

 * */

TratamientosRouter.post("/iniciar/:id", function (req, res) {
    console.log("Esto es req" + JSON.stringify(req.body));
    var id = req.params.id;
    var obj = {
        nombre_tratamiento: req.body.nombre_tratamiento,
        fecha_inicio: req.body.fecha_inicio,
        solvencia: false,
        finalizado: false,
        trabajos: {
            id_empleado: req.body.empleado,
            id_trabajo: req.body.trabajo,
            fecha: req.body.fecha_inicio
        }
    };

    console.log("Valor empleado: " + req.body.empleado);
    console.log("Valor fecha: " + req.body.fecha_inicio);
    console.log("Valor id cliente: " + id);


    //Verificar que el empleado este disponible
    Clientes.aggregate(
        {"$unwind": "$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        {
            "$match": {
                "$or": [{
                    "tratamientos.trabajos.id_empleado": req.body.empleado,
                    "tratamientos.trabajos.fecha": new Date(req.body.fecha_inicio)
                },
                    {"tratamientos.trabajos.fecha": new Date(req.body.fecha_inicio), "_id": parseInt(id)}]
                // "tratamientos.trabajos.id_empleado": req.body.empleado,
                // "tratamientos.trabajos.fecha": new Date(req.body.fecha)
            }
        },
        {
            "$project": {
                "trabajos": "$tratamientos.trabajos",
                "id_tratamiento": "$tratamientos._id",
                "nombre_tratamiento": "$tratamientos.nombre_tratamiento"
            }
        }, function (err, result) {
            if (err) res.json(Salidas.error(err));
            else if (result) {
                console.log("Entra en este WTF");
                console.log(result);
                if (!result.length) {
                    console.log("No arrojo nada");
                    Guardar();
                } else {
                    console.log("Ya existe!!!");
                    res.json(Salidas.ya_existe(result));
                }
            }
        }
    );

    function Guardar() {
        Clientes.update({"_id": req.params.id}, {$push: {"tratamientos": obj}}, function (err, save) {
            if (err) res.json(Salidas.error(err));
            else if (save) res.json(Salidas.exito(save));
            else res.json(Salidas.inesperado());
        });
    }

});

//Agregar pagos
TratamientosRouter.post("/pagos/:id/:idTratamiento", function (req, res) {
    // // var obj = {
    // //     monto: req.body.monto,
    // //     forma_pago: req.body.forma_pago,
    // //     comprobante: req.body.comprobante
    // // };
    //
    // //Agregar el pago
    // Clientes.update({"tratamientos._id": req.params.idTratamiento}, {$push: {"tratamientos.$.pagos": req.body}}, function (err, save) {
    //     if (err) res.json(Salidas.error(err));
    //     else if (save) res.json(Salidas.exito(save));
    //     else res.json(Salidas.inesperado());
    // });
    //
    // //Posterior a agregar un pago, verificar la solvencia
    // var monto = MontoTotal(req.params.idTratamiento);
    // if(monto !== null) {
    //
    // }
    console.log("Entro");

    var obj = {
        monto: req.body.monto,
        forma_pago: req.body.forma_pago,
        numero_comprobante: req.body.comprobante,
        trabajo_realizado: req.body.trabajo_realizado,
        cancelado_empleado: false,
        id_trabajo: req.body.id_trabajo._id,
        fecha_pago: moment().format()
    };

    //Primero verificar que ya tenga pagos
    Clientes.find({"pagos.trabajo_realizado": req.body.trabajo_realizado}, function (err, save) {
        if (err) res.json(Salidas.error(err));
        else if (save.length) {
            //Encontro!!
            res.json(Salidas.ya_existe("Ya existe un pago!! Rechazado"));
        } else {
            //NO existen pagos para ese trabajo
            Clientes.update({"_id": req.params.id}, {$push: {"pagos": obj}}, function (err, save) {
                if (err) res.json(Salidas.error(err));
                else if (save) res.json(Salidas.exito(save));
                else res.json(Salidas.inesperado());
            });
        }
    });

});

//Agregar pagos
TratamientosRouter.post("/pagosTodo/:id/:idTratamiento", function (req, res) {
    Clientes.aggregate(
        {"$unwind": "$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        {
            "$project": {
                "trabajos": "$tratamientos.trabajos._id",
                "_id": 0,
                "nombre": "$tratamientos.nombre_tratamiento",
                "idTratamiento": "$tratamientos._id",
                "id_trabajo":"$tratamientos.trabajos.id_trabajo"
            }
        },
        {"$match": {"idTratamiento": mongoose.Types.ObjectId(req.params.idTratamiento)}}
        , function (err, result) {
            if (err) res.json(Salidas.error(err));
            else if (result) {
                if (!result.length) {
                    res.json(Salidas.no_encontro("No encontro trabajos para ese id de tratamiento"));
                } else {
                    for (var x = 0; x < result.length; x++) {
                        (function (x) {
                            Clientes.find({"pagos.trabajo_realizado": x.trabajos}, function (err, save) {
                                if (err) res.json(Salidas.error(err));
                                else if (save.length) {
                                    //Encontro!!
                                    console.log(x.nombre + "YA TIENE PAGO REALIZADO");
                                } else {

                                    var obj = {
                                        trabajo_realizado: x.trabajos,
                                        cancelado_empleado: false,
                                        fecha_pago: new Date(),
                                        forma_pago: req.body.forma_pago,
                                        monto : 0,
                                        id_trabajo: x.id_trabajo
                                    };

                                    //NO existen pagos para ese trabajo
                                    Clientes.update({"_id": req.params.id}, {$push: {"pagos": obj}}, function (err, save) {
                                        if (err) res.json(Salidas.error(err));
                                        else if (save) {
                                            console.log(x.nombre + "Lo va a guardar!");
                                        }
                                    });
                                }
                            })
                        })(result[x]);
                    }
                    res.json(Salidas.exito("Pagos realizados satisfactoriamente"));
                }
            }
        });

});

//Agregar trabajos
TratamientosRouter.post("/trabajos/:idTratamiento/:idcliente", function (req, res) {
    var id = req.params.idcliente;
    var obj = {
        id_empleado: req.body.empleado,
        id_trabajo: req.body.trabajo,
        fecha: req.body.fecha,
        ignorar: false
    };

    //Verificar que el empleado este disponible
    Clientes.aggregate(
        {"$unwind": "$tratamientos"},
        {"$unwind": "$tratamientos.trabajos"},
        {
            "$match": {
                "$or": [{
                    "tratamientos.trabajos.id_empleado": req.body.empleado,
                    "tratamientos.trabajos.fecha": new Date(req.body.fecha)
                },
                    {"tratamientos.trabajos.fecha": new Date(req.body.fecha), "_id": parseInt(id)}]
                // "tratamientos.trabajos.id_empleado": req.body.empleado,
                // "tratamientos.trabajos.fecha": new Date(req.body.fecha)
            }
        },
        {
            "$project": {
                "trabajos": "$tratamientos.trabajos",
                "id_tratamiento": "$tratamientos._id",
                "nombre_tratamiento": "$tratamientos.nombre_tratamiento",
                "_id": 0
            }
        }, function (err, result) {
            if (err) res.json(Salidas.error(err));
            else if (result) {
                if (!result.length) {
                    //El empleado esta disponible
                    Clientes.update({"tratamientos._id": req.params.idTratamiento}, {$push: {"tratamientos.$.trabajos": obj}}, function (err, save) {
                        if (err) res.json(Salidas.error(err));
                        else if (save) res.json(Salidas.exito(save));
                        else res.json(Salidas.inesperado());
                    });
                } else {
                    res.json(Salidas.ya_existe(result));
                }
            }
        }
    );


});

//Obtener tratamiento
TratamientosRouter.get("/:idTratamiento", function (req, res) {
    Clientes.findOne({"tratamientos._id": req.params.idTratamiento}, {
        "tratamientos": 1,
        "_id": 0,
        "tratamientos.tratamientos.$": 1,
        "nombre":1,
        "apellido":1
    }).populate("tratamientos.trabajos.id_empleado tratamientos.trabajos.id_trabajo").exec(function (err, save) {
        if (err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.no_encontro());
    });
});

//Obtener monto de tratamiento
TratamientosRouter.get("/pagoTotal/:idTratamiento", function (req, res) {
    Clientes.aggregate(
        {$unwind: "$tratamientos"},
        {$unwind: "$tratamientos.trabajos"},
        {$match: {"tratamientos._id": mongoose.Types.ObjectId(req.params.idTratamiento)}},
        {
            $project: {
                "id_trabajo": "$tratamientos.trabajos.id_trabajo",
                "_id": 0
            }
        }
        , function (err, result) {
            if (err) {
                res.json(Salidas.error(err));
            }
            else if (result) {
                console.log(result);
                if (result.length) {
                    Trabajos.populate(result, {path: "id_trabajo"}, function (err, populado) {
                        if (err) res.json(Salidas.error(err));
                        else if (populado) {
                            var sum = 0;
                            for (var x = 0; x < populado.length; x++) {
                                sum += parseFloat(populado[x].id_trabajo.precio);
                            }
                            res.json(Salidas.exito(sum));
                        }
                    });
                } else {
                    res.json(Salidas.no_encontro("No se encontraron"));
                }
            }
        }
    );
});

TratamientosRouter.get("/ignorar/:idTratamiento/:idTrabajo", function (req, res) {
    Clientes.update({"tratamientos.trabajos._id": mongoose.Types.ObjectId(req.params.idTrabajo)},
        {"$pull": {"tratamientos.$.trabajos": {"_id": mongoose.Types.ObjectId(req.params.idTrabajo)}}}, function (err, save) {
            if (err) res.json(Salidas.error(err));
            else res.json(Salidas.exito(save));
        });
});

TratamientosRouter.get("/finalizar/:idTratamiento", function (req, res) {
    Clientes.aggregate(
        {$match: {"tratamientos.finalizado": false}},
        {$unwind: "$tratamientos"},
        {$match: {"tratamientos._id": mongoose.Types.ObjectId(req.params.idTratamiento)}},
        {$unwind: "$tratamientos.trabajos"},
        //{$match: {"pagos.cancelado_empleado": false}},
        {
            $project: {
                "trabajo": "$tratamientos.trabajos", "_id": 0
            }
        }, function (err, trabajosDeUnTratamiento) {
            if (err) res.json(Salidas.error(err));
            else if (trabajosDeUnTratamiento.length) {
                Clientes.aggregate(
                    {$match: {"tratamientos.finalizado": false}},
                    {$unwind: "$tratamientos"},
                    {$match: {"tratamientos._id": mongoose.Types.ObjectId(req.params.idTratamiento)}},
                    {$unwind: "$tratamientos.trabajos"},
                    {$unwind: "$pagos"},
                    //{$match: {"pagos.cancelado_empleado": false}},
                    {
                        $project: {
                            "comparacion": {
                                $eq: ["$tratamientos.trabajos._id", "$pagos.trabajo_realizado"]
                            },
                            "trabajo": "$tratamientos.trabajos._id",
                            "trabajo_popular": "$tratamientos.trabajos.id_trabajo",
                            "pago": "$pagos.trabajo_realizado"
                        }
                    },
                    {$match: {"comparacion": true}}
                    , function (err, trabajosPagados) {
                        if (err) res.json(Salidas.error(err));
                        else if (trabajosPagados.length) {
                            if (trabajosDeUnTratamiento.length == trabajosPagados.length) {
                                Clientes.update({"tratamientos._id": mongoose.Types.ObjectId(req.params.idTratamiento)}, {"tratamientos.$.finalizado": true}, function (err, save) {
                                    if (err) res.json(Salidas.error(err));
                                    else res.json(Salidas.exito(save));
                                })
                            } else {
                                res.json(Salidas.advertencia("Faltan trabajos por pagar"));
                            }
                        } else {
                            res.json(Salidas.advertencia("No encontro trabajos pagados!"));
                        }
                    });
            } else {
                res.json(Salidas.no_encontro("No encontro trabajos!"));
            }
        })
});

TratamientosRouter.get("/verificarPago/:idTrabajo", function (req, res) {
    Clientes.find({"pagos.trabajo_realizado": mongoose.Types.ObjectId(req.params.idTrabajo)}, {"pagos": 1}, function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save.length) res.json(Salidas.exito(save));
        else res.json(Salidas.no_encontro(false));
    })
});

TratamientosRouter.get("/verPagos/:idCliente", function (req, res) {
    Clientes.find({"_id":parseInt(req.params.idCliente)}, {"pagos": 1, "_id":0}, function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save.length) res.json(Salidas.exito(save));
        else res.json(Salidas.no_encontro(false));
    })
});



function MontoTotal(idTratamiento) {
    Clientes.aggregate(
        {$unwind: "$tratamientos"},
        {$unwind: "$tratamientos.trabajos"},
        {$match: {"tratamientos._id": mongoose.Types.ObjectId(idTratamiento)}},
        {
            $project: {
                "id_trabajo": "$tratamientos.trabajos.id_trabajo",
                "_id": 0
            }
        }
        , function (err, result) {
            if (err) {
                return null;
            }
            else if (result) {
                console.log(result);
                if (result.length) {
                    Trabajos.populate(result, {path: "id_trabajo"}, function (err, populado) {
                        if (err) return null;
                        else if (populado) {
                            var sum = 0;
                            for (var x = 0; x < populado.length; x++) {
                                sum += parseFloat(populado[x].id_trabajo.precio);
                            }
                            return sum;
                        }
                    });
                } else {
                    return null;
                }
            }
        }
    );
}

function TotalPagado() {

}


module.exports = TratamientosRouter;