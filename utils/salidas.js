/**
 * Created by Diego on 22/8/2016.
 */
//Este archivo es el formato de las salidas de las diferentes peticiones que se hagan

var salidas = {
    exito: function (salida) {
        return {
            status: 1,
            mensaje: "Todo bien",
            salida: salida
        }
    },
    error: function (err) {
        return {
            status: 2,
            mensaje: "Error en BD",
            salida: err
        }
    },
    inesperado: function () {
        return {
            status: 3,
            mensaje: "Error inesperado",
            salida: null
        }
    },
    advertencia: function (msj) {
        return {
            status: 4,
            mensaje: msj,
            salida: null
        }
    },
    no_encontro: function (msj) {
        return {
            status:5,
            mensaje: msj,
            salida: null
        }
    },
    ya_existe: function (r){
        return {
            status:6,
            mensaje: "El registro ya existe",
            salida: r
        }
    }
};

module.exports = salidas;