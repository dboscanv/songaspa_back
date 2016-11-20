var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Tratamientos = new Schema({
    id_cliente: {type: Schema.ObjectId, ref: "Clientes"},
    nombre_tratamiento: String,
    precio: Number,
    fecha_inicio: Date,
    trabajos: [{
        id_empleado: {type: Schema.ObjectId, ref: "Empleados"},
        id_trabajo: {type: Schema.ObjectId, ref: "Trabajos"},
        fecha: Date
    }],
    pagos: [{
        monto: Number,
        forma_pago: String,
        numero_comprobante: String
    }],
    solvencia: Boolean //Este me dira si el total de pagos es igual al precio, el tratamiento esta finalizado

});

module.exports = mongoose.model("Tratamientos", Tratamientos);