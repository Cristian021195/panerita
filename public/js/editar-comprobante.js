import {mensaje} from './popups.js';
import { tablaDinamica } from './helpers/tablaDinamica.js';
import { Mensaje } from './helpers/errores.js';
import { loader } from './helpers/loader.js';
export function existeEditarComprobante(data, id_comprobante){
    //DOM GLOBALES
    const $cliente = document.getElementById('d_cliente');
    const $table = document.createElement('table');
    const $tbody = document.createElement('tbody');
    const $tablaDetalle = document.createElement('table');
    const $sectionFirstModal = document.getElementById('sectionFirstModal');
    const $editarComprobante = document.getElementById('editarComprobante');
    const $generarComprobanteButton = document.getElementById('generarComprobanteButton');
    const $sectionSecond = document.getElementById('sectionSecond');
    const $stock = document.getElementById('stock');
    const $modal_loader = document.getElementById('modal_loader');
    const $error = document.getElementById('error');
    const $loader = document.getElementById('loader');


    $table.classList.add('table'); $table.classList.add('table-striped');
    $tablaDetalle.classList.add('table'); $tablaDetalle.classList.add('table-striped');

    let comprobante;
    let previo = [];
    let siguiente = [];
    const LISTADO_PRODUCTOS = [];


    $cliente.value = data[1][0].cliente;

    listadoDeProductos();

    listadoDeDetalles(id_comprobante);

    //STOCK
    stockOnline();
    let liveStock = setInterval(() => {
        stockOnline();
    }, 3000);

    window.onpopstate = (e)=>{
        console.log('matamos interval');
        clearInterval(liveStock);
    }

    document.body.addEventListener('click', (e)=>{
        if(e.target.href != undefined){
            console.log('matamos interval');
            clearInterval(liveStock);
        }
    });

    async function stockOnline(){
        try {
            const data = await fetch('/panerita/ajax/stock/listado-stock-get.php');
            const resp = await data.json();
            $stock.innerHTML = '';
            $stock.appendChild(tablaDinamica(resp, 'Stock Online'));
        } catch (error) {
            clearInterval(liveStock);
            $stock.innerHTML = `<h4 class="text-danger">Error: ${error}</h4>`;
        }
    }

    $editarComprobante.addEventListener('submit', (e)=>{
        e.preventDefault();
        let datos = new FormData($editarComprobante);
        datos.append('id_comprobante', id_comprobante);
        datos.append('detalle', data[2].length);

        fetch('/panerita/ajax/comprobantes/eliminar-vacio.php', {
            method:'POST',
            body: datos
        }).then(res=>res.json()).then(res=>{
            if(!res.error){
                history.back();
            }
        }).catch(err=>{
            alert('!Error de BBDD o servidor, reintente, si persiste comuniquese con el administrador¡ '+err);
        })

        //history.back();
    });


    //LISTADO DE DETALLES
    function listadoDeDetalles(id_comprobante){
        if(data[2].length > 0){
            data[2].forEach(det => {
                //detalle.push(det);
                previo.push(det);
                siguiente.push(det);
            });
            $tablaDetalle.innerHTML = ''; $tbody.innerHTML = '';//console.log(crearCabeceraDetalle(Object.keys(data[2][0])));
            $tablaDetalle.appendChild(crearCabeceraDetalle(Object.keys(data[2][0])));
            $tablaDetalle.appendChild(crearCuerpoDetalle(previo));
            $sectionSecond.appendChild($tablaDetalle);
            agregarEventosDetalle();
        }//console.log(detalle);
    }

    function crearCabeceraDetalle(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML = `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>ELIMINAR</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }        
    }

    function crearCuerpoDetalle(datos){
        if(datos != null){
            let $tbody = document.createElement('tbody');
            datos.forEach(dat =>{
                $tbody.innerHTML += `<tr data-producto="${dat.id_producto}" data-locked="${dat.locked}">
                <td>${dat.producto}</td>
                <td>${dat.cantidad}</td>
                <td>${dat.devolucion}</td>
                <td>${dat.precio}</td>
                <td><button class="btn eliminar" data-fecha="${dat.fecha}">❌</button></td>
                </tr>`;
            });            
            return $tbody;
        }else{
            return $alert;
        }
    }


    function agregarEventos(){
        document.querySelectorAll('.agregar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                //$error.appendChild(Mensaje(id.target));
                const $fila = id.target.parentNode.parentNode.querySelectorAll('td');
                //let id_producto = $fila[0];
                let add_data = new FormData();
                add_data.append('id_producto', id.target.id);
                add_data.append('id_comprobante', id_comprobante);
                add_data.append('cantidad', $fila[1].firstElementChild.value);
                add_data.append('devolucion', $fila[2].firstElementChild.value);
                add_data.append('precio', $fila[3].firstElementChild.value);

                if(add_data.get('cantidad') == 0 && add_data.get('devolucion') == 0){
                    $error.appendChild(Mensaje('¡No pueden ser cantidad y devolucion iguales a cero!', false));
                }else{
                    $modal_loader.appendChild(loader(30,1));
                    fetch('/panerita/ajax/stock/agregar-stock-simple.php', {
                        method: 'POST',
                        body: add_data
                    }).then(res=>res.json())
                    .then(res=>{
                        $modal_loader.innerHTML = '';
                        if(res.error){
                            $error.appendChild(Mensaje(res.mensaje, false));
                        }else{
                            let datos = new FormData(); datos.append('id_comprobante', id_comprobante);
                            fetch('/panerita/ajax/comprobantes/obtener-comprobante.php', {
                                method: 'POST',
                                body: datos
                            })
                            .then(resp => {return resp.json()})
                            .then(resp => {
                                if(resp.length > 0){                                
                                    $sectionSecond.innerHTML = ''; $tablaDetalle.innerHTML = '';
                                    $tablaDetalle.appendChild(crearCabeceraDetalle(Object.keys(data[2][0])));
                                    $tablaDetalle.appendChild(crearCuerpoDetalle(resp[2]));
                                    $sectionSecond.appendChild($tablaDetalle);
                                    agregarEventosDetalle();
                                }else{
                                    $error.appendChild(Mensaje('Sin productos cargados...', false));
                                }
                            })
                            .catch(error =>{
                                $modal_loader.innerHTML = '';
                                alert('Error al conectar BBDD, intente nuevamente, si persiste llame');
                            })
                        }
                    })
                    .catch(err=>{
                        $modal_loader.innerHTML = '';
                        $error.appendChild(Mensaje(err, true));
                    })

                }
            });
        });
    }

    function listadoEnMemoria(detalle){
        $tablaDetalle.innerHTML=''; $tablaDetalle.innerHTML='';
        if(detalle.length > 0){
            $tablaDetalle.appendChild(crearCabeceraDetalle(Object.keys(detalle[0])));
            $tablaDetalle.appendChild(crearCuerpoDetalle(detalle));
            $sectionSecond.appendChild($tablaDetalle);
            agregarEventosDetalle();
        }
    }

    function agregar(id){
        let row = id.parentNode.parentNode.querySelectorAll('td');
        let productoObj = {
            producto:null,
            cantidad:null,
            devolucion:null,
            precio:null,
            total:null,
            id_producto:null
        }

        productoObj.id_producto = parseInt(id.id);
        productoObj.producto = row[0].textContent;
        productoObj.cantidad = parseInt(row[1].firstElementChild.value);
        productoObj.devolucion = parseInt(row[2].firstElementChild.value);
        productoObj.precio = parseFloat(row[3].firstElementChild.value);

        siguiente.push(productoObj);
        //DETALLE_EDIT.siguiente = arr

        id.setAttribute("disabled",true);
        chequearProductos();
        listadoEnMemoria(siguiente);
    }

    function chequearProductos(){
        if(siguiente.length == 0){
            $generarComprobanteButton.setAttribute('disabled', true);
        }else{
            $generarComprobanteButton.removeAttribute('disabled');    
        }
    }

    function cancelar(id){
        let row = id.parentNode.parentNode.querySelectorAll('td');
        let obj = row[4].children[0].id;
        quitarDeArreglo(obj, productos);

        row[4].children[0].removeAttribute("disabled");
        row[1].firstElementChild.value = null; row[2].firstElementChild.value = null;
        chequearProductos();
    }


    function agregarEventosDetalle(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                eliminarDetalle(id.target);
            });
        });
    }

    function bloquearBotonEliminar(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.setAttribute('disabled', true);
        });
    }
    function desbloquearBotonEliminar(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.removeAttribute('disabled');
        });
    }

    function eliminarDetalle(id){
        bloquearBotonEliminar();
        let row = id.parentNode.parentNode.querySelectorAll('td');
        let id_producto = row[0].parentNode.dataset.producto;
        let cantidad = parseInt(row[1].textContent);
        let devolucion = parseInt(row[2].textContent);
        let total = parseFloat(row[3].textContent * cantidad);
        let elem = row[0].textContent;
        let fecha = id.dataset.fecha;

        let data = new FormData();
        data.append('id_producto', id_producto);
        data.append('id_comprobante', id_comprobante);
        data.append('cantidad', cantidad + devolucion);
        data.append('total', total);
        data.append('fecha', fecha);
        $loader.appendChild(loader(60,2)); //appendChild(loader(100,1));
        

        

        fetch('/panerita/ajax/stock/eliminar-stock-simple.php', {
            method: 'POST',
            body: data
        }).then(res=>res.json()).then(res=>{
            $loader.innerHTML = '';
            if(!(res.error)){
                desbloquearBotonEliminar();
                siguiente = quitarDetalleSiguiente(id_producto, siguiente);
                id.parentElement.parentElement.remove();
                alertify.success('¡Eliminado!');
            }else{
                alertify.error('Eror de edicion en server..');
            }
        }).catch(err=>{
            $loader.innerHTML = '';
            $loader.appendChild(Mensaje(err, true));
            desbloquearBotonEliminar();
        })
    }

    function quitarDetalleSiguiente(id_producto, arreglo){
        let arr = [];
        arreglo.forEach(e=>{
            if(e.id_producto != id_producto){
                arr.push(e);
            }
        })
        chequearProductos();
        return arr;
    }
    async function devolverStock(id_producto, cantidad){
        let datos = new FormData();
        datos.append('id_producto', id_producto)
        datos.append('cantidad', cantidad)
        try {
            let data = await fetch('/panerita/ajax/stock/devolver-stock.php',{
                method:'POST',
                body:datos
            });
            let resp = await data.json();
            if(resp.error){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            alertify.error(error);
        }
    }


    //PARTE 4 PRODUCTOS TMP TEMPORALES
    async function listadoDeProductos(){
        let datos = new FormData();
        datos.append('tipo', data[1][0].tipo);
        try{
            let respuesta = await fetch('/panerita/ajax/productos/listado-productos.php', {
                method: 'POST',
                body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                $table.innerHTML = ''; $tbody.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));
                $sectionFirstModal.appendChild($table);
                agregarEventos();
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }
    function crearCabecera(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr>
                    <th>${_cabecera[1]}</th>
                    <th>CANTIDAD</th>
                    <th>DEVOLUCION</th>
                    <th>${_cabecera[2]}</th>
                    <th>AGREGAR</th>
                    </tr>`;
            return $thead;
        }else{
            return $alert;
        }        
    }
    function crearCuerpo(cabecera){
        cabecera.forEach(e=>{
            LISTADO_PRODUCTOS.push(e);
            $tbody.innerHTML += `<tr>
            <td>${e.nombre}</td>
            <td class="sm-number"><input type="number" name="cantidad" min="0" value="0"></td>
            <td class="sm-number"><input type="number" name="devolucion" min="0" value="0"></td><td><input type="number" name="precio" min="0" value="${e.precio}"></td>
            <td><button class="btn btn-success agregar" id="${e.id_producto}">➕</button></td>
            </tr>`;
            //<button class="btn cancelar">❌</button>
        });
        return $tbody;
    }

}