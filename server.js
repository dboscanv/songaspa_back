//Dependencias
var express = require("express"); //framework de nodejs
var bodyParser = require("body-parser"); //parsear las respuestas del body a json
var mongoose = require("mongoose"); //framework para trabajar con MongoDB
var moment = require("moment");
var morgan = require("morgan");
//var jsonwebtoken = require("jsonwebtoken");

//Instanciacion de express
var app = express();

//Instanciacion de modelos
var Clientes = require("./models/Clientes");
var Empleados = require("./models/Empleados");
var Citas = require("./models/Citas");
var Honorarios = require("./models/Honorarios");
var Trabajos = require("./models/Trabajos");
//var Tratamientos = require("./models/Tratamientos"); Quitado para probarlo en la ficha del cliente normal

//Conexion con MONGODB
//"mongodb://123:123@ds033096.mlab.com:33096/heroku_j1qtvrq8"
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/songadb");

//Ruta estatica
app.use(express.static(__dirname + "public"));

//Rutas de las peticiones
var EmpleadosRouter = require("./routes/EmpleadosRouter");
var CitasRouter = require("./routes/CitasRouter");
var TrabajosRouter = require("./routes/TrabajosRouter");
var ClientesRouter = require("./routes/ClientesRouter");
var TratamientosRouter = require("./routes/TratamientosRouter");
var LoginRouter = require("./routes/LoginRouter");
var HonorariosRouter = require("./routes/HonorariosRouter");
var PagosRouter = require("./routes/PagosRouter");

//Configuracion
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan ("dev"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

//Confiuguracion rutas
app.use("/empleados", EmpleadosRouter);
app.use("/citas", CitasRouter);
app.use("/trabajos", TrabajosRouter);
app.use("/clientes", ClientesRouter);
app.use("/tratamientos", TratamientosRouter);
// app.use("/tratamientos", TratamientosRouter);
app.use("/login", LoginRouter);
app.use("/honorarios", HonorariosRouter);
app.use("/pagos", PagosRouter);

app.get("/", function (req,res) {
    res.json({
        msj: "Hola mundo"
    });
});

app.listen(app.get("port"), function () {
    console.log("Servidor funcionando por puerto " + app.get("port"));
});
