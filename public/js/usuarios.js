import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
import { loader } from './helpers/loader.js';
export function existeUsuario(){
    //DOM GLOBALES
    const $sectionFirst = document.getElementById('sectionFirst');
    const $error = document.getElementById('error');
    const $filtrarUsuarios = document.getElementById('filtrarUsuarios');
    const $input = document.getElementById('f_nombre');
    const $nuevoUsuario = document.getElementById('nuevoUsuario');
    const $editarUsuario = document.getElementById('editarUsuario');
    const $helperUsuario = document.getElementById('helperUsuario');
    //DOM GENERADOS Y AUXILIARES
    const $alert = document.createElement('div'); $alert.classList.add('alert'); $alert.classList.add('alert-danger');
    const $table = document.createElement('table');$table.classList.add('table'); $table.classList.add('table-striped');
    const $tbody = document.createElement('tbody');
    const $loader = document.getElementById('loader');
    let seleccion;

    const LISTA_USUARIOS = [];
    
    listadoDeUsuarios();

    //SESSIONES SOBRE DOM
    let tipo = JSON.parse(localStorage.getItem('datos')).tipo;
    if(tipo != 'super'){
        document.getElementById('label-zona').remove(); document.getElementById('label-zona-edit').remove();
        document.getElementById('zona').remove(); document.getElementById('e_zona').remove();
    }else{
        const $label = document.createElement('div'); $label.classList.add('col-auto'); $label.innerHTML = '<label for="zona">Zona</label>';
        const $select = document.createElement('div'); $select.classList.add('col-auto'); $select.innerHTML = `<select class="form-select" id="f_zona" name="zona"><option value="todos">Todos</option><option value="catamarca">Catamarca</option><option value="tucuman">Tucumán</option></select>`;
        $helperUsuario.appendChild($label); $helperUsuario.appendChild($select);
    }


    //LISTADO DE USUARIOS INICIAL
    async function listadoDeUsuarios(){
        try{
            let respuesta = await fetch('/panerita/ajax/usuarios/listado-usuarios.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                res.forEach(usu=>{
                    LISTA_USUARIOS.push(usu)
                });

                $table.innerHTML = ''; $tbody.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));                
                $sectionFirst.appendChild($table);
                agregarEventos();
            }
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //EDITAR USUARIO SIMPLE
    $editarUsuario.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($editarUsuario);
        editarUsuario(datos);      
        $editarUsuario.reset();
    });
    async function editarUsuario(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/usuarios/editar-usuario.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Editada!');//listadoDeUsuarios();
                
                seleccion[0].textContent = data.mail;
                seleccion[1].textContent = data.nombre;
                seleccion[2].textContent = data.dni;
                seleccion[3].textContent = data.nacimiento;
                seleccion[4].textContent = data.tipo;
                seleccion[5].textContent = data.telefono;
                seleccion[6].textContent = data.direccion;
                seleccion[7].textContent = data.zona;
                localStorage.removeItem('datos');
                removerDatosUsuario();
                localStorage.setItem('datos', JSON.stringify(data));
                cargarDatosUsuario(localStorage.getItem('datos'));
                //console.log(JSON.stringify(data));

            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }
    //FUNCIONES
    function cargarDatosUsuario(usuario){
        let datos = JSON.parse(usuario);
        let $sideUlPic = document.querySelector('.side-ul-pic');//$sideUlPic.src = `/panerita/profiles/img/${datos.foto}`;
        $sideUlPic.insertAdjacentHTML('afterend', `<p class="navbar-brand text-wrap" href="#">${datos.nombre}</p>`);
        document.querySelector('#logout .modal-body').innerHTML =`<h5>${datos.nombre}, ¿Salir?</h5>`;
    }
    function removerDatosUsuario(){
        let $sideUlPic = document.querySelector('.side-ul-pic');
        $sideUlPic.src = `/panerita/profiles/img/default.svg`;
        $sideUlPic.nextElementSibling.remove();
        document.querySelector('#logout .modal-body').innerHTML =``;
    }

    //CARGAR USUARIO 
    $nuevoUsuario.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($nuevoUsuario);
        nuevoUsuario(datos);      
        //$nuevoUsuario.reset();
    });

    async function nuevoUsuario(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/usuarios/cargar-usuario.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Usuario Creado!');//listadoDeNotas();
                const $tr = document.createElement('tr');
                $tr.innerHTML = `<tr><td>${data.mail}</td><td>${data.nombre}</td><td>${data.dni}</td><td>${data.nacimiento}</td><td>${data.tipo}</td><td>${data.telefono}</td><td>${data.direccion}</td><td>${data.zona}</td><td hidden>${data.estado}</td>
                <td><button class="btn eliminar" id="${data.mail}">🗑️</button>
                <button class="btn editar" id="${data.mail}" data-toggle="modal" data-target="#editarUsuario">✏️</button></td></tr>`;
                $tbody.insertAdjacentElement('afterbegin',$tr);
                agregarEventos();
                location.reload();
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }
            $error.innerHTML = '';
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
            $thead.innerHTML += `<tr><th>${_cabecera[0]}</th>
            <th>${_cabecera[1]}</th>
            <th>${_cabecera[3]}</th>
            <th>${_cabecera[4]}</th>
            <th>${_cabecera[5]}</th>
            <th>${_cabecera[6]}</th>
            <th>${_cabecera[7]}</th>
            <th>${_cabecera[8]}</th>
            <th>ACCIONES</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }
        
    }
    function crearCuerpo(cabecera){
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td>${e.mail}</td><td>${e.nombre}</td><td>${e.dni}</td><td>${e.nacimiento}</td><td>${e.tipo}</td><td>${e.telefono}</td><td>${e.direccion}</td><td>${e.zona}</td><td hidden>${e.estado}</td>
            <td><button class="btn eliminar" id="${e.mail}">🗑️</button>
            <button class="btn editar" id="${e.mail}" data-toggle="modal" data-target="#editarUsuario">✏️</button></td></tr>`;
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
            btn.addEventListener('click', (id)=>{
                btn.setAttribute('disabled', true);   
            });
        });
    }

    function desbloquearEventos(){
        document.querySelectorAll('.eliminar').forEach(btn =>{
            btn.removeAttribute('disabled');
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                btn.removeAttribute('disabled');
            });
        });
    }

    //BUSCAR USUARIOS
    $input.addEventListener('input', (e=>{
        if(e.target.value.length >= 3 && e.target.value.length <= 20){
            let datos = new FormData($filtrarUsuarios);
            fetch('/panerita/ajax/usuarios/filtrado-usuarios.php', {
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
                    //agregarEventos();
                }else{
                    $table.innerHTML = '<div class="alert alert-danger">¡No hay Cliente!</div>';
                }
            })
        }else if(e.target.value.length == 0){
            listadoDeUsuarios();
        }
    }));

    
    function eliminar(id_usuario){//esta funcion la podemos poner en un modulo y usarla para las demas secciones        
        alertify.confirm("¿Eliminar Usuario?",
            function(){
                $loader.appendChild(loader(40,1));
                bloquearEventos();
                let selected = id_usuario.id;        
                let datos = new FormData();
                datos.append('mail', selected);
                fetch('/panerita/ajax/usuarios/eliminar-usuario.php', {
                    method: 'POST',
                    body: datos
                })
                .then(res => {return res.json()})
                .then(res => {
                    desbloquearEventos();
                    $loader.innerHTML = '';
                    if(!res.error){
                        id_usuario.parentNode.parentNode.remove();
                    }else{
                        $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                        mensaje($error);
                    }
                }).catch(e =>{
                    $loader.innerHTML = '';
                    alert('Error de conexion a la BBDD, intente mas tarde, si persiste comuniquese con el administrador');
                    desbloquearEventos();
                })
        });
    }

    //EDITAR - CARGAR DATOS PARA EDITAR
    function editar(id_usuario){//esta funcion la podemos poner en un modulo (pasando el $modal correspondiente ) y usarla mostrar el modal correspondiente
        let datos = new FormData(); datos.append('mail', id_usuario.id);
        let $tr = id_usuario.parentNode.parentNode.getElementsByTagName('td');
        seleccion = $tr;
        pintarDatos(['e_mail','e_nombre','e_dni','e_nacimiento','e_tipo','e_telefono','e_direccion','e_zona','e_estado'],$tr, 'e_id', id_usuario.id);
    }
    function pintarDatos(identificadores,valores, id, valor){//en el modal
        document.getElementById(id).value = valor;
        identificadores.forEach((identificador, i) => {
            document.getElementById(identificador).value = valores[i].textContent;
            //console.log(document.getElementById(identificador));console.log(valores[i]);
        });
    }

} 