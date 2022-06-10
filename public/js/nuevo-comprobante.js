import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
import { tablaDinamica } from './helpers/tablaDinamica.js';
import { loader } from './helpers/loader.js';
export function existeNuevoComprobante(){
    
    //DOM GLOBALES
    const $error = document.getElementById('error');
    const $input = document.getElementById('f_cliente');
    const $filtrarClientes = document.getElementById('filtrarClientes');
    const $clienteRes = document.getElementById('cliente-res');
    const $tipo = document.getElementById('tipo');
    const $zona = document.getElementById('zona');
    const $vendedorRes = document.getElementById('vendedor-res');
    const $sectionFirstModal = document.getElementById('sectionFirstModal');
    const $sectionSecond = document.getElementById('sectionSecond');
    const $listado = document.getElementById('listado');
    const $generarComprobante = document.getElementById('generarComprobante');
    const $generarComprobanteButton = document.getElementById('generarComprobanteButton');
    const $nuevoComprobante = document.getElementById('nuevoComprobante');
    const $table = document.createElement('table');
    const $tbody = document.createElement('tbody');
    const $sectionAux = document.getElementById('sectionAux');
    const $stock = document.getElementById('stock');
    const $error_loader = document.getElementById('error_loader');
    $table.classList.add('table'); $table.classList.add('table-striped');

    const $nuevoCliente = document.getElementById('nuevoCliente');
    const $producto = document.getElementById('producto');

    let productos = [];
    let detalle = [];

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
    })
    

    //FILTRADO PRODUCTOS
    $producto.addEventListener('input', (e)=>{
        if(e.target.value.length >= 1){
            filtradoDeProductos();
        }else if(e.target.value.length == 0){
            listadoDeProductos();
        }
    });

    //CARGAR CLIENTE 
    $nuevoCliente.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($nuevoCliente);
        nuevoCliente(datos);      
        $nuevoCliente.reset();
    });

    async function stockOnline(){
        try {
            const data = await fetch('/panerita/ajax/stock/listado-stock-get.php');
            const resp = await data.json();
            $stock.innerHTML = '';
            $stock.appendChild(tablaDinamica(resp, 'Stock Online'));
        } catch (error) {
            //console.log(error)
            $stock.innerHTML = '<h4 class="text-danger">¡Error al cargar datos!</h4>';
            clearInterval(liveStock);
        }
    }

    async function nuevoCliente(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/clientes/cargar-cliente.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Guardada!');//
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //PARTE 1 CLIENTES
    //FILTRAR CLIENTES
    chequearClientesUsuarios(false);
    $input.addEventListener('input', (e=>{
        $clienteRes.innerHTML = ``;
        if(e.target.value.length >= 3 && e.target.value.length <= 16){
            let datos = new FormData($filtrarClientes);
            datos.append('tipo', 'todos');
            fetch('/panerita/ajax/clientes/filtrado-clientes.php', {
                method: 'POST',
                body: datos
            })
            .then(res => {return res.json()})
            .then(res => {
                if(res.length != 0){
                    chequearClientesUsuarios(true);
                    res.forEach(cli => {
                        $clienteRes.innerHTML += `<option value="${cli.id_cliente}" class="${cli.tipo}" data-zona="${cli.zona}">${cli.nombre} (${cli.tipo} - ${cli.zona})</option>`;
                    });
                    if($clienteRes.hasChildNodes() && $vendedorRes.hasChildNodes()){
                        $tipo.value = $clienteRes.firstElementChild.classList[0];
                        $zona.value = $clienteRes.firstElementChild.dataset.zona;
                        $clienteRes.addEventListener('change',(e)=>{
                            $tipo.value = document.querySelector(`option[value='${e.target.value}']`).classList[0];
                            $zona.value= document.querySelector(`option[value='${e.target.value}']`).dataset.zona;
                            listadoDeProductos();
                        });
                        listadoDeProductos();
                    }
                }else{
                    //$table.innerHTML = '<div class="alert alert-danger">¡No hay Cliente!</div>';
                }
            }).catch(err=>{
                alert('Sin conexion a la bbdd, intente de nuevo en un momento, si persiste comuniquese con el administrador');
            })
        }else if(e.target.value.length <= 3){
            $clienteRes.innerHTML = ``;//listadoDeClientes();
            chequearClientesUsuarios(false);
        }
    }));

    //PARTE 2 USUARIOS
    listadoDeUsuarios();

    //LISTADO DE USUARIOS INICIAL
    async function listadoDeUsuarios(){
        try{
            let respuesta = await fetch('/panerita/ajax/usuarios/listado-usuarios.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                res.forEach(usr => {
                    $vendedorRes.innerHTML += `<option value="${usr.mail}">${usr.nombre} (${usr.tipo} - ${usr.zona})</option>`;
                });
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //CHECKEAMOS ANTES DE ENVIAR (VALIDAMOS)
    chequearProductos();

    //PARTE 3 HABILITAR LISTADO DE PRODUCTOS
    $generarComprobante.addEventListener('submit', (e)=>{
        $error_loader.appendChild(loader(100, 1));
        e.preventDefault();
        clearInterval(liveStock);
        $sectionAux.innerHTML = '';

        let datos = new FormData($generarComprobante);
        const venta = {
            cliente:null,
            vendedor: null,
            zona:null
        }

        venta.cliente = datos.get('cliente-res');
        venta.vendedor = datos.get('vendedor-res');
        venta.zona = datos.get('zona');

        detalle.push(venta);
        detalle.push(productos); ///panerita/ajax/comprobantes/cargar-comprobante.php
        fetch('/panerita/ajax/stock/verificar-stock.php', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(detalle)
        })
        .then(res =>{
            return res.json();
        })
        .then(res => {
            $error.innerHTML = '';
            if(res.length > 0){
                let $alert = document.createElement('div'); $alert.classList.add('alert'); $alert.classList.add('alert-danger'); $alert.classList.add('alert-dismissible');
                res.forEach(p => {
                    $alert.innerHTML += `<b>STOCK INSUFICIENTE: </b> | ${p.nombre} | disponible: ${p.cantidad} <br>`;
                });
                $alert.innerHTML += '<button class="btn-close" data-bs-dismiss="alert"></button>';
                $alert.querySelector('.btn-close').addEventListener('click', ()=>{
                    $alert.querySelector('.btn-close').parentElement.remove();
                });
                $sectionAux.appendChild($alert);
                detalle = [];
            }else{
                fetch('/panerita/ajax/comprobantes/cargar-comprobante.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(detalle)
                })
                .then(res =>{
                    return res.json();
                })
                .then(res => {
                    if(!(res.error)){
                        productos = [];
                        detalle = [];
                        clearInterval(liveStock);
                        document.getElementById('main').innerHTML = ''; 
                        history.back();
                    }
                }).catch(err=>{
                    $error.innerHTML = '';
                    $error.appendChild(Mensaje(err, true));
                })
            }
        }).catch(err=>{
            $error_loader.innerHTML = '';
            alert('Error de conexion a la BBDD, intente mas tarde, si persiste comuniquese con el administrador');
        });
    });

    //PARTE 4 PRODUCTOS TMP TEMPORALES
    async function filtradoDeProductos(){
        let datos = new FormData();
        datos.append('tipo', $tipo.value);
        datos.append('producto',$producto.value);
        console.log(productos);
        try{
            let respuesta = await fetch('/panerita/ajax/productos/filtrado-productos-comprobante.php', {
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

    //PARTE 4 PRODUCTOS TMP TEMPORALES
    async function listadoDeProductos(){
        let datos = new FormData();
        datos.append('tipo', $tipo.value);
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
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>CANTIDAD</th><th>DEVOLUCION</th><th>${_cabecera[2]}</th><th>AGREGAR</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }        
    }
    function crearCuerpo(cabecera){
        cabecera.forEach(e=>{
            if(productos.find(producto=> producto.id == e.id_producto)){
                $tbody.innerHTML += `<tr>
                <td>${e.nombre}</td>
                <td class="sm-number"><input type="number" name="cantidad" min="0" value="0" step="1" pattern="[0-9]"></td>
                <td class="sm-number"><input type="number" name="devolucion" min="0" value="0"></td><td><input type="number" name="precio" min="0" value="${e.precio}"></td>
                <td><button class="btn btn-success agregar" disabled id="${e.id_producto}">➕</button><button class="btn cancelar">❌</button></td>
                </tr>`;
            }else{
                $tbody.innerHTML += `<tr>
                <td>${e.nombre}</td>
                <td class="sm-number"><input type="number" name="cantidad" min="0" value="0" step="1" pattern="[0-9]"></td>
                <td class="sm-number"><input type="number" name="devolucion" min="0" value="0"></td><td><input type="number" name="precio" min="0" value="${e.precio}"></td>
                <td><button class="btn btn-success agregar" id="${e.id_producto}">➕</button><button class="btn cancelar">❌</button></td>
                </tr>`;
            }
        });
        return $tbody;
    }
    function agregarEventos(){
        document.querySelectorAll('.agregar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                agregar(id.target);
            });
        });
        document.querySelectorAll('.cancelar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                cancelar(id.target);
            });
        });
    }
    function agregar(id){
        $listado.innerHTML = '';
        let row = id.parentNode.parentNode.querySelectorAll('td');
        let producto = {
            id:null,
            nombre:null,
            cantidad:null,
            devolucion:null,
            precio:null
        }

        producto.id = parseInt(id.id);
        producto.nombre = row[0].textContent;
        producto.cantidad = parseInt(row[1].firstElementChild.value);
        producto.devolucion = parseInt(row[2].firstElementChild.value);
        producto.precio = parseFloat(row[3].firstElementChild.value);

        //console.log(productos);

        if(producto.cantidad !== null && producto.cantidad > -1 && producto.devolucion > -1){
            productos.push(producto);
            id.setAttribute("disabled",true);
            productos.forEach(e=>{
                $listado.innerHTML += `<li><b>PRODUCTO:</b> ${e.nombre} | <b>CANTIDAD:</b> ${e.cantidad} | <b>DEVOLUCION:</b> ${e.devolucion}</li>`;
            });
            chequearProductos();
        }else{
            $error.innerHTML = '<div class="alert alert-danger">¡Agregar cantidad o devolucion / cantidades o devoluciones no negativas!</div>';
            mensaje($error);
        }
    }

    function cancelar(id){
        let row = id.parentNode.parentNode.querySelectorAll('td');
        let obj = row[4].children[0].id;
        quitarDeArreglo(obj, productos);

        row[4].children[0].removeAttribute("disabled");
        row[1].firstElementChild.value = 0; row[2].firstElementChild.value = 0;
        chequearProductos();
    }

    function quitarDeArreglo(obj, productos){
        $listado.innerHTML = '';
        productos.forEach((elem, index) => {
            if(elem.id == obj){
                productos.splice(index, 1);
                productos.forEach(e=>{
                    $listado.innerHTML += `<li><b>PRODUCTO:</b> ${e.nombre} | <b>CANTIDAD:</b> ${e.cantidad} | <b>DEVOLUCION:</b> ${e.devolucion}</li>`;
                });
            }
        });
    }

    function chequearProductos(){
        if(productos.length == 0){
            $generarComprobanteButton.setAttribute('disabled', true);
        }else{
            $generarComprobanteButton.removeAttribute('disabled');    
        }
    }
    function chequearClientesUsuarios(bandera){
        if(bandera){
            $nuevoComprobante.removeAttribute('disabled');
        }else{
            $nuevoComprobante.setAttribute('disabled', true);
        }
    }

}