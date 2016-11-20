var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmpleadosSchema = new Schema({
    _id: Number, //En lugar de cedula
    nombre: String,
    apellido: String,
    contra: String,
    cargo: String,
    edad: Number,
    correo: String,
    fechanac: Date
});

module.exports = mongoose.model("Empleados", EmpleadosSchema);
