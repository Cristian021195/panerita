import { Mensaje } from "./helpers/errores.js";
import {loader} from "./helpers/loader.js";
export function existeCargaMasiva(){
    //DOM GLOBALES
    const $sectionFirst = document.getElementById('sectionFirst');
    const $error = document.getElementById('error');
    const $generarCargaMasiva = document.getElementById('generarCargaMasiva');
    const $cuerpoCargaMasiva = document.getElementById('cuerpoCargaMasiva');
    const $producto = document.getElementById('producto');
    const $table = document.createElement('table');$table.classList.add('table'); $table.classList.add('table-striped');
    const $descarga = document.getElementById('descarga');

    const $cajones = document.getElementById('cajones');
    const $desde = document.getElementById('desde');
    const $hasta = document.getElementById('hasta');

    //VARIABLES DE SESION Y AUX
    const tipo = JSON.parse(localStorage.getItem('datos')).tipo;
    if(tipo == 'super'){
        const $labelZona = document.createElement('label'); $labelZona.textContent = 'Zona';
        const $selectZona = document.createElement('select'); $selectZona.classList.add('form-select'); $selectZona.name = 'zona'; $selectZona.id = 'zona';
        $selectZona.innerHTML = '<option value="catamarca">Catamarca</option><option value="tucuman">Tucuman</option>';

        $cuerpoCargaMasiva.appendChild($labelZona); $cuerpoCargaMasiva.appendChild($selectZona);
    }


    let _desde = ''; let _hasta = ''; let _cajones = '';


    $desde.addEventListener('change', (e)=>{
        _desde = e.target.value;
        impresionURL(_desde, _hasta, _cajones);
    })
    $hasta.addEventListener('change', (e)=>{
        _hasta = e.target.value;
        impresionURL(_desde, _hasta, _cajones);
    })
    $cajones.addEventListener('change', (e)=>{
        _cajones = e.target.value;
        impresionURL(_desde, _hasta, _cajones);
    });

    function impresionURL(desde, hasta, cajones){
        $descarga.href = `/panerita/ajax/impresion/impresion-cargas.php?desde=${_desde}&hasta=${_hasta}&cajones=${_cajones}`;
    }

    //DESCARGA IMPRESION
    /*$descarga.addEventListener('click', (e)=>{
        e.preventDefault();
        let datos = new FormData($generarCargaMasiva);
        let desde = datos.get('desde') + ' 00:00:00';
        let hasta = datos.get('hasta') + ' 00:00:00';
        let cajones = datos.get('cajones');
        datos = null;

        let downloadData = new FormData();
        downloadData.append('desde', desde);
        downloadData.append('hasta', hasta);
        downloadData.append('cajones', cajones);

        fetch('/panerita/ajax/impresion/impresion-cargas.php',{
            method: 'POST',
            body: downloadData
        }).then(res=>res.blob())
        .then(blob => {
            var file = window.URL.createObjectURL(blob);
            window.location.assign(file);
        }).catch(err=>{
            console.log(err);
            alert('¡Error al imprimir! intente nuevamente mas tarde. si persiste conmuniquese con el administrador..', err)
        })
    })*/



    $generarCargaMasiva.addEventListener('submit', (e)=>{
        e.preventDefault();

        let datos = new FormData($generarCargaMasiva);
        if(datos.get('desde') != '' && datos.get('hasta') != ''){
            fetch('/panerita/ajax/carga-masiva/listado-carga-masiva.php', {
                method: 'POST',
                body: datos
            }).then(res => {return res.json()})
            .then(comprobantes => {
                if(!comprobantes.error && comprobantes.length > 0){

                    //generarTablaGeneral(comprobantes[0].general);
                    //generarTablaVentas(comprobantes[1].ventas);
                    const $general = document.createElement('div'); $general.classList.add('hovered'); $general.classList.add('sin-corte');
                    const $ventas = document.createElement('div'); $ventas.classList.add('hovered'); $ventas.classList.add('sin-corte');
                    const $comprobantes = document.createElement('div');
                    let $titulo_ventas = document.createElement('h3'); $titulo_ventas.textContent = 'DETALLE DE CARGAS Y DEVOLUCIONES';
                    let $titulo_cargas = document.createElement('h3'); 
                    
                    let total = 0;
                    let cantidad = comprobantes[0].general.length;
                    comprobantes[0].general.forEach(e=>{
                        total += parseFloat(e.total);
                    });
                    $error.innerHTML = '';

                    $titulo_cargas.textContent = `CAJONES: ${datos.get('cajones')}, TOTAL: $${total}, COMPROBANTES: ${cantidad}`;


                    comprobantes[3].forEach(resumenes => {
                        if(resumenes['0'].length > 0){                        
                            const $contenedor = document.createElement('div'); $contenedor.classList.add('comprobante');
                            const $centrado = document.createElement('div'); $centrado.classList.add('centrado');
                            const $contacto = document.createElement('div'); $contacto.classList.add('contacto');
                            const $logo = document.createElement('img'); $logo.setAttribute('src', '/panerita/public/img/panerita-sm.svg');
                            const $cierre = document.createElement('div'); $cierre.classList.add('cierre'); $cierre.innerHTML = `<b>TOTAL COMPROBANTE: $${resumenes.total} | VENDEDOR: </b>${resumenes.vendedor}`;

                            $contacto.innerHTML = `<b>${comprobantes[2].empresa}  | Telefonos: </b>${comprobantes[2].telefono1} ${comprobantes[2].telefono2}`;

                            $centrado.appendChild($logo);
                            $contenedor.appendChild($centrado);
                            $contenedor.appendChild($contacto);
                            $contenedor.appendChild(generarTablaPrincipal(resumenes));
                            $contenedor.appendChild(generarTablaDetalle(resumenes[0]), $cierre);
                            $contenedor.appendChild($cierre);

                            $comprobantes.appendChild($contenedor);
                        }
                    });

                    $comprobantes.insertAdjacentElement('afterbegin',generarTablaVentas(comprobantes[1].ventas));
                    $comprobantes.insertAdjacentElement('afterbegin',$titulo_ventas);
                    $comprobantes.insertAdjacentElement('afterbegin',generarTablaGeneral(comprobantes[0].general));
                    $comprobantes.insertAdjacentElement('afterbegin',$titulo_cargas);                    

                    let ventanaImpresion = open('/panerita/views/partials/impresion.html');
                    ventanaImpresion.onload = function(){
                        ventanaImpresion.document.title = new Date(Date.now());
                        ventanaImpresion.document.body.appendChild($comprobantes);
                    }
                    //console.log(comprobantes);
                }else{
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
    });

    function generarTablaVentas(datos){
        let $table = document.createElement('table'); $table.classList.add('principal'); $table.classList.add('hovered');
        let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');
        let cabecera = Object.keys(datos[0]).map(e=>{return e.toUpperCase()});
        $thead.innerHTML = `<tr><th>${cabecera[0]}</th><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th></tr>`;

        datos.forEach(fila=>{
            $tbody.innerHTML += `<tr><td>${fila.producto}</td><td>${fila.ventas}</td><td>${fila.devoluciones}</td><td>${fila.total}</td></tr>`;
        });

        $table.appendChild($thead); $table.appendChild($tbody);

        return $table;
    }

    function generarTablaGeneral(datos){
        let $table = document.createElement('table'); $table.classList.add('principal'); $table.classList.add('hovered');
        let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');
        let cabecera = Object.keys(datos[0]).map(e=>{return e.toUpperCase()});
        $thead.innerHTML = `<tr><th>${cabecera[0]}</th><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th></tr>`;

        datos.forEach(fila=>{
            $tbody.innerHTML += `<tr><td>${fila.fecha}</td><td>${fila.cliente}</td><td>${fila.vendedor}</td><td>${fila.total}</td></tr>`;
        });

        $table.appendChild($thead); $table.appendChild($tbody);

        return $table;
    }

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
      $thead.innerHTML = `<tr><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th><th>${cabecera[4]}</th></tr>`;
      $tbody.innerHTML = `<tr><td>${datos.cliente}</td><td>${datos.direccion}</td><td>${datos.telefono}</td><td>${datos.fecha}</td></tr>`;

      $table.appendChild($thead); $table.appendChild($tbody);
      return $table;
    }
    
}
