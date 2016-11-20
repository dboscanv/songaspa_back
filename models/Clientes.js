/**
 * Created by Diego on 9/8/2016.
 */
var mongoose = require("mongoose");
var Empleados = require("./Empleados");
var Trabajos = require("./Trabajos");
var Schema = mongoose.Schema;

var Clientes = new Schema({
    _id: Number, //En lugar de cedula
    clave: String,
    nombre: String,
    apellido: String,
    edad: {type: Number, min: 15, max: 90},
    sexo: String,
    fechanac: Date,
    hijos: Boolean,
    ocupacion: String,
    profesion: String,
    estado_civil: String,
    familiar: String,
    direccion: String,
    telefono_hab: String,
    telefono_ofic: String,
    celular: String,
    email: String,
    //Evaluacion clinica estetica
    evaluacion_clinica: {
        hipertersion_arterial: Boolean,
        hipotension: Boolean,
        diabetes: Boolean,
        renal: Boolean,
        cardiopatio: Boolean,
        circulacion: Boolean,
        anticon_oral: Boolean,
        tras_mens: Boolean, //Buscar explicacion de mama
        f_u_r: Boolean, //Buscar explicacion de mama
        d_i_u: Boolean, //Buscar explicacion de mama
        tiroides: Boolean,
        epilepsia: Boolean,
        lupus: Boolean,
        problemas_digestivos: Boolean,
        estrenimiento: Boolean,
        hepatitis: Boolean,
        cancer: Boolean,
        prob_urinarios: Boolean,
        rete_liquidos: Boolean,
        prob_respiratorios: Boolean,
        asma: Boolean,
        marcapasos: Boolean,
        alergias: Boolean,
        medicamentos: String,
        antecedentes_dermat: Boolean,
        herpes: Boolean,
        hongos: Boolean,
        otros: String,
        cirugias: String,
        cesareas: Boolean,
        complicaciones: String,
        recibido_anestesia: Boolean,
        implantes: {
            recibido_implantes: Boolean,
            area: String,
            tiempo: String,
            tipo: String
        },
        lentes_contacto: Boolean,
        otros_aparatos: String,
        medicamentos_actual: String,
        fuma: Boolean,
        toma: Boolean,
        productos_utilizados: String,
        peeling: {
            realizado_antes: Boolean,
            cuando: String
        },
        productos_en_casa: String
    },
    //Motivo de consulta
    motivo_consulta: {
        tipo_piel: String,
        fototipo_piel: String,
        manchas: String,
        arrugas: String,
        talqangestasia: String,
        arrugas_profundas: String,
        dx: String
    },
    observaciones: String,
    tratamientos: [{
        nombre_tratamiento: String, 
        fecha_inicio: Date,
        fecha_fin: Date,
        finalizado: Boolean,
        trabajos: [{
            id_empleado: {type: Number, ref: "Empleados"},
            id_trabajo: {type: Schema.ObjectId, ref: "Trabajos"},
            fecha: Date
        }]
    }],
    pagos: [{
        monto: Number,
        forma_pago: String,
        numero_comprobante: String,
        trabajo_realizado: Schema.ObjectId,
        cancelado_empleado: Boolean, //Para verificar que ya se le pago al empleado
        id_trabajo: {type: Schema.ObjectId, ref: "Trabajos"},
        fecha_pago: Date
    }]
});

module.exports = mongoose.model("Clientes", Clientes);