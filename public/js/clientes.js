import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
export function existeCliente(){

    //DOM GLOBALES
    const $sectionFirst = document.getElementById('sectionFirst');
    const $error = document.getElementById('error');
    const $filtrarClientes = document.getElementById('filtrarClientes');
    const $paginacion = document.getElementById('paginacion');
    const $input = document.getElementById('f_nombre');
    const $nuevoCliente = document.getElementById('nuevoCliente');
    const $editarCliente = document.getElementById('editarCliente');
    //DOM GENERADOS Y AUXILIARES
    const $alert = document.createElement('div'); $alert.classList.add('alert'); $alert.classList.add('alert-danger');
    const $table = document.createElement('table');$table.classList.add('table'); $table.classList.add('table-striped');
    const $tbody = document.createElement('tbody');
    

    let seleccion;   
    
    listadoDeClientes();
    contadorClientes();

    //SESSIONES SOBRE DOM
    let tipo = JSON.parse(localStorage.getItem('datos')).tipo;
    if(tipo == 'super'){
        const $formGroup = document.createElement('div');
        const $colZonaLabel = document.createElement('div'); $colZonaLabel.classList.add('col-auto');
        const $colZonaSelect = document.createElement('div'); $colZonaSelect.classList.add('col-auto');
        let auxLabel = '<label for="zona">Zona</label>'; let auxSelect = '<select class="form-select" id="f_zona" name="zona"><option value="todos">Todos</option><option value="catamarca">Catamarca</option><option value="tucuman">Tucumán</option></select>';
        let auxSelectForm = '<select class="form-select" id="f_zona" name="zona"><option value="catamarca">Catamarca</option><option value="tucuman">Tucumán</option></select>';

        $colZonaLabel.innerHTML = auxLabel;
        $colZonaSelect.innerHTML = `<div class="col-auto">${auxSelect}</div> `;

        $formGroup.innerHTML = auxLabel + auxSelectForm;
        document.getElementById('nuevoClienteForm').appendChild($formGroup);
        document.getElementById('userMark').appendChild($colZonaLabel); document.getElementById('userMark').appendChild($colZonaSelect);
        document.querySelector('#editarCliente .modal-body').innerHTML += `${auxLabel}<select class="form-select" id="f_zona" name="zona"><option value="catamarca">Catamarca</option><option value="tucuman">Tucumán</option></select>`;
    }



    //LISTADO DE CLIENTES INICIAL
    async function listadoDeClientes(){
        try{
            let respuesta = await fetch('/panerita/ajax/clientes/listado-clientes.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                let tipo = JSON.parse(localStorage.getItem('datos')).tipo;
                $table.innerHTML = ''; $tbody.innerHTML = '';
                
                if(tipo == 'administrador' || tipo == 'super' || tipo == 'secretaria'){
                    $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                    $table.appendChild(crearCuerpo(res));        
                }else if(tipo == 'empleado'){
                    $table.appendChild(crearCabeceraEmpleado(Object.keys(res[0]), res[0].length));
                    $table.appendChild(crearCuerpoEmpleado(res));
                }

                $sectionFirst.appendChild($table);
                agregarEventos();
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //LISTADO DE CLIENTES INICIAL
    async function contadorClientes(){
        try{
            let respuesta = await fetch('/panerita/ajax/clientes/contador-clientes.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            let cantidadClientes = parseInt(res[0].cantidad);
            if(cantidadClientes > 0){
                let aux = cantidadClientes % 10;
                let modulos = parseInt(cantidadClientes / 10);
                if(aux > 0){
                  modulos++;
                }
                if(modulos > 1){
                  for(var i = 1; i <= modulos; i++){
                    $paginacion.innerHTML += `<li class="page-item"><a class="page-link" href="/panerita/clientes/${i}">${i}</a></li>`;
                  }
                }
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //EDITAR CLIENTE SIMPLE
    $editarCliente.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($editarCliente);
        editarCliente(datos);      
        $editarCliente.reset();
    });
    async function editarCliente(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/clientes/editar-cliente.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Editada!');//listadoDeClientes();
                seleccion.getElementsByTagName('td')[0].textContent = data.estado;
                seleccion.getElementsByTagName('td')[1].textContent = data.nombre;
                seleccion.getElementsByTagName('td')[2].textContent = data.dni;
                seleccion.getElementsByTagName('td')[3].textContent = data.tipo;
                seleccion.getElementsByTagName('td')[4].textContent = data.telefono;
                seleccion.getElementsByTagName('td')[5].textContent = data.mail;
                seleccion.getElementsByTagName('td')[6].textContent = data.direccion;
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //CARGAR CLIENTE 
    $nuevoCliente.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($nuevoCliente);
        nuevoCliente(datos);      
        $nuevoCliente.reset();
    });

    async function nuevoCliente(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/clientes/cargar-cliente.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Guardada!');//listadoDeNotas();
                const $tr = document.createElement('tr');
                $tr.innerHTML = `<td hidden>${data.estado}</td><td>${data.nombre}</td><td>${data.dni}</td><td>${data.tipo}</td><td>${data.telefono}</td><td>${data.mail}</td><td>${data.direccion}</td>
                    <td><button class="btn eliminar" id="${data.id_cliente}">🗑️</button>
                    <button class="btn editar" id="${data.id_cliente}" data-toggle="modal" data-target="#editarCliente">✏️</button></td>`;
                $tbody.insertAdjacentElement('afterbegin',$tr);
                agregarEventos();
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(err){
            $error.innerHTML = '';
            $error.appendChild(Mensaje(err, 1000));
        }
    }
    //FUNCIONES AUXILIARES
    function crearCabecera(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>${_cabecera[5]}</th><th>${_cabecera[6]}</th><th>ACCIONES</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }   
    }
    function crearCabeceraEmpleado(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>${_cabecera[5]}</th><th>${_cabecera[6]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }   
    }

    function crearCuerpo(cabecera){
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td hidden>${e.estado}</td><td>${e.nombre}</td><td>${e.dni}</td><td>${e.tipo}</td><td>${e.telefono}</td><td>${e.mail}</td><td>${e.direccion}</td>
            <td><button class="btn eliminar" id="${e.id_cliente}">🗑️</button>
            <button class="btn editar" id="${e.id_cliente}" data-toggle="modal" data-target="#editarCliente">✏️</button></td></tr>`;
        });
        return $tbody;
    }

    function crearCuerpoEmpleado(cabecera){
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td hidden>${e.estado}</td><td>${e.nombre}</td><td>${e.dni}</td><td>${e.tipo}</td><td>${e.telefono}</td><td>${e.mail}</td><td>${e.direccion}</td></tr>`;
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

    function bloquearEventos(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.setAttribute('disabled', true);
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.setAttribute('disabled', true);
        });
    }

    function desbloquearEventos(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.removeAttribute('disabled');
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.removeAttribute('disabled');
        });
    }

    //BUSCAR CLIENTES
    $input.addEventListener('input', (e=>{
        if(e.target.value.length >= 3 && e.target.value.length <= 16){
            let datos = new FormData($filtrarClientes);
            fetch('/panerita/ajax/clientes/filtrado-clientes.php', {
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
                    $table.innerHTML = '<div class="alert alert-danger">¡No hay Cliente!</div>';
                }
            }).catch(err=>{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${err} <br></div>`;
                mensaje($error);
            })
        }else if(e.target.value.length == 0){
            listadoDeClientes();
        }
    }));

    
    function eliminar(id_cliente){//esta funcion la podemos poner en un modulo y usarla para las demas secciones        
        alertify.confirm("¿Eliminar Cliente?",
            function(){
                let selected = id_cliente.id;        
                let datos = new FormData();
                datos.append('id_cliente', selected);
                bloquearEventos();
                fetch('/panerita/ajax/clientes/eliminar-cliente.php', {
                    method: 'POST',
                    body: datos
                })
                .then(res => {return res.json()})
                .then(res => {
                    if(!res.error){
                        id_cliente.parentNode.parentNode.remove();
                    }else{
                        $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                        mensaje($error);
                    }
                    desbloquearEventos();
                }).catch(err =>{
                    desbloquearEventos();
                    alert('Sin conexion a BBDD, vuelva a intentarlo en un momento...', err);
                })
        });
    }

    //EDITAR - CARGAR DATOS PARA EDITAR
    function editar(id_cliente){//esta funcion la podemos poner en un modulo (pasando el $modal correspondiente ) y usarla mostrar el modal correspondiente
        let datos = new FormData(); datos.append('id_cliente', id_cliente.id);
        let tr = id_cliente.parentNode.parentNode.getElementsByTagName('td');
        seleccion = id_cliente.parentNode.parentNode;
        pintarDatos(['e_estado','e_nombre','e_identificador','e_tipo','e_telefono','e_mail','e_direccion'],tr,'e_id', id_cliente.id);
    }
    function pintarDatos(identificadores,valores,id, id_valor){//en el modal
        document.getElementById(id).value = id_valor;
        identificadores.forEach((identificador, i) => {
            document.getElementById(identificador).value = valores[i].textContent;
        });
    }
}