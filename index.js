require("dotenv").config();

const express = require("express");
const {leerTareas,crearTarea,editarEstadoTarea,editarTextoTarea,borrarTarea} = require("./db");
const {json} = require("body-parser");


const servidor = express();

servidor.use(json());

servidor.use("/pruebas-api",express.static("./pruebas_api"));


servidor.get("/tareas", async (peticion,respuesta,siguiente) => {
    let [error,tareas] = await leerTareas();
    if(error){
        return siguiente(2);
    }
    respuesta.json(tareas);
});

servidor.post("/nueva", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;
    if(!tarea){
        return siguiente(1);
    }
    let [error,id] = await crearTarea(tarea);
    if(error){
        return siguiente(2);
    }
    respuesta.json({ resultado : "ok", id});


    respuesta.send("...peticion POST");
});

servidor.delete("/eliminar/:id([0-9]{1,9})", async (peticion,respuesta) => {
    let id = Number(peticion.params.id);
    let [error,count] = await borrarTarea(id);
    if(error){
        return siguiente(2);
    }
    respuesta.json({resultado : await count > 0 ? "ok" : "ko" });
});

servidor.use((error,peticion,respuesta,siguiente) => {
    // cualquier exceptcion que envie el sistema (throw) será capturada por este middleware
    switch(error){
        case 1: 
            respuesta.status(400);
            return respuesta.json({ error : "error en la petición, faltan parámetros" });
        case 2:
            respuesta.status(500);
            return respuesta.json({ error : "error en el servidor" });
        default:
            respuesta.status(400);
            return respuesta.json({ error : "error en la petición, objeto JSON mal formado" });
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado" });
});



servidor.listen(process.env.PORT);