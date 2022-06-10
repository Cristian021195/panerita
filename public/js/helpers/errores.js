export function Mensaje(err, excepcion){
    const $alert = document.createElement('div'); $alert.classList.add('alert','alert-danger','alert-dismissible','fade','show'); $alert.setAttribute('role','alert');

    if(excepcion == false || excepcion == undefined){
        $alert.innerHTML = `
            <strong>¡Error! </strong> ${err}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;    
    }else{
        $alert.innerHTML = `
            <strong>¡Error! ¡Posible error del servidor o conexion con base de datos!</strong> <hr>${err}<hr> 
             Cierre la sesion, espere unos minutos y vuelva a intentar, si persiste comuniquese con el administrador.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;    
    }    

    $alert.addEventListener('click', (e)=>{
        if(e.target.classList.contains('btn-close')){
            e.target.parentElement.remove();
        }
    })

    return $alert;
}