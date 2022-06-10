import {obtenerFecha} from './fecha.js';
import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
export function existeVenta(){
    //DOM GLOBALES
    const $sectionFirst = document.getElementById('sectionFirst');
    const $error = document.getElementById('error');
    const $consultarVentas = document.getElementById('consultarVentas');
    const $producto = document.getElementById('producto');
    const $table = document.createElement('table');$table.classList.add('table'); $table.classList.add('table-striped');
    const $cuerpoVentas = document.getElementById('cuerpoVentas');
    const $hasta = document.getElementById('hasta'); const $desde = document.getElementById('desde');

    listadoDeProductos();
    //ASIGNACIONES
    $hasta.setAttribute('max', obtenerFecha());
    $desde.setAttribute('max', obtenerFecha());

    //SUPERADMIN
    if(JSON.parse(localStorage.getItem('datos')).zona == 'super'){
        let $labelZona = document.createElement('label'); $labelZona.classList.add('form-label'); $labelZona.textContent = 'Zona'; $labelZona.setAttribute('for', 'zona');
        let $seleccionZona = document.createElement('select'); $seleccionZona.classList.add('form-select'); $seleccionZona.id = 'zona'; $seleccionZona.setAttribute('name', 'zona');

        $seleccionZona.innerHTML = '<option value="catamarca">Catamarca</option><option value="tucuman">Tucuman</option>';
        $cuerpoVentas.appendChild($labelZona); $cuerpoVentas.appendChild($seleccionZona);
    }


    //LISTADO DE PRODUCTOS INICIAL
    async function listadoDeProductos(){
        try{
            let respuesta = await fetch('/panerita/ajax/productos/listado-productos.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                res.forEach(prod => {
                    $producto.innerHTML += `<option value="${prod.id_producto}">${prod.nombre} (${prod.zona})</option>`;
                });
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    $consultarVentas.addEventListener('submit', (e)=>{
        e.preventDefault();

        let datos = new FormData($consultarVentas);
        if(datos.get('desde') != '' && datos.get('hasta') != ''){
            fetch('/panerita/ajax/ventas/listado-ventas.php', {
                method: 'POST',
                body: datos
            }).then(res => {return res.json()})
            .then(res => {
                if(!res.error && res.length > 0 && res[0].total != null){
                    let ventas = 0; let devoluciones = 0;
                    $table.innerHTML = ''; $sectionFirst.innerHTML = '';
                    $table.appendChild(crearCabecera(Object.keys(res[0])));
                    $table.appendChild(crearCuerpo(res));
                    $sectionFirst.appendChild($table);

                    res.forEach(cont =>{
                        devoluciones += parseInt(cont.devoluciones);
                        ventas += parseInt(cont.ventas);
                    });
                    document.querySelector('.pagado').textContent = `Ventas: ${ventas}`;
                    document.querySelector('.deudor').textContent = `Devoluciones: ${devoluciones}`;
                }else{
                    $table.innerHTML = ''; $sectionFirst.innerHTML = '';
                    document.querySelector('.pagado').textContent = ''; document.querySelector('.deudor').textContent = '';

                    $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b>¡No hay ventas del / los producto(s), verifique fechas tambien!<br></div>`;                    
                    mensaje($error);
                }
            }).catch(err=>{
                $error.innerHTML = '';
                $error.appendChild(Mensaje(err, 1000));
            });
        }else{
            $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ¡Llene las fechas! <br></div>`;
            mensaje($error);
        }
    })

    //FUNCIONES AUXILIARES
    function crearCabecera(res){
        if(res != null){
            let $thead = document.createElement('thead');
            let _res = res.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_res[0]}</th><th>${_res[1]}</th><th>${_res[2]}</th><th>${_res[3]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }
        
    }
    function crearCuerpo(res){
        let $tbody = document.createElement('tbody');
        res.forEach(row=>{
            $tbody.innerHTML += `<tr><td>${row.producto}</td><td>${row.ventas}</td><td>${row.devoluciones}</td><td>${row.total}</td></tr>`;
        });
        return $tbody;
    }
}