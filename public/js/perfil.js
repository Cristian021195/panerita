import {mensaje} from './popups.js';
export function existePerfil(){
    //DOM GLOBALES
    const $error = document.getElementById('error');
    const $telefono = document.getElementById('telefono');
    const $direccion = document.getElementById('direccion');
    const $email = document.getElementById('email');
    const $editarPerfil = document.getElementById('editarPerfil');
    //PINTAR DATOS DE LOCALSTORAGE
    $telefono.value = JSON.parse(localStorage.getItem('datos')).telefono;
    $direccion.value = JSON.parse(localStorage.getItem('datos')).direccion;
    $email.value = JSON.parse(localStorage.getItem('datos')).id;


    $editarPerfil.addEventListener('submit', (e)=>{
        e.preventDefault();
        let datos = new FormData($editarPerfil);
        
        if(datos.get('direccion').length > 0 && datos.get('direccion').length < 10){
            $error.innerHTML = '<div class="alert alert-danger">¡La direccion debe ser mas larga!</div>';
            mensaje($error);
        }else if(datos.get('contra').length > 0 && datos.get('contra-verifica').length > 0){
            if(datos.get('contra') == datos.get('contra-verifica')){
                editarPerfil(datos);
            }else{
                $error.innerHTML = '<div class="alert alert-danger">¡Las contraseñas no coinciden!</div>';
                mensaje($error);
            }
        }else if(datos.get('contra') == '' && datos.get('contra-verifica').length == ''){
            datos.delete('contra'); datos.delete('contra-verifica');
            editarPerfil(datos);
        }else if((datos.get('contra').length > 0 && datos.get('contra-verifica').length < 8) || (datos.get('contra').length < 8 && datos.get('contra-verifica').length > 0)){
            datos.delete('contra'); datos.delete('contra-verifica');
            editarPerfil(datos);
        }
    });

    async function editarPerfil(datos){
        try {
            let respuesta = await fetch('/panerita/ajax/usuarios/editar-perfil-alt.php', {method:'POST', body:datos});
            let res = await respuesta.json();//la respuesta es convertida a json return array("error"=>false, "id"=>"$_mail", "telefono"=>"$_telefono", "direccion"=>"$_direccion");
            if(!res.error){
                alertify.success('¡Datos Modificados!');
                let datosAux = JSON.parse(localStorage.getItem('datos'));
                datosAux.direccion = res.direccion;
                datosAux.id = res.id;
                datosAux.telefono = res.telefono;

                localStorage.removeItem('datos');
                localStorage.setItem('datos', JSON.stringify(datosAux));

                window.history.back();
            }else{
                $error.innerHTML = `<div class="alert alert-danger">¡${res.mensaje}!</div>`;
                mensaje($error);
            }
        } catch (error) {
            $error.innerHTML = `<div class="alert alert-danger">${error}</div>`;
            mensaje($error);
        }
    }
}
