import {existeComprobante} from './comprobantes.js';
import {existeProducto} from './productos.js';
import {existeCliente} from './clientes.js';
import {existeCierre} from './cierre.js';
import {existeVenta} from './ventas.js';
import {existeCarga} from './cargas.js';
import {existeCargaMasiva} from './carga-masiva.js';
import {existeUsuario} from './usuarios.js';
import {existeNota} from './notas.js';
import {existePerfil} from './perfil.js';
import {existeFotoPerfil} from './foto-perfil.js';
import {existeStock} from './stock.js';
import {existeNuevoComprobante} from './nuevo-comprobante.js';
import {existeEditarComprobante} from './editar-comprobante.js';
import {navServiceWorker} from './service-worker.js';
import {loader} from './helpers/loader.js';
document.addEventListener('DOMContentLoaded', (dom)=>{
    //SESSIONES SOBRE DOM
    let tipo = JSON.parse(localStorage.getItem('datos')).tipo;

    const $ALLDOM = document.querySelector('body');
    
    let $loader;

    $ALLDOM.addEventListener('click', (e)=>{
        if(e.target.getAttribute('type') === 'submit'){
            document.querySelector('#error').appendChild(loader(100,1));
        }
    })
    

    //Rutas
    page('/panerita', comprobantes);
    page('/panerita/comprobantes', comprobantes);
    page('/panerita/productos', productos);
    page('/panerita/clientes',  clientes);
    page('/panerita/cierre', cierre);
    page('/panerita/ventas', ventas);
    page('/panerita/cargas',  cargas);
    page('/panerita/carga-masiva', cargaMasiva);
    page('/panerita/usuarios', usuarios);
    page('/panerita/notas',  notas);
    page('/panerita/nuevo-comprobante',  nuevoComprobante);
    page('/panerita/editar-comprobante/:id',  editarComprobante);
    page('/panerita/listado/:rango',  paginacionComprobante);
    page('/panerita/clientes/:rango',  paginacionClientes);
    page('/panerita/perfil',  perfil);
    page('/panerita/stock', stock);
    page('/panerita/foto-perfil',  fotoPerfil);
    //page.stop('/panerita/ajax/impresion/impresion-comprobante.php', (ctx, next)=>{console.log('salio')})
    /*page('/nosotros/:valor',  nosotros);        page('/comprobante/:numero/detalle', comprobante);        page('/user/:user/album', album)        page('/user/:user/album/sort', sort)*/
    //page('*', notFound);
    page();
    function comprobantes(){
        let titulo = '📁 Comprobantes';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/comprobantes.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeComprobante();$loader = document.getElementById('loader');});
        animacion();
    }
    function productos(){
        let titulo = '🛒 Productos';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/productos.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeProducto();});
        animacion();
    }
    function clientes(){
        let titulo = '👥 Clientes';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/clientes.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeCliente();$loader = document.getElementById('loader');});
        animacion();
    }
    function cierre(){
        let titulo = '📅 Cierre';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/cierre.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeCierre();});
        animacion();
    }
    function ventas(){
        let titulo = '📈 Ventas';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/ventas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeVenta();});
        animacion();
    }
    function cargas(){
        let titulo = '📩 Cargas';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/cargas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeCarga();});
        animacion();
    }
    function stock(){
        let titulo = '📦 Stock';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/stock.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeStock();});
        animacion();
    }
    function cargaMasiva(){
        let titulo = '🖨️ Carga Masiva';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/carga-masiva.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeCargaMasiva();});
        animacion();
    }
    function usuarios(){
        let titulo = '👤 Usuarios';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/usuarios.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeUsuario();});
        animacion();
    }
    function notas(){
        let titulo = '📝 Notas';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/notas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeNota();});
        animacion();
    }
    function nuevoComprobante(){
        let titulo = 'Nuevo Comprobante';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/nuevo-comprobante.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeNuevoComprobante();});
        animacion();
    }
    function editarComprobante(id){
        let titulo = 'Editar Comprobante';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        obtenerComprobante(id.params.id);
        //fetch('/panerita/views/sections/editar-comprobante.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeNuevoComprobante();});
        //animacion();
    }

    function paginacionClientes(rango){
        //$loader.appendChild(loader(40,1));
        let datos = new FormData();
        datos.append('rango', rango.params.rango);
        fetch('/panerita/ajax/clientes/rango-clientes.php', {
            method:'POST',
            body:datos
        }).then(res => {return res.json()})
        .then(res => {
            //$loader.innerHTML = '';
            //DOM GLOBALES
            let $sectionFirst = document.getElementById('sectionFirst');
            let $table = document.getElementsByTagName('table')[0];
            let $tbody = document.getElementsByTagName('tbody')[0];
            $table.innerHTML = ''; $tbody.innerHTML = '';
            if(tipo == 'administrador' || tipo == 'super'){
                $table.appendChild(crearCabeceraCliente(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpoCliente(res));        
            }else if(tipo == 'empleado'){
                $table.appendChild(crearCabeceraClienteEmpleado(Object.keys(res[0]), res[0].length));
                $table.appendChild(crearCuerpoClienteEmpleado(res));
            }
            $sectionFirst.appendChild($table);
            animateSection();
            agregarEventosClientes();
        }).catch(err=>{
            //$loader.innerHTML = '';
            alert('Sin conexion a BBDD, intente nuevamente si persiste llame al administrador..');
        })
    }
    function agregarEventosClientes(){
        document.querySelector('table').querySelectorAll('.eliminar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                eliminarCliente(id.target);
            });
        });
        document.querySelectorAll('.editar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                editarCliente(id.target);                
            });
        });
    }
    function eliminarCliente(id_cliente){//esta funcion la podemos poner en un modulo y usarla para las demas secciones        
        alertify.confirm("¿Eliminar Cliente?",
            function(){
                let selected = id_cliente.id;        
                let datos = new FormData();
                datos.append('id_cliente', selected);
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
                }).catch(e =>{
                    $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                    mensaje($error);
                })
        });
    }

    //EDITAR - CARGAR DATOS PARA EDITAR
    function editarCliente(id_cliente){//esta funcion la podemos poner en un modulo (pasando el $modal correspondiente ) y usarla mostrar el modal correspondiente
        let datos = new FormData(); datos.append('id_cliente', id_cliente.id);
        let tr = id_cliente.parentNode.parentNode.getElementsByTagName('td');
        pintarDatos(['e_estado','e_nombre','e_identificador','e_tipo','e_telefono','e_mail','e_direccion'],tr,'e_id', id_cliente.id);
    }
    function pintarDatos(identificadores,valores,id, id_valor){//en el modal
        document.getElementById(id).value = id_valor;
        identificadores.forEach((identificador, i) => {
            document.getElementById(identificador).value = valores[i].textContent;
        });
    }

    function paginacionComprobante(rango){
        $loader.appendChild(loader(40,1));
        let datos = new FormData();
        datos.append('rango', rango.params.rango);
        //obtenerComprobante(rango.params.rango);
        fetch('/panerita/ajax/comprobantes/rango-comprobantes.php', {
            method:'POST',
            body:datos
        }).then(res => {return res.json()})
        .then(res => {
            //DOM GLOBALES
            $loader.innerHTML = '';
            let $sectionFirst = document.getElementById('sectionFirst');
            let $table = document.getElementsByTagName('table')[0];
            let $tbody = document.getElementsByTagName('tbody')[0];
            $table.classList.add('table'); $table.classList.add('table-striped');
            $table.innerHTML = ''; $tbody.innerHTML = '';
            $table.appendChild(crearCabecera(Object.keys(res[0]), res[0].length));
            $table.appendChild(crearCuerpo(res));                
            $sectionFirst.appendChild($table);
            animateSection();
            agregarEventos();
        }).catch(err=>{
            $loader.innerHTML = '';
            alert('Sin conexion a BBDD, intente nuevamente si persiste llame al administrador..');
        })
    }
    function perfil(){
        let titulo = '👤 Mi Perfil';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/perfil.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existePerfil();});
        animacion();
    }
    function fotoPerfil(){
        let titulo = '🖼️ Mi Foto';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/sections/foto-perfil.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeFotoPerfil();});
        animacion();
    }
    function notFound(){
        /*let titulo = '⚠️ 404';
        document.querySelector('.navbar-brand').textContent = titulo; document.title = titulo;
        fetch('/panerita/views/partials/404.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
        animacion();*/
    }
    function animacion(){
        document.getElementById('main').classList.add('slideOut');
        setTimeout(() => {
            document.getElementById('main').classList.remove('slideOut');
        }, 500);
    }
    function animateSection(){
        document.getElementById('sectionFirst').classList.add('bounceIn');
        setTimeout(() => {
            document.getElementById('sectionFirst').classList.remove('bounceIn');
        }, 500);
    }
    //FUNCIONES AUXILIARES COMPROBANTES
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
        let $tbody = document.createElement('tbody');
        let color = '';
        cabecera.forEach(e=>{
            if(e.estado == 'pendiente'){
              color = 'badge bg-warning';
            }else if(e.estado == 'pagado'){
              color = 'badge bg-success';
            }else{
              color = 'badge bg-danger';
            }
            $tbody.innerHTML += `<tr><td>${e.fecha}</td><td>${e.cliente}</td><td>${e.vendedor}</td><td><h5><span class="${color}">${e.estado}<span></h5></td><td>${e.total}</td>
            <td><button class="btn eliminar" id="${e.id_comprobante}">🗑️</button>
            <a class="btn editar" href="/panerita/editar-comprobante/${e.id_comprobante}">✏️</a>
            <button class="btn imprimir" id="${e.id_comprobante}">🖨️</button></td></tr>`;
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
      document.querySelectorAll('.imprimir').forEach(btn =>{
        btn.addEventListener('click', (id)=>{
            imprimir(id.target);
        });
      });
    }

    //FUNCIONES AUXILIARES CLIENTES
    function crearCabeceraCliente(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>${_cabecera[5]}</th><th>${_cabecera[6]}</th><th>ACCIONES</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }   
    }
    function crearCabeceraClienteEmpleado(cabecera){
        if(cabecera != null){
            let $thead = document.createElement('thead');
            let _cabecera = cabecera.map(e=>{return e.toUpperCase()});
            $thead.innerHTML += `<tr><th>${_cabecera[1]}</th><th>${_cabecera[2]}</th><th>${_cabecera[3]}</th><th>${_cabecera[4]}</th><th>${_cabecera[5]}</th><th>${_cabecera[6]}</th></tr>`;
            return $thead;
        }else{
            return $alert;
        }   
    }

    function crearCuerpoCliente(cabecera){
        let $tbody = document.createElement('tbody');
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td hidden>${e.estado}</td><td>${e.nombre}</td><td>${e.dni}</td><td>${e.tipo}</td><td>${e.telefono}</td><td>${e.mail}</td><td>${e.direccion}</td>
            <td><button class="btn eliminar" id="${e.id_cliente}">🗑️</button>
            <button class="btn editar" id="${e.id_cliente}" data-toggle="modal" data-target="#editarCliente">✏️</button></td></tr>`;
        });
        return $tbody;
    }

    function crearCuerpoClienteEmpleado(cabecera){
        let $tbody = document.createElement('tbody');
        cabecera.forEach(e=>{
            $tbody.innerHTML += `<tr><td hidden>${e.estado}</td><td>${e.nombre}</td><td>${e.dni}</td><td>${e.tipo}</td><td>${e.telefono}</td><td>${e.mail}</td><td>${e.direccion}</td></tr>`;
        });
        return $tbody;
    }

    //ELIMINAR
    function eliminar(id_comprobante){//esta funcion la podemos poner en un modulo y usarla para las demas secciones
        alertify.confirm("¿Eliminar Comprobante?",
        function(){
          let selected = id_comprobante.id;        
          let datos = new FormData();
          datos.append('id_comprobante', selected);
          fetch('/panerita/ajax/comprobantes/eliminar-comprobante.php', {
              method: 'POST',
              body: datos
          })
          .then(res => {return res.json()})
          .then(res => {
              if(!res.error){
                id_comprobante.parentNode.parentNode.remove();
              }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
                mensaje($error);
              }
          }).catch(e =>{
              $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.mensaje} <br></div>`;
              mensaje($error);
          })
        });
    }
    function imprimir(id){
        let datos = new FormData(); datos.append('id_comprobante', id.id);
        imprimirComprobante(datos);
    }
    //IMPRESION
    async function imprimirComprobante(datos){
        try{
            let respuesta = await fetch('/panerita/ajax/comprobantes/obtener-comprobante.php', {
              method: 'POST',
              body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
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
                }
            }
        }catch(error){
            alertify.error('¡Error de excepcion!'+error);
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


    //EDITAR COMPROBANTE
    function obtenerComprobante(id){
        let datos = new FormData(); datos.append('id_comprobante', id);
        fetch('/panerita/ajax/comprobantes/obtener-comprobante.php', {
            method: 'POST',
            body: datos
        })
        .then(data => {return data.json()})
        .then(data => {
            if(data.length > 0){
                fetch('/panerita/views/sections/editar-comprobante.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;existeEditarComprobante(data, id);});                
                animacion();
            }else{
                return null;
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

});

