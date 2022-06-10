import {mensaje} from './popups.js';
import { Mensaje } from './helpers/errores.js';
export function existeCierre(){
    //DOM GLOBALES
    const $consultarCierre = document.getElementById('consultarCierre');
    const $sectionFirst = document.getElementById('sectionFirst');
    const $sectionSecond = document.getElementById('sectionSecond');
    const $error = document.getElementById('error'); const $error2 = document.getElementById('error2');
    const $table = document.createElement('table');
    const $identificador = document.getElementById('identificador');

    const $pagado = document.querySelector('.pagado');
    const $pendiente = document.querySelector('.pendiente');
    const $deudor = document.querySelector('.deudor');

    const valores = {
        pagado:null,
        pendiente:null,
        deudor:null
    }

    $table.classList.add('table'); $table.classList.add('table-striped');


    //ENVIAR DATOS
    $consultarCierre.addEventListener('submit', (e)=>{
        e.preventDefault();

        let datos = new FormData($consultarCierre);
        //validamos
        if(datos.get('desde') != '' && datos.get('hasta') != ''){
            listadoDeCierres(datos);
        }else{
            $error.innerHTML = '<div class="alert alert-danger"><b>¡Error!</b> ¡Debe ingresar fecha de inicio y tambien de fin!</div>';
            mensaje($error);
        }
    });


    //LISTADO DE COMPROBANTES INICIAL
    async function listadoDeCierres(datos){
        try{
            let respuesta = await fetch('/panerita/ajax/cierres/listado-cierres.php', {
                method: 'POST',
                body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){

                valores.pagado = 0; valores.pendiente = 0; valores.deudor = 0;

                res.forEach(comprobante => {
                    if(comprobante.estado == 'pagado'){
                        valores.pagado += parseFloat(comprobante.total);
                    }else if(comprobante.estado == 'pendiente'){
                        valores.pendiente += parseFloat(comprobante.total);
                    }else{
                        valores.deudor += parseFloat(comprobante.total);
                    }
                });

                $pagado.textContent = `$${valores.pagado}`;
                $pendiente.textContent = `$${valores.pendiente}`;
                $deudor.textContent = `$${valores.deudor}`;


                $table.innerHTML = ''; //$tbody.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));                
                $sectionFirst.appendChild($table);
                agregarEventos();
            }else{
                $error2.innerHTML = '<div class="alert alert-danger"><b>¡Error! </b>No se encontraron clientes con estas condiciones..</div>';
                mensaje($error2);
            }
        }catch(err){
            $error.innerHTML = '';
            $error.appendChild(Mensaje(err, 1000));
        }
    }

    //FUNCIONES AUXILIARES
    function crearCabecera(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML = `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }      
      }
    function crearCuerpo(cabecera){
        let color = '';
        let $tbody = document.createElement('tbody');
        cabecera.forEach(e=>{
            if(e.estado == 'pendiente'){
              color = 'btn btn-warning';
            }else if(e.estado == 'pagado'){
              color = 'btn btn-success';
            }else{
              color = 'btn btn-danger';
            }
            $tbody.innerHTML += `<tr><td>${e.fecha}</td><td>${e.cliente}</td><td>${e.vendedor}</td><td><button class="${color} estado" id="${e.id_comprobante}">${e.estado}</button></td><td>${e.total}</td></tr>`;
        });
        return $tbody;
    }

    function agregarEventos(){
        document.querySelector('table').querySelectorAll('.estado').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                cambiarEstado(id.target, parseFloat(id.target.parentElement.nextElementSibling.textContent));
            });
        });
    }

    function cambiarEstado(id, valor){

        let estado = id.textContent.toLowerCase();
        if(estado == 'pendiente'){
            estado = 'pagado'; 
            valores.pendiente = valores.pendiente - valor;
            valores.pagado = valores.pagado + valor;
            id.classList.remove('btn-warning'); id.classList.add('btn-success');
        }else if(estado == 'pagado'){
            estado = 'deudor';
            valores.pagado = valores.pagado - valor;
            valores.deudor = valores.deudor + valor;
            id.classList.remove('btn-success'); id.classList.add('btn-danger');
        }else{
            estado = 'pendiente';
            valores.deudor = valores.deudor - valor;
            valores.pendiente = valores.pendiente + valor;
            id.classList.remove('btn-danger'); id.classList.add('btn-warning');
        }
        id.textContent = estado;
        $pagado.textContent = valores.pagado.toFixed(2); $pendiente.textContent = valores.pendiente.toFixed(2); $deudor.textContent = valores.deudor.toFixed(2);

        let datos = new FormData();
        datos.append('id_comprobante', id.id);
        datos.append('estado', estado);
        cambiarEstadoBack(datos);
    }

    async function cambiarEstadoBack(datos){
        try{
            let respuesta = await fetch('/panerita/ajax/cierres/editar-estado.php', {
                method: 'POST',
                body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.error){
                alertify.error("¡Error al actualizar el estado!");
            }
        }catch(error){
            alertify.error('¡Error de excepcion!' + error);
        }
    }

}
