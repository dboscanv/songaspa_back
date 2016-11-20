var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Trabajos = new Schema({
    nombre_trabajo: String,
    precio: Number
});

module.exports = mongoose.model("Trabajos", Trabajos);