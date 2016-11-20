var express = require("express");
var ClientesRouter = express.Router();
var Clientes = require("../models/Clientes");
var Salidas = require("../utils/salidas");
var moment = require("moment");

//Ver listado de clientes
ClientesRouter.get("/", function (req,res) {
    Clientes.find(function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });
});

//Ver listado de clientes
ClientesRouter.get("/listado", function (req,res) {
    Clientes.find({},{"_id": 1, "nombre":1,"apellido":1,"sexo": 1, "edad":1, "fechanac": 1, email:"1"},function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });
});

//Ver cliente por id
ClientesRouter.get("/:id", function (req,res) {
    Clientes.findOne({"_id":req.params.id}, function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.inesperado());
    });
});

//Ver cliente por id resumido
ClientesRouter.get("/resumido/:id", function (req,res) {
    Clientes.findOne({"_id":req.params.id},{"nombre": 1, "apellido": 1, "fechanac": 1, "_id": 1}, function (err,save) {
        if(err) res.json(Salidas.error(err));
        else if (save) res.json(Salidas.exito(save));
        else res.json(Salidas.no_encontro());
    });
});

//Ver tratamientos por clientes
ClientesRouter.get("/tratamientos/:id", function (req,res){
    // Clientes.find({"_id":req.params.id, "tratamientos.finalizado": false}, {"tratamientos":1, "_id":0, "nombre": 1, "apellido":1}, function (err,save){
    //     if(err) res.json(Salidas.error(err));
    //     else if (save.length) res.json(Salidas.exito(save));
    //     else if (!save.length) res.json(Salidas.no_encontro("El cliente no existe o no tiene tratamientos"));
    //     else res.json(Salidas.inesperado());
    //
    // });
    Clientes.aggregate(
        {"$match":{"_id":parseInt(req.params.id)}},
        {"$unwind": "$tratamientos"},
        {"$match":{"tratamientos.finalizado":false}},
        {"$project": {
            "tratamientos": 1
        }}, function (err,save) {
            if (err) res.json(Salidas.error(err));
            else if (save.length) res.json(Salidas.exito(save));
            else if (!save.length) res.json(Salidas.no_encontro("No hay tratamientos para este cliente"));
            else res.json(Salidas.inesperado());
        }
    );
});

//Crear cliente
ClientesRouter.post("/crear", function (req,res) {
    console.log(req.body.motivo_consulta);

    var obj = {
        _id: req.body._id, //En lugar de cedula
        clave: req.body.clave || 1234,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad:  parseInt(moment(req.body.fechanac).toNow(true)),
        sexo: req.body.sexo,
        fechanac: req.body.fechanac,
        ocupacion: req.body.ocupacion,
        profesion: req.body.profesion,
        estado_civil: req.body.estado_civil,
        //familiar: req.body.familiar,
        direccion: req.body.direccion,
        telefono_hab: req.body.telefono_hab,
        telefono_ofic: req.body.telefono_ofic,
        celular: req.body.celular,
        email: req.body.email,
        //Evaluacion clinica estetica
        evaluacion_clinica: {
            hipertersion_arterial: req.body.evaluacion_clinica.hipertersion_arterial,
            hipotension: req.body.evaluacion_clinica.hipotension,
            diabetes: req.body.evaluacion_clinica.diabetes,
            renal: req.body.evaluacion_clinica.renal,
            cardiopatio: req.body.evaluacion_clinica.cardiopatio,
            circulacion: req.body.evaluacion_clinica.circulacion,
            anticon_oral: req.body.evaluacion_clinica.anticon_oral,
            tras_mens: req.body.evaluacion_clinica.tras_mens, //Buscar explicacion de mama
            f_u_r: req.body.evaluacion_clinica.f_u_r, //Buscar explicacion de mama
            d_i_u: req.body.evaluacion_clinica.d_i_u, //Buscar explicacion de mama
            tiroides: req.body.evaluacion_clinica.tiroides,
            epilepsia: req.body.evaluacion_clinica.epilepsia,
            lupus: req.body.evaluacion_clinica.lupus,
            problemas_digestivos: req.body.evaluacion_clinica.problemas_digestivos,
            estrenimiento: req.body.evaluacion_clinica.estrenimiento,
            hepatitis: req.body.evaluacion_clinica.hepatitis,
            cancer: req.body.evaluacion_clinica.cancer,
            prob_urinarios: req.body.evaluacion_clinica.prob_urinarios,
            rete_liquidos: req.body.evaluacion_clinica.rete_liquidos,
            prob_respiratorios: req.body.evaluacion_clinica.prob_respiratorios,
            asma: req.body.evaluacion_clinica.asma,
            marcapasos: req.body.evaluacion_clinica.marcapasos,
            alergias: req.body.evaluacion_clinica.alergias,
            medicamentos: req.body.evaluacion_clinica.medicamentos,
            antecedentes_dermat: req.body.evaluacion_clinica.antecedentes_dermat,
            herpes: req.body.evaluacion_clinica.herpes,
            hongos: req.body.evaluacion_clinica.hongos,
            otros: req.body.evaluacion_clinica.otros,
            cirugias: req.body.evaluacion_clinica.cirugias,
            cesareas: req.body.evaluacion_clinica.cesareas,
            complicaciones: req.body.evaluacion_clinica.complicaciones,
            recibido_anestesia: req.body.evaluacion_clinica.recibido_anestesia,
            implantes: {
                recibido_implantes: req.body.evaluacion_clinica.implantes.recibido_implantes,
                area: req.body.evaluacion_clinica.implantes.area,
                tiempo: req.body.evaluacion_clinica.implantes.tiempo,
                tipo: req.body.evaluacion_clinica.implantes.tipo
            },
            lentes_contacto: req.body.evaluacion_clinica.lentes_contacto,
            otros_aparatos: req.body.evaluacion_clinica.otros_aparatos,
            medicamentos_actual: req.body.evaluacion_clinica.medicamentos_actual,
            fuma: req.body.evaluacion_clinica.fuma,
            toma: req.body.evaluacion_clinica.toma,
            productos_utilizados: req.body.evaluacion_clinica.productos_utilizados,
            peeling: {
                realizado_antes: req.body.evaluacion_clinica.peeling.realizado_antes,
                cuando: req.body.evaluacion_clinica.peeling.cuando
            },
            productos_en_casa: req.body.evaluacion_clinica.productos_en_casa
        },
        //Motivo de consulta
        motivo_consulta: {
            tipo_piel: req.body.motivo_consulta.tipo_piel,
            fototipo_piel: req.body.motivo_consulta.fototipo_piel,
            manchas: req.body.motivo_consulta.manchas,
            arrugas: req.body.motivo_consulta.arrugas,
            talqangestasia: req.body.motivo_consulta.talqangestasia,
            arrugas_profundas: req.body.motivo_consulta.arrugas_profundas,
            dx: req.body.motivo_consulta.dx
        }
    };

    var newCliente = new Clientes(obj);
    newCliente.save(function (err,save) {
        if(err) res.json(Salidas.error(err));
        else res.json(Salidas.exito("Cliente guardado exitosamente"));
    });

});

ClientesRouter.post("/editar", function (req,res) {

    // var obj = {
    //     _id: req.body._id, //En lugar de cedula
    //     clave: req.body.clave || 1234,
    //     nombre: req.body.nombre,
    //     apellido: req.body.apellido,
    //     edad:  parseInt(moment(req.body.fechanac).toNow(true)),
    //     sexo: req.body.sexo,
    //     fechanac: req.body.fechanac,
    //     ocupacion: req.body.ocupacion,
    //     profesion: req.body.profesion,
    //     estado_civil: req.body.estado_civil,
    //     //familiar: req.body.familiar,
    //     direccion: req.body.direccion,
    //     telefono_hab: req.body.telefono_hab,
    //     telefono_ofic: req.body.telefono_ofic,
    //     celular: req.body.celular,
    //     email: req.body.email,
    //     //Evaluacion clinica estetica
    //     evaluacion_clinica: {
    //         hipertersion_arterial: req.body.evaluacion_clinica.hipertersion_arterial,
    //         hipotension: req.body.evaluacion_clinica.hipotension,
    //         diabetes: req.body.evaluacion_clinica.diabetes,
    //         renal: req.body.evaluacion_clinica.renal,
    //         cardiopatio: req.body.evaluacion_clinica.cardiopatio,
    //         circulacion: req.body.evaluacion_clinica.circulacion,
    //         anticon_oral: req.body.evaluacion_clinica.anticon_oral,
    //         tras_mens: req.body.evaluacion_clinica.tras_mens, //Buscar explicacion de mama
    //         f_u_r: req.body.evaluacion_clinica.f_u_r, //Buscar explicacion de mama
    //         d_i_u: req.body.evaluacion_clinica.d_i_u, //Buscar explicacion de mama
    //         tiroides: req.body.evaluacion_clinica.tiroides,
    //         epilepsia: req.body.evaluacion_clinica.epilepsia,
    //         lupus: req.body.evaluacion_clinica.lupus,
    //         problemas_digestivos: req.body.evaluacion_clinica.problemas_digestivos,
    //         estrenimiento: req.body.evaluacion_clinica.estrenimiento,
    //         hepatitis: req.body.evaluacion_clinica.hepatitis,
    //         cancer: req.body.evaluacion_clinica.cancer,
    //         prob_urinarios: req.body.evaluacion_clinica.prob_urinarios,
    //         rete_liquidos: req.body.evaluacion_clinica.rete_liquidos,
    //         prob_respiratorios: req.body.evaluacion_clinica.prob_respiratorios,
    //         asma: req.body.evaluacion_clinica.asma,
    //         marcapasos: req.body.evaluacion_clinica.marcapasos,
    //         alergias: req.body.evaluacion_clinica.alergias,
    //         medicamentos: req.body.evaluacion_clinica.medicamentos,
    //         antecedentes_dermat: req.body.evaluacion_clinica.antecedentes_dermat,
    //         herpes: req.body.evaluacion_clinica.herpes,
    //         hongos: req.body.evaluacion_clinica.hongos,
    //         otros: req.body.evaluacion_clinica.otros,
    //         cirugias: req.body.evaluacion_clinica.cirugias,
    //         cesareas: req.body.evaluacion_clinica.cesareas,
    //         complicaciones: req.body.evaluacion_clinica.complicaciones,
    //         recibido_anestesia: req.body.evaluacion_clinica.recibido_anestesia,
    //         implantes: {
    //             recibido_implantes: req.body.evaluacion_clinica.implantes.recibido_implantes,
    //             area: req.body.evaluacion_clinica.implantes.area,
    //             tiempo: req.body.evaluacion_clinica.implantes.tiempo,
    //             tipo: req.body.evaluacion_clinica.implantes.tipo
    //         },
    //         lentes_contacto: req.body.evaluacion_clinica.lentes_contacto,
    //         otros_aparatos: req.body.evaluacion_clinica.otros_aparatos,
    //         medicamentos_actual: req.body.evaluacion_clinica.medicamentos_actual,
    //         fuma: req.body.evaluacion_clinica.fuma,
    //         toma: req.body.evaluacion_clinica.toma,
    //         productos_utilizados: req.body.evaluacion_clinica.productos_utilizados,
    //         peeling: {
    //             realizado_antes: req.body.evaluacion_clinica.peeling.realizado_antes,
    //             cuando: req.body.evaluacion_clinica.peeling.cuando
    //         },
    //         productos_en_casa: req.body.evaluacion_clinica.productos_en_casa
    //     },
    //     //Motivo de consulta
    //     motivo_consulta: {
    //         tipo_piel: req.body.motivo_consulta.tipo_piel,
    //         fototipo_piel: req.body.motivo_consulta.fototipo_piel,
    //         manchas: req.body.motivo_consulta.manchas,
    //         arrugas: req.body.motivo_consulta.arrugas,
    //         talqangestasia: req.body.motivo_consulta.talqangestasia,
    //         arrugas_profundas: req.body.motivo_consulta.arrugas_profundas,
    //         dx: req.body.motivo_consulta.dx
    //     }
    // };

    req.body.edad = parseInt(moment(req.body.fechanac).toNow(true));

    Clientes.findOneAndUpdate({_id: req.body._id}, req.body, function (err, save) {
        if (err) {
            res.json(Salidas.error(err));
        } else if (save) {
            res.json(Salidas.exito(save));
        } else {
            res.json(Salidas.inesperado());
        }
    });

});

//Eliminar empleado
ClientesRouter.delete("/borrar/:id", function (req, res) {
    Clientes.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.json(Salidas.error(err));
        } else {
            res.json(Salidas.exito("Cliente con ID " + req.params.id + " borrado"));
        }
    });
});

module.exports = ClientesRouter;