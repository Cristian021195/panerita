export function obtenerFecha(){
    let _fecha = new Date(Date.now());
    let $fecha =
    _fecha.getUTCFullYear() + "-" +
    ("0" + (_fecha.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + (_fecha.getUTCDate())).slice(-2)

    return $fecha;
}