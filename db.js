require("dotenv").config();

const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function leerTareas(){
    return new Promise(async callback => {
        let conexion = conectar();

        try{
            let tareas = await conexion`SELECT * FROM tareas`;
            

            conexion.end();

            callback([null,tareas]);

        }catch(error){

            callback([error]);

        }finally{
            conexion.end();
        }
    });
}
/*
leerTareas().then(arrayResultado => {
    console.log(arrayResultado);
});
*/

function crearTarea(textoTarea){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${textoTarea}) RETURNING id`;

            conexion.end();

            callback([null,id]);

        }catch(error){

            callback([error]);
        
        }finally{
            conexion.end();
        }
    });
}
/*
crearTarea("Aprender React").then(arrayResultado => {
    console.log(arrayResultado);
});
*/

function editarTextoTarea(id,textoTarea){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion`UPDATE tareas SET tarea = ${textoTarea} WHERE id = ${id}`;

            callback([null,count]);

        }catch(error){

            callback([error]);
        
        }finally{
            conexion.end();
        }
    });
}
/*
editarTextoTarea("1,Terminar Express").then(arrayResultado => {
    console.log(arrayResultado);
});
*/
function editarEstadoTarea(id){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`;

            callback([null,count]);

        }catch(error){

            callback([error]);
        
        }finally{
            conexion.end();
        }
    });
}
/*
editarEstadoTarea(1).then(arrayResultado => {
    console.log(arrayResultado);
});
*/
function borrarTarea(id){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`;

            callback([null,count]);

        }catch(error){

            callback([error]);
        
        }finally{
            conexion.end();
        }
    });
}
/*
borrarTarea(2).then(arrayResultado => {
    console.log(arrayResultado);
});
*/

module.exports = {leerTareas,crearTarea,editarEstadoTarea,editarTextoTarea,borrarTarea};
