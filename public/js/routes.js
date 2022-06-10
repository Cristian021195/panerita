document.addEventListener('DOMContentLoaded', (e)=>{
        page('/panerita', comprobantes);
        page('/comprobantes', comprobantes);
        page('/productos', productos);
        page('/clientes',  clientes);
        page('/cierre', cierre);
        page('/ventas', ventas);
        page('/cargas',  cargas);
        page('/carga-masiva', cargaMasiva);
        page('/usuarios', usuarios);
        page('/notas',  notas);
        /*page('/nosotros/:valor',  nosotros);        page('/comprobante/:numero/detalle', comprobante);        page('/user/:user/album', album)        page('/user/:user/album/sort', sort)*/
        page('*', notfound);
        page();
        function comprobantes(){
            fetch('/panerita/views/sections/comprobantes.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            //document.getElementById('main').textContent = 'estamos en inicio';
            animacion();
        }
        function productos(){
            fetch('/panerita/views/sections/productos.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function clientes(){
            fetch('/panerita/views/sections/clientes.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function cierre(){
            fetch('/panerita/views/sections/cierre.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function ventas(){
            fetch('/panerita/views/sections/ventas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function cargas(){
            fetch('/panerita/views/sections/cargas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function cargaMasiva(){
            fetch('/panerita/views/sections/carga-masiva.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function usuarios(){
            fetch('/panerita/views/sections/usuarios.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function notas(){
            fetch('/panerita/views/sections/notas.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function notfound(){
            fetch('/panerita/views/partials/404.html').then(res => {return res.text()}).then(res => {document.getElementById('main').innerHTML = res;});
            animacion();
        }
        function animacion(){
            document.getElementById('main').classList.add('slideOut');
            setTimeout(() => {
                document.getElementById('main').classList.remove('slideOut');
            }, 500);
        }
})