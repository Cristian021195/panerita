import {loader} from './helpers/loader.js';
export function existeStock(){
    //DOM GLOBALES
    const $filtrarStock = document.getElementById('filtrarStock');
    const $f_producto = document.getElementById('f_producto');
    const $f_zona = document.getElementById('f_zona');
    const $sectionFirst = document.getElementById('sectionFirst');
    const $sectionHeader = document.getElementById('sectionHeader'); //$sectionHeader.appendChild(loader(50,1))
    const $sectionSecond = document.getElementById('sectionSecond');
    const $loader = document.getElementById('loader');
    const $recargar = document.getElementById('recargar');

    //VARIABLES
    const perfil = JSON.parse(localStorage.getItem('datos')).tipo;
    listadoDeStock();
    /*const liveStock = setInterval(() => {
        listadoDeStock();
    }, 3000);*/

    $recargar.addEventListener('click', ()=>{
        $loader.appendChild(loader(40,1));
        listadoDeStock();
    })

    /*document.body.addEventListener('click', (e)=>{
        if(e.target.href){
            console.log('matamos interval')
            clearInterval(liveStock);
        }
    })*/

    //ASIGNACIONES
    if(perfil != 'super'){
        $f_zona.parentElement.previousElementSibling.remove()
        $f_zona.remove();
    }


    //PERMISOS


    //FUNCIONES
    

    //BUSCAR STOCKS
    $f_producto.addEventListener('input', (e=>{
        $sectionFirst.innerHTML = '';
        if(e.target.value.length >= 3 && e.target.value.length <= 16){
            listadoDeStock();
        }else if(e.target.value.length == 0){
            listadoDeStock();
        }
    }));
    $filtrarStock.addEventListener('submit', (e)=>{
        e.preventDefault();
        //$sectionFirst.innerHTML = '';
        $f_producto.value = '';
        listadoDeStock();
    })


    async function listadoDeStock(){
        let datos = new FormData($filtrarStock);
        try{
            let respuesta = await fetch('/panerita/ajax/stock/listado-stock.php', {
                method: 'POST',
                body: datos
            });
            let res = await respuesta.json();//la respuesta es convertida a json
            if(res.length > 0){
                $sectionFirst.innerHTML = '';
                $sectionFirst.appendChild(crearTabla(res));
                //console.log(res);
                agregarEventos();
            }
            $loader.innerHTML = '';
        }catch(error){
            $loader.innerHTML = '';
            alertify.error("Error al conectar base de datos, intente nuevamente, si persiste llame con el administrador..");
        }
    }

    function crearTabla(data){
    //dom globales

        //console.log(final);
        let $table = document.createElement('table'); $table.classList.add('table'); $table.classList.add('table-striped');
        let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');

        //asignaciones
        $thead.innerHTML = '<th>NOMBRE</th><th width="50px">CANTIDAD</th><th>ACCION</th>';
        data.forEach(td => {
            let $tr = document.createElement('tr');
            $tr.innerHTML = `<td>${td.nombre}</td><td><input type="number" min="0" step="1" value="${td.cantidad}" class="form-control"></input></td><td><button class="btn guardar" data-guardar="${td.id_producto}">💾</button></td>`;
            $tbody.appendChild($tr);
        });
        $table.appendChild($tbody);
        $table.appendChild($thead);
        return $table;

    }
    function agregarEventos(){
        document.querySelector('table').querySelectorAll('.guardar').forEach(btn =>{
            btn.addEventListener('click', (id)=>{
                editar(id.target.parentElement.previousElementSibling.firstChild.value, id.target.dataset.guardar);
            });
        });
    }

    function bloquearComandos(){
        document.querySelectorAll('.guardar').forEach(btn =>{
            btn.setAttribute('disabled',true);
        });
    }

    function desbloquearComandos(){
        document.querySelectorAll('.guardar').forEach(btn =>{
            btn.removeAttribute('disabled');
        })
    }

    function editar(cantidad, id){//esta funcion la podemos poner en un modulo y usarla para las demas secciones
        let datos = new FormData(); datos.set('cantidad', cantidad); datos.set('producto', id);
        $loader.appendChild(loader(40,1));
        bloquearComandos();

        fetch('/panerita/ajax/stock/editar-stock.php',{
            method:'POST',
            body:datos
        }).then(res => {return res.json()})
        .then(data => {
            $loader.innerHTML = '';
            desbloquearComandos();
            if(!data.error){
                alertify.success("¡Stock modificado!");
            }else{
                alertify.error("¡Error al modificar!");
            }
        })
        .catch(error => {
            $loader.innerHTML = '';
            desbloquearComandos();
            alert("Error al conectar base de datos, intente nuevamente, si persiste llame con el administrador..");
        })
    }
    

}