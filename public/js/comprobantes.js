import {mensaje} from './popups.js';
import { loader } from './helpers/loader.js';
export function existeComprobante(){
  //DOM GLOBALES
  const $sectionFirst = document.getElementById('sectionFirst');
  const $error = document.getElementById('error');
  const $filtrarComprobantes = document.getElementById('filtrarComprobantes');
  const $input = document.getElementById('f_comprobante');
  const $paginacion = document.getElementById('paginacion');
  //const $sectionFirstModal = document.getElementById('sectionFirstModal');
  const $alert = document.createElement('div'); $alert.classList.add('alert'); $alert.classList.add('alert-danger');
  const $table = document.createElement('table');
  const $tbody = document.createElement('tbody');
  const $gestionComprobante = document.getElementById('gestion-comprobante');
  $table.classList.add('table'); $table.classList.add('table-striped');
  const $loader = document.getElementById('loader');

  //ASIGNACIONES A DOM
  const $permisoComprobante = document.createElement('button'); $permisoComprobante.classList.add('btn'); $permisoComprobante.classList.add('btn-warning');
  $permisoComprobante.textContent = '🗑️ Eliminar Pagados'; $permisoComprobante.id = 'eliminarPagados';

  if(JSON.parse(localStorage.getItem('datos')).tipo == 'administrador'){
    $gestionComprobante.appendChild($permisoComprobante);
    document.getElementById('eliminarPagados').addEventListener('click', ()=>{
      alertify.prompt( '¿Eliminar Comprobantes Pagados?', 'Tendra que introducir la contraseña',''
      , function(evt, contra) {
        checkearUsuario(contra);
      }
      , function() {}
      ).set('type', 'password');
    });
  }


  let contador = {
    pagado: null,
    pendiente: null,
    deudor: null
  }
  let seleccion;

  contadorDeComprobantes();
  listadoDeComprobantes();
    //CONTADOR DE COMPROBANTES
    async function contadorDeComprobantes(){
      try{
          let respuesta = await fetch('/panerita/ajax/comprobantes/contador-comprobantes.php');
          let res = await respuesta.json();//la respuesta es convertida a json
          if(res.length > 0){              
              document.querySelector('.pagado').textContent = res[0].pagado;
              document.querySelector('.pendiente').textContent = res[0].pendiente;
              document.querySelector('.deudor').textContent = res[0].deudor;

              let cantidadComprobantes = parseInt(res[0].pagado) + parseInt(res[0].pendiente) + parseInt(res[0].deudor);
              let aux = cantidadComprobantes % 10;
              let modulos = parseInt(cantidadComprobantes / 10);
              if(aux > 0){
                modulos++;
              }
              if(modulos > 1){
                for(var i = 1; i <= modulos; i++){
                  $paginacion.innerHTML += `<li class="page-item"><a class="page-link" href="/panerita/listado/${i}">${i}</a></li>`;
                }
              }
              
          }
      }catch(error){
          alertify.error('¡Error de excepcion!');
      }
    }

    //CONTADOR DE COMPROBANTES
    async function eliminarPagados(){
      $loader.appendChild(loader(40,1));
      try{
          let respuesta = await fetch('/panerita/ajax/comprobantes/eliminar-pagados.php');
          let res = await respuesta.json();//la respuesta es convertida a json
          if(!res.error){
              alertify.success("¡Comprobantes Eliminados!");
              $sectionFirst.firstChild.remove();
              listadoDeComprobantes();
              contadorDeComprobantes();
          }else{
              alertify.error("¡No quedan comprobantes Pagados!");
          }
          $loader.innerHTML = '';
      }catch(error){
          $loader.innerHTML = '';
          alertify.error('¡Error de excepcion!');
      }
    }

    //CHECKEAR USUARIO
    async function checkearUsuario(contra){
      let datos = new FormData();
      datos.append('contra', contra);
      try{//bloque de ejecucion
          let respuesta = await fetch('/panerita/ajax/check-user.php',{
              method: 'POST',
              body: datos
          });//guardamos la respuesta de fetch que demora en respuesta
          let data = await respuesta.json();//la respuesta es convertida a json
          if(!data.error){
              eliminarPagados();
          }else{
              alertify.error(data.mensaje);
          }
      }
      catch(error){//bloque de errores
        alertify.error('¡Error de excepcion!');
      }
    }


    //BUSCAR CLIENTES
    $input.addEventListener('input', (e=>{
      if(e.target.value.length >= 3 && e.target.value.length <= 16){
          let datos = new FormData($filtrarComprobantes);
          fetch('/panerita/ajax/comprobantes/filtrado-comprobantes.php', {
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
              alert('Error de conexion con BBDD, intente unos momentos mas tarde, si persiste comuniquese con el administrador.');
          })
      }else if(e.target.value.length == 0){
        listadoDeComprobantes();
      }
    }));

    //LISTADO DE COMPROBANTES INICIAL
    async function listadoDeComprobantes(){
        try{
            let respuesta = await fetch('/panerita/ajax/comprobantes/listado-comprobantes.php');
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                $table.innerHTML = ''; $tbody.innerHTML = '';
                $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpo(res));                
                $sectionFirst.appendChild($table);
                agregarEventos();
            }
        }catch(error){
          alert('Sin conexion a la BBDD, vuelva a intentarlo mas tarde, si persiste llame al administrador..'+error);
        }
    }

    //FUNCIONES AUXILIARES
    function crearCabecera(cabecera){
      if(cabecera != null){
          let $thead = document.createElement('thead');
          let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
          $thead.innerHTML += `<tr><th>${_cabecera[0]}</th><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>ACCIONES</th></tr>`;
          return $thead;
      }else{
          return $alert;
      }      
    }
    function crearCuerpo(cabecera){
        let color = '';
        cabecera.forEach(e=>{
            if(e.estado == 'pendiente'){
              color = 'badge bg-warning';
            }else if(e.estado == 'pagado'){
              color = 'badge bg-success';
            }else{
              color = 'badge bg-danger';
            }
            $tbody.innerHTML += `<tr>
            <td>${e.fecha}</td><td>${e.cliente} <small class="fst-italic text-secondary">(${e.tipo})</small></td>
            <td>${e.vendedor} <small class="fst-italic text-secondary">(${e.tipo_vendedor})</small></td>
            <td><h5><span class="${color}">${e.estado}<span></h5></td><td>$${e.total}</td>
            <td><button class="btn eliminar" id="${e.id_comprobante}" data-estado="${e.estado}">🗑️</button>
            <a class="btn editar" href="/panerita/editar-comprobante/${e.id_comprobante}">✏️</a>
            <a class="btn imprimir-srv" href="/panerita/ajax/impresion/impresion-comprobante.php?id_comprobante=${e.id_comprobante}">🌐</a>
            <button class="btn imprimir" id="${e.id_comprobante}">🖨️</button></td>            
            </tr>`;//<a class="btn imprimir-srv" href="panerita/ajax/impresion/impresion-comprobante.php?id_comprobante=${e.id_comprobante}" target="_blank">🌐</a>
        });
        return $tbody;
    }
    function agregarEventos(){
      document.querySelector('table').querySelectorAll('.eliminar').forEach(btn =>{
          btn.addEventListener('click', (id)=>{
              eliminar(id.target);
              //console.log(id.target);
          });
      });
      /*document.querySelectorAll('.editar').forEach(btn =>{
          btn.addEventListener('click', (id)=>{
              editar(id.target);                
          });
      });*/
      document.querySelectorAll('.imprimir').forEach(btn =>{
        btn.addEventListener('click', (id)=>{
            imprimir(id.target);
        });
      });
    }

    function imprimir(id){
      let datos = new FormData(); datos.append('id_comprobante', id.id);
      imprimirComprobante(datos);
    }

    //ELIMINAR
    function eliminar(id_comprobante){//esta funcion la podemos poner en un modulo y usarla para las demas secciones
      alertify.confirm("¿Eliminar Comprobante?",
      function(){
        $loader.appendChild(loader(40,1));
        bloquearComandos();
        let selected = id_comprobante.id;
        let estado = id_comprobante.dataset.estado;
        let datos = new FormData();
        datos.append('id_comprobante', selected);
        datos.append('estado', estado);
        fetch('/panerita/ajax/comprobantes/eliminar-comprobante.php', {
            method: 'POST',
            body: datos
        })
        .then(res => {return res.json()})
        .then(res => {
            desbloquearComandos();
            $loader.innerHTML = '';
            if(!res.error){
              id_comprobante.parentNode.parentNode.remove();
            }else{
              $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
              mensaje($error);
            }
        }).catch(e =>{
            desbloquearComandos();
            $loader.innerHTML = '';
            alert('Sin conexion a la BBDD, vuelva a intentarlo mas tarde, si persiste llame al administrador..');
        })
      });
    }
    //IMPRESION
    async function imprimirComprobante(datos){
      $loader.appendChild(loader(40,1));
      bloquearComandos();
      try{
          let respuesta = await fetch('/panerita/ajax/comprobantes/obtener-comprobante.php', {
            method: 'POST',
            body: datos
          });
          let res = await respuesta.json();//la respuesta es convertida a json
          if(res.length > 0){
              desbloquearComandos();
              const $contenedor = document.createElement('div'); $contenedor.classList.add('comprobante');
              const $centrado = document.createElement('div'); $centrado.classList.add('centrado');
              const $contacto = document.createElement('div'); $contacto.classList.add('contacto');
              const $logo = document.createElement('img'); $logo.setAttribute('src', '/panerita/public/img/panerita-sm.svg');
              const $cierre = document.createElement('div'); $cierre.classList.add('cierre'); $cierre.innerHTML = `<b>TOTAL COMPROBANTE: $${res[1][0].total} | VENDEDOR: </b>${res[1][0].vendedor}`;

              $contacto.innerHTML = `<b>${res[0].empresa}  | Telefonos: </b>${res[0].telefono1} ${res[0].telefono2}`;

              $centrado.appendChild($logo);
              $contenedor.appendChild($centrado);
              $contenedor.appendChild($contacto);
              $contenedor.appendChild(generarTablaPrincipal(res[1][0]));
              $contenedor.appendChild(generarTablaDetalle(res[2]), $cierre);
              $contenedor.appendChild($cierre);

              let ventanaImpresion = open('/panerita/views/partials/impresion.html');
              ventanaImpresion.onload = function(){
                ventanaImpresion.document.title = res[1][0].cliente;
                ventanaImpresion.document.body.appendChild($contenedor);
                $loader.innerHTML = '';
              }
          }
      }catch(error){
          desbloquearComandos();
          $loader.innerHTML = '';
          alert('Sin conexion a la BBDD, vuelva a intentarlo mas tarde, si persiste llame al administrador..');
      }
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
      $thead.innerHTML = `<tr><th>${cabecera[0]}</th><th>${cabecera[1]}</th><th>${cabecera[2]}</th><th>${cabecera[3]}</th></tr>`;
      $tbody.innerHTML = `<tr><td>${datos.cliente}</td><td>${datos.direccion}</td><td>${datos.telefono}</td><td>${datos.fecha}</td></tr>`;

      $table.appendChild($thead); $table.appendChild($tbody);
      return $table;
    }
    function bloquearComandos(){
      document.querySelectorAll('.eliminar').forEach(e=>e.setAttribute('disabled', true));
      document.querySelectorAll('.editar').forEach(e=>e.setAttribute('disabled', true));
      document.querySelectorAll('.imprimir-srv').forEach(e=>e.setAttribute('disabled', true));
      document.querySelectorAll('.imprimir').forEach(e=>e.setAttribute('disabled', true));
    }

    function desbloquearComandos(){
      document.querySelectorAll('.eliminar').forEach(e=>e.removeAttribute('disabled'));
      document.querySelectorAll('.editar').forEach(e=>e.removeAttribute('disabled'));
      document.querySelectorAll('.imprimir-srv').forEach(e=>e.removeAttribute('disabled'));
      document.querySelectorAll('.imprimir').forEach(e=>e.removeAttribute('disabled'));
    }

}
