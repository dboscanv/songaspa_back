var metodos = {
    nulo: function () {
        if (arguments.length <= 0) {
            return true;
        } else {
            for (var x = 0; x < arguments.length; x++) {
                console.log("Argumento " + x + arguments[x]);
                if (typeof arguments[x] === 'undefined' || arguments[x] == null) {
                    return "Faltan datos";
                }
            }
            return true;
        }
    },
    numeros: function () {
        if (arguments.length <= 0) {
            console.log("Entor donde no hay argumentos");
            return true;
        } else {
            console.log("Entro al for obvio");
            for (var x = 0; x < arguments.length; x++) {
                console.log(typeof arguments[x] !== "number");
                if (typeof arguments[x] !== "number") {
                    console.log(typeof arguments[x]);
                    console.log("retornar el string");
                    return "Se esperaba un numero";
                }
            }
            return true;
        }

    }
};

module.exports = metodos;
