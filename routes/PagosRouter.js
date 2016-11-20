var express = require("express");
var mongoose = require("mongoose");
var PagosRouter = express.Router();
var Clientes = require("../models/Clientes");
var Honorarios = require("../models/Honorarios");
var Trabajos = require("../models/Trabajos");
var Salidas = require("../utils/salidas");

PagosRouter.get("/:idCliente", function (req, res) {
    Clientes.find({"_id": parseInt(req.params.idCliente)}, {"pagos": 1, "_id": 0,"nombre":1,"apellido":1}).exec(function (err, save) {
        if (err) res.json(Salidas.error(err));
        else if (save.length) {
            Trabajos.populate(save, {path: "pagos.id_trabajo"}, function (err, populado) {
                if (err) res.json(Salidas.error(err));
                else if (populado.length) {
                    res.json(Salidas.exito(save));
                } else {
                    res.json(Salidas.no_encontro("No se encontraron pagos para ese cliente o no existe cédula ingresada"));
                }
            });
        } else {
            res.json(Salidas.no_encontro("No se encontraron pagos para ese cliente o no existe cédula ingresada"));

        }
    });
});

PagosRouter.post("/haga", function (req, res) {
    Clientes.update({"tratamientos.trabajos._id": mongoose.Types.ObjectId("580e63607044682a9b02c7dd")},
        {"$pull": {"tratamientos.$.trabajos": {"_id": mongoose.Types.ObjectId("580e63607044682a9b02c7dd")}}}, function (err, save) {
            if (err) res.json(err);
            else res.json(save);
        });
});

module.exports = PagosRouter;
