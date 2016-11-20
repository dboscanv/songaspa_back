/**
 * Created by Diego on 9/8/2016.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Honorarios = new Schema({
    idempleado: {type: Number, ref: "Empleados"},
    total_tratamientos: Number,
    iva: Number,
    total_porcentaje: Number,
    total_pagado: Number,
    fecha_pago: Date
});

module.exports = mongoose.model("Honorarios", Honorarios);