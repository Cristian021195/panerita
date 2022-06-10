import {loader} from './helpers/loader.js';
import {mensaje} from './popups.js';
export function existeCarga(){
    //DOM GLOBALES
    const $generarCarga = document.getElementById('generarCarga');
    const $sectionFirst = document.getElementById('sectionFirst');
    const $cajones = document.getElementById('cajones');
    const $cargaGeneral = document.getElementById('carga-general');
    const $comprobantes = document.getElementById('comprobantes');
    const $cuerpoCargaMasiva = document.getElementById('cuerpoCargaMasiva');
    const $limpiar = document.getElementById('limpiar');
    const $sectionSecond = document.getElementById('sectionSecond');
    const $error = document.getElementById('error'); const $error2 = document.getElementById('error2');
    const $table = document.createElement('table'); $table.classList.add('table'); $table.classList.add('table-striped');

    //VARIABLES AUXILIARES
    let cajones = 0;

    let comprobantesObj = {
        total:null,
        cajones:null,
        comprobantes:[]
    };

    const valores = {
        pagado:null,
        pendiente:null,
        deudor:null
    }
    
    //VARIABLES DE SESION Y AUX
    const tipo = JSON.parse(localStorage.getItem('datos')).tipo;
    if(tipo == 'super'){
        const $labelZona = document.createElement('label'); $labelZona.textContent = 'Zona';
        const $selectZona = document.createElement('select'); $selectZona.classList.add('form-select'); $selectZona.name = 'zona'; $selectZona.id = 'zona';
        $selectZona.innerHTML = '<option value="catamarca">Catamarca</option><option value="tucuman">Tucuman</option>';

        $cuerpoCargaMasiva.appendChild($labelZona); $cuerpoCargaMasiva.appendChild($selectZona);
    }

    //DATOS
    $generarCarga.addEventListener('submit', (e)=>{
        e.preventDefault();

        let datos = new FormData($generarCarga);
        //validamos
        if(datos.get('desde') != '' && datos.get('hasta') != ''){
            listadoDeCargas(datos);
        }else{
            $error.innerHTML = '<div class="alert alert-danger"><b>¡Error!</b> ¡Debe ingresar fecha de inicio y tambien de fin!</div>';
            mensaje($error);
        }
    });

    //IMPRESION COMPROBANTES
    $comprobantes.addEventListener('click', (e)=>{
        fetch('/panerita/ajax/cargas/listado-comprobantes.php', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(comprobantesObj.comprobantes)
        }).then(res => {return res.json()})
        .then(res => {
            const $body = document.createElement('div');
            
            res.forEach(dat => {
                const $contenedor = document.createElement('div'); $contenedor.classList.add('comprobante');
                const $centrado = document.createElement('div'); $centrado.classList.add('centrado');
                const $contacto = document.createElement('div'); $contacto.classList.add('contacto');
                const $logo = document.createElement('img'); $logo.setAttribute('src', '/panerita/public/img/panerita-sm.svg');
                const $cierre = document.createElement('div'); $cierre.classList.add('cierre'); $cierre.innerHTML = `<b>TOTAL COMPROBANTE: $${dat.comprobante[0].total} | VENDEDOR: </b>${dat.comprobante[0].vendedor}`;

                $contacto.innerHTML = `<b>${dat.cabecera.empresa}  | Telefonos: </b>${dat.cabecera.telefono1} ${dat.cabecera.telefono2}`;

                $centrado.appendChild($logo);
                $contenedor.appendChild($centrado);
                $contenedor.appendChild($contacto);
                $contenedor.appendChild(generarTablaPrincipal(dat.comprobante[0]));
                $contenedor.appendChild(generarTablaDetalle(dat.detalle), $cierre);
                $contenedor.appendChild($cierre);
                $body.appendChild($contenedor);
            });


            let ventanaImpresion = open('/panerita/views/partials/impresion.html');
                ventanaImpresion.onload = function(){
                ventanaImpresion.document.title = new Date(Date.now());
                ventanaImpresion.document.body.appendChild($body);
            }

        })
    });

    function generarTablaDetalle(datos){
        let $table = document.createElement('table'); $table.classList.add('detalle');
        let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');
        let cabecera = Object.keys(datos[0]).map(e=>{return e.toUpperCase()});
        $thead.innerHTML = `<tr><th>${cabecera[0]}</th><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th><th>${cabecera[4]}</th></tr>`;
  
        datos.forEach(dato =>{
            $tbody.innerHTML += `<tr><td>${dato.producto}</td><td>${dato.cantidad}</td><td>${dato.devolucion}</td><td>${dato.precio}</td><td>${dato.total}</td></tr>`;
        });
        $table.appendChild($thead); $table.appendChild($tbody);
        return $table;
    }

    function generarTablaPrincipal(datos){
        let $table = document.createElement('table'); $table.classList.add('principal');
        let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');
        let cabecera = Object.keys(datos).map(e=>{return e.toUpperCase()});
        $thead.innerHTML = `<tr><th>${cabecera[0]}</th><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th></tr>`;
        $tbody.innerHTML = `<tr><td>${datos.cliente}</td><td>${datos.direccion}</td><td>${datos.telefono}</td><td>${datos.fecha}</td></tr>`;

        $table.appendChild($thead); $table.appendChild($tbody);

        return $table;
    }

    //LIMPIAR TODO
    $limpiar.addEventListener('click', ()=>{
        comprobantesObj.cajones = null; comprobantesObj.comprobantes = []; comprobantesObj.total = null;
        $cargaGeneral.setAttribute('disabled', true);
        $comprobantes.setAttribute('disabled', true);
        $sectionFirst.firstChild.remove();
    });

    //IMPRESION GENERAL + CAJONES
    $cargaGeneral.addEventListener('click', (e)=>{
        enviarPrimeraParte(comprobantesObj.comprobantes);
    });

    //ENVIAR JSON A BACKEND
    async function enviarPrimeraParte(datos){
        try{
            let respuesta = await fetch('/panerita/ajax/cargas/listado-general.php', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(datos)
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            
            if(res != null){

                //IMPRESION AQUI
                const ventas = res[0];
                const $ventas = document.createElement('h4'); $ventas.textContent = 'Detalle Cargas y Devoluciones';
                
                
                const $tablaImpresion = document.createElement('table');  $tablaImpresion.classList.add('hovered');
                const $tablaVentas = document.createElement('table');  $tablaVentas.classList.add('hovered');

                const $impresion = document.createElement('div');
                let total = 0;
                comprobantesObj.comprobantes.forEach(comp => {
                    total += comp.total;
                });
                comprobantesObj.total = total;
                $impresion.innerHTML = `<h4>COMPROBANTES: ${comprobantesObj.comprobantes.length}, CAJONES: ${comprobantesObj.cajones}, TOTAL: $${comprobantesObj.total}</h4>`;
                $tablaImpresion.appendChild(cabeceraImpresion(Object.keys(comprobantesObj.comprobantes[0])));
                $tablaImpresion.appendChild(cuerpoImpresion(comprobantesObj.comprobantes));
            
                $tablaVentas.appendChild(cabeceraVentas(Object.keys(ventas[0])));
                $tablaVentas.appendChild(cuerpoVentas(ventas));
            
                $impresion.appendChild($tablaImpresion);
                $impresion.appendChild($ventas);
                $impresion.appendChild($tablaVentas);
            
                $impresion.classList.add('contenedor');
            
                let ventanaImpresion = open('/panerita/views/partials/impresion.html');
                    ventanaImpresion.onload = function(){
                    ventanaImpresion.document.title = new Date(Date.now());
                    ventanaImpresion.document.body.appendChild($impresion);
                }
                
            }else{
                $error2.innerHTML = '<div class="alert alert-danger"><b>¡Error! </b>No se encontraron clientes con estas condiciones..</div>';
                mensaje($error2);
            }
        }catch(error){
            alertify.error('¡Error de excepcion!' + error);
        }
    }

    function cabeceraVentas(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML = `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }      
      }
    function cuerpoVentas(cabecera){
        let $tbody = document.createElement('tbody');
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td>${e.producto}</td><td>${e.ventas}</td><td>${e.devoluciones}</td><td>${e.total}</td></tr>`;
        });
        return $tbody;
    }

    function cabeceraImpresion(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML = `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[4]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }      
      }
    function cuerpoImpresion(cabecera){
        let $tbody = document.createElement('tbody');
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td>${e.fecha}</td><td>${e.cliente}</td><td>${e.vendedor}</td><td>${e.total}</td></tr>`;
        });
        return $tbody;
    }

    //CAJONES
    $cajones.addEventListener('input', (e)=>{
        cajones = parseInt(e.target.value);
        comprobantesObj.cajones = cajones;
        if(cajones > 0 && comprobantesObj.comprobantes.length > -1){            
            $cargaGeneral.removeAttribute('disabled');
            $comprobantes.removeAttribute('disabled');
        }else{
            $cargaGeneral.setAttribute('disabled', true);
            $comprobantes.setAttribute('disabled', true);
        }
    });

    //LISTADO DE COMPROBANTES INICIAL
    async function listadoDeCargas(datos){
        try{
            let respuesta = await fetch('/panerita/ajax/cargas/listado-cargas.php', {
                method: 'POST',
                body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                $table.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));                
                $sectionFirst.appendChild($table);
                agregarEventos();
            }else{
                $error2.innerHTML = '<div class="alert alert-danger"><b>¡Error! </b>No se encontraron clientes con estas condiciones..</div>';
                mensaje($error2);
            }
        }catch(error){
            alertify.error('¡Error de excepcion!' + error);
        }
    }

    //FUNCIONES AUXILIARES
    function crearCabecera(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML = `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>ACCIONES</th></tr>`;
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

            
            if(comprobantesObj.comprobantes.find(comprobante => comprobante.id_comprobante == e.id_comprobante)){
                $tbody.innerHTML += `<tr>
            <td>${e.fecha}</td>
            <td>${e.cliente}</td>
            <td>${e.vendedor}</td>
            <td><button class="${color} estado" id="${e.id_comprobante}">${e.estado}</button></td>
            <td>${e.total}</td>
            <td><button class="btn btn-success agregar" disabled>➕</button><button class="btn remover" data-id="${e.id_comprobante}">❌</button></td>
            </tr>`;
            }else{
                $tbody.innerHTML += `<tr>
            <td>${e.fecha}</td>
            <td>${e.cliente}</td>
            <td>${e.vendedor}</td>
            <td><button class="${color} estado" id="${e.id_comprobante}">${e.estado}</button></td>
            <td>${e.total}</td>
            <td><button class="btn btn-success agregar">➕</button><button class="btn remover" data-id="${e.id_comprobante}">❌</button></td>
            </tr>`;
            }
            
        });
        return $tbody;
    }

    function agregarEventos(){
        document.querySelector('table').querySelectorAll('.estado').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                cambiarEstado(id.target);
            });
        });
        document.querySelector('table').querySelectorAll('.agregar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                agregar(id.target.parentElement.parentElement);
            });
        });
        document.querySelector('table').querySelectorAll('.remover').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                //remover(id.target.dataset.id);
                remover(id.target.parentElement);
            });
        });
    }

    function remover(id){
        let remove = id.querySelector('.remover').dataset.id;
        comprobantesObj.comprobantes.forEach((comp, index) =>{
            if(comp.id_comprobante == remove){
                comprobantesObj.comprobantes.splice(index, 1);
            }
        });

        if(cajones > 0 && comprobantesObj.comprobantes.length > 0){
            $cargaGeneral.removeAttribute('disabled');
            $comprobantes.removeAttribute('disabled');
        }else{
            $cargaGeneral.setAttribute('disabled', true);
            $comprobantes.setAttribute('disabled', true);
        }
        id.querySelector('.agregar').removeAttribute('disabled');
    }

    function agregar(id){
        let comprobante = {
            fecha:null,
            cliente:null,
            vendedor:null,
            id_comprobante:null,
            total:null
        }

        comprobante.fecha = id.firstElementChild.textContent;
        comprobante.cliente = id.firstElementChild.nextElementSibling.textContent;
        comprobante.vendedor = id.firstElementChild.nextElementSibling.nextElementSibling.textContent;
        comprobante.id_comprobante = id.querySelector('.estado').id;
        comprobante.total = parseFloat(id.lastElementChild.previousElementSibling.textContent);

        id.querySelector('.agregar').setAttribute('disabled', true);

        comprobantesObj.comprobantes.push(comprobante);

        console.log(comprobantesObj.comprobantes)

        if(cajones > 0 && comprobantesObj.comprobantes.length > 0){
            $cargaGeneral.removeAttribute('disabled');
            $comprobantes.removeAttribute('disabled');
        }else{
            $cargaGeneral.setAttribute('disabled', true);
            $comprobantes.setAttribute('disabled', true);
        }
    }

    function cambiarEstado(id){
        let estado = id.textContent.toLowerCase();
        if(estado == 'pendiente'){
            estado = 'pagado';
            id.classList.remove('btn-warning'); id.classList.add('btn-success');
        }else if(estado == 'pagado'){
            estado = 'deudor';
            id.classList.remove('btn-success'); id.classList.add('btn-danger');
        }else{
            estado = 'pendiente';
            id.classList.remove('btn-danger'); id.classList.add('btn-warning');
        }
        id.textContent = estado;

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