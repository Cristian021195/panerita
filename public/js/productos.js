import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
import { loader } from './helpers/loader.js';
export function existeProducto(){
    //DOM GLOBALES
    const $error = document.getElementById('error');
    const $error2 = document.getElementById('error2');
    const $error3 = document.getElementById('error3');
    const $input = document.getElementById('producto');
    const $sectionFirst = document.getElementById('sectionFirst');
    let $alert = document.createElement('div'); $alert.classList.add('alert'); $alert.classList.add('alert-danger');
    let $table = document.createElement('table');
    let $tbody = document.createElement('tbody');
    $table.classList.add('table'); $table.classList.add('table-striped');
    let $editarProducto = document.getElementById('editarProducto');
    let $nuevoProducto = document.getElementById('nuevoProducto');
    let $modificarListado = document.getElementById('modificarListado');
    let seleccion;

    listadoDeProductos();

    //SUPERADMIN
    if(JSON.parse(localStorage.getItem('datos')).zona == 'super'){
        let $labelZona = document.createElement('label'); $labelZona.classList.add('form-label'); $labelZona.textContent = 'Zona del Producto'; $labelZona.setAttribute('for', 'zona');
        let $labelTodos = document.createElement('label'); $labelTodos.classList.add('form-label'); $labelTodos.textContent = 'Zona del Producto'; $labelTodos.setAttribute('for', 'zona');

        let $seleccionZona = document.createElement('select'); $seleccionZona.classList.add('form-select'); $seleccionZona.id = 'zona'; $seleccionZona.setAttribute('name', 'zona');
        let $todosZona = document.createElement('select'); $todosZona.classList.add('form-select'); $todosZona.id = 't_zona'; $todosZona.setAttribute('name', 'zona');
        $seleccionZona.innerHTML = '<option value="catamarca">Catamarca</option><option value="tucuman">Tucuman</option>';
        $todosZona.innerHTML = '<option value="catamarca">Catamarca</option><option value="tucuman">Tucuman</option>';
        
        document.getElementById('todos-producto').appendChild($labelTodos); document.getElementById('todos-producto').appendChild($todosZona);
        document.getElementById('nuevo-producto').appendChild($labelZona); document.getElementById('nuevo-producto').appendChild($seleccionZona);
    }

    //MODIFICACION DE LISTADO TOTAL    
    $modificarListado.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($modificarListado);
        modificarListado(datos);      
        $modificarListado.reset();
    });
    async function modificarListado(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/productos/editar-producto.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                listadoDeProductos();
                alertify.success('¡Precios de Modificados!');
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(err){
            $error3.innerHTML = '';
            $error3.appendChild(Mensaje(err, 1000));
        }
    }

    //LISTADO DE PRODUCTOS INICIAL
    async function listadoDeProductos(){
        try{
            let respuesta = await fetch('/panerita/ajax/productos/listado-productos.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                $table.innerHTML = ''; $tbody.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));                
                $sectionFirst.appendChild($table);
                agregarEventos();
            }
        }catch(error){
            alertify.error(error);
        }
    }

    //EDITAR PRODUCTO SIMPLE
    $editarProducto.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($editarProducto);
        editarProducto(datos);      
        $editarProducto.reset();
    });
    async function editarProducto(datos){
        $error3.innerHTML = '';
        $error3.appendChild(loader(150,1));
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/productos/editar-producto.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Editada!');//listadoDeProductos();
                seleccion.firstElementChild.textContent = `${datos.get('nombre')}`;
                seleccion.firstElementChild.nextElementSibling.textContent = data.base;
                seleccion.firstElementChild.nextElementSibling.nextElementSibling.textContent = data.distribuidor;
                seleccion.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent = data.mayorista;
                seleccion.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent = data.minorista;
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(error){
            $error3.innerHTML = '';
            $error3.appendChild(Mensaje(error, 1000));
        }
    }

    //CARGAR PRODUCTO 
    $nuevoProducto.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($nuevoProducto);
        nuevoProducto(datos);      
        $nuevoProducto.reset();
    });

    async function nuevoProducto(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/productos/cargar-producto.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Guardada!');//listadoDeNotas();
                const $tr = document.createElement('tr');
                $tr.innerHTML = `<td>${data.nombre}</td>
                    <td>${data.base}</td><td>${data.distribuidor}</td><td>${data.mayorista}</td><td>${data.minorista}</td>
                    <td><button class="btn eliminar" id="${data.id_producto}">🗑️</button>
                    <button class="btn editar" id="${data.id_producto}" data-toggle="modal" data-target="#editarProducto">✏️</button></td>`;
                    $tbody.insertAdjacentElement('afterbegin',$tr);
                agregarEventos();
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(err){
            $error2.innerHTML = '';
            $error2.appendChild(Mensaje(err, 1000));
        }
    }

    //BUSCAR PRODUCTOS
    $input.addEventListener('input', (e=>{
        if(e.target.value.length >= 3 && e.target.value.length <= 16){
            let datos = new FormData();
            datos.append('nombre', e.target.value);
            fetch('/panerita/ajax/productos/filtrado-productos.php', {
                method: 'POST',
                body: datos
            })
            .then(res => {return res.json()})
            .then(res => {
                if(res.length != 0){
                    $table.innerHTML = ''; $tbody.innerHTML = '';
                    $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                    $table.appendChild(crearCuerpo(res));                
                    $sectionFirst.appendChild($table);
                    agregarEventos();
                }else{
                    $table.innerHTML = '<div class="alert alert-danger">¡No hay producto!</div>';
                }
            }).catch(err=>{
                alert('Error de conexion a BBDD, intente de nuevo mas tarde, si persiste llame al administrador');
            })
        }else if(e.target.value.length == 0){
            listadoDeProductos();
        }
    }));

    function crearCabecera(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>${_cabecera[5]}</th><th>ACCIONES</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }
        
    }
    function crearCuerpo(cabecera){
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td>${e.nombre}</td><td>${e.base}</td><td>${e.distribuidor}</td><td>${e.mayorista}</td><td>${e.minorista}</td>
            <td><button class="btn eliminar" id="${e.id_producto}">🗑️</button>
            <button class="btn editar" id="${e.id_producto}" data-toggle="modal" data-target="#editarProducto">✏️</button></td></tr>`;
        });
        return $tbody;
    }

    function agregarEventos(){
        document.querySelector('table').querySelectorAll('.eliminar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                eliminar(id.target);
            });
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                editar(id.target);                
            });
        });
    }
    function eliminar(id_producto){//esta funcion la podemos poner en un modulo y usarla para las demas secciones        
        alertify.confirm("¿Eliminar Producto?",
            function(){
                let selected = id_producto.id;        
                let datos = new FormData();
                datos.append('id_producto', selected);
                fetch('/panerita/ajax/productos/eliminar-producto.php', {
                    method: 'POST',
                    body: datos
                })
                .then(res => {return res.json()})
                .then(res => {
                    if(!res.error){
                        id_producto.parentNode.parentNode.remove();
                    }else{
                        $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                        mensaje($error);
                    }
                }).catch(e =>{
                    alert('Error de conexion a BBDD, intente de nuevo mas tarde, si persiste llame al administrador'+e);
                })
        });
    }
    function editar(id_producto){//esta funcion la podemos poner en un modulo (pasando el $modal correspondiente ) y usarla mostrar el modal correspondiente
        let datos = new FormData(); datos.append('id_nota', id_producto.id);

        document.getElementById('e_nombre').value = id_producto.parentNode.parentNode.firstElementChild.textContent;
        document.getElementById('e_base').value = id_producto.parentNode.parentNode.firstElementChild.nextElementSibling.textContent;
        document.getElementById('e_distribuidor').value = id_producto.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.textContent;
        document.getElementById('e_mayorista').value = id_producto.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
        document.getElementById('e_minorista').value = id_producto.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
        document.getElementById('e_id').value = id_producto.id;
        
        seleccion = id_producto.parentNode.parentNode;
    }

}