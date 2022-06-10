import {mensaje} from './popups.js';
import {obtenerFecha} from './fechas.js';
import { Mensaje } from './helpers/errores.js';
export function existeNota(){
    //dom
    const $nuevaNota = document.getElementById('nuevaNota');
    const $editarNota = document.getElementById('editarNota');
    const $error = document.getElementById('error');
    const $tbody = document.createElement('tbody');
    let $sectionFirst = document.getElementById('sectionFirst');
    let seleccion;
    listadoDeNotas();

    async function listadoDeNotas(){
        try{
            let respuesta = await fetch('/panerita/ajax/notas/listado-notas.php');
            let data = await respuesta.json();//la respuesta es convertida a json
            $sectionFirst.innerHTML = '';
            $sectionFirst.appendChild(crearTabla(data));
            agregarEventos();
        }catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    function crearTabla(data){
        let $tabla = document.createElement('table');
        let $thead = document.createElement('thead');
        //let $tbody = document.createElement('tbody');
        let $tr = document.createElement('tr');

        $tabla.classList.add('table'); $tabla.classList.add('table-striped');
        $tr.innerHTML = `<th>NOTA</th><th>FECHA</th><th>ACCION</th>`;
        $thead.appendChild($tr);
        $tabla.appendChild($thead);

        data.forEach((e,i)=>{
            let $tr = document.createElement('tr');
            let texto = e.nota.substring(0, 40) + "...";
            $tr.innerHTML += `<td hidden>${e.nota}</td><td>${texto}</td><td>${e.fecha}</td>
            <td><button class="btn eliminar" id="${e.id_nota}">🗑️</button>
            <button class="btn editar" data-toggle="modal" data-target="#editarNota" id="${e.id_nota}">✏️</button></td>`;
            $tbody.appendChild($tr);
        });
        $tabla.appendChild($tbody);
        return $tabla;
    }

    //CREAR NOTA
    $nuevaNota.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($nuevaNota);
        nuevaNota(datos);      
        $nuevaNota.reset();
    });
    async function nuevaNota(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/notas/cargar-nota.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Guardada!');//listadoDeNotas();
                const $tr = document.createElement('tr');
                $tr.innerHTML = `<td hidden>${datos.get('contenido')}</td><td>${datos.get('contenido').substring(0, 40)}...</td>
                    <td>${obtenerFecha()}</td><td><button class="btn eliminar" id="${data.id_nota}">🗑️</button>
                    <button class="btn editar" data-toggle="modal" data-target="#editarNota" id="${data.id_nota}">✏️</button></td>`;
                $tbody.insertAdjacentElement('afterbegin',$tr);
                agregarEventos();
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }            
        }
        catch(error){
            $error.innerHTML = '';
            $error.appendChild(Mensaje(error, true));
        }
    }


    function agregarEventos(){
        document.querySelector('table').querySelectorAll('.eliminar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                eliminar(id.target);
            });
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                //editar(id.target.id);
                seleccion = id.target;
                editar(id.target);                
            });
        });
    }

    //EDITAR NOTA
    function editar(id){// fechaNota contenido idNota
        let datos = new FormData();
        datos.append('id_nota', id.id);
        /*fetch('/panerita/ajax/notas/obtener-nota.php', {
            method: 'POST',
            body: datos
        })
        .then(res => {return res.json()})
        .then(res => {
            document.getElementById('fechaNota').innerHTML = res[0].fecha;
            document.getElementById('idNota').value = res[0].id_nota;
            document.getElementById('contenidoNota').value = res[0].nota;
        })*/
        document.getElementById('fechaNota').innerHTML = id.parentNode.previousElementSibling.textContent;
        document.getElementById('idNota').value = id.id;
        document.getElementById('contenidoNota').value = id.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    }
    $editarNota.addEventListener('submit', (e)=>{
        e.preventDefault();
        const datos = new FormData($editarNota);
        editarNota(datos);
    });
    async function editarNota(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/notas/editar-nota.php', {
                method: 'POST',
                body: datos
            });
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                alertify.success('¡Guardada!');//listadoDeNotas();
                document.getElementById('fechaNota').innerHTML = obtenerFecha();
                seleccion.parentNode.previousElementSibling.textContent = obtenerFecha();
                seleccion.parentNode.previousElementSibling.previousElementSibling.textContent = datos.get('contenido').substring(0, 40) + '...';
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
            }
        }
        catch(error){
            alertify.error('¡Error de excepcion!');
        }
    }

    //ELIMINAR NOTA
    function eliminar(id){
        alertify.confirm("¿Eliminar Nota?",
        function(){
            let selected = id.id;        
            let datos = new FormData();
            datos.append('id_nota', selected);
            fetch('/panerita/ajax/notas/eliminar-nota.php', {
                method: 'POST',
                body: datos
            })
            .then(res => {return res.json()})
            .then(res => {
                if(!res.error){
                    id.parentNode.parentNode.remove();
                }else{
                    $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                    mensaje($error);
                }
            })
        });
    }

}