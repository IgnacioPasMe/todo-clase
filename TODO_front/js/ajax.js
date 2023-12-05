function ajax (url,metodo,datos){
    let configuracion = !metodo ? null : { method : metodo };
    
    if(datos){
        configuración.body = JSON.stringify(datos);
        configuración.headers = { "content-type" : "application/json" };
    }

    return fetch(url,configuracion).then(respuesta => respuesta.json());
}