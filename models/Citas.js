/**
 * Created by Diego on 9/8/2016.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Citas fuera de los tratamientos
var Citas = new Schema({
    nombre: String,
    fecha: Date
});

module.exports = mongoose.model("Citas", Citas);
