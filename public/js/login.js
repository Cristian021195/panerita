document.addEventListener('DOMContentLoaded', ()=>{
    const $error = document.querySelector('#error');
    const $login = document.getElementById('login');
    
    if(document.querySelector('.disclaimer') !== undefined){
        document.querySelector('.disclaimer').remove()
    }


    $login.addEventListener('submit', (e)=>{
        e.preventDefault();

        const datos = new FormData($login);
        loguear(datos);
    });

    async function loguear(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('ajax/login.php',{
                method: 'POST',
                body: datos
            });//guardamos la respuesta de fetch que demora en respuesta
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                datosDeUsuario(data.datos);
                window.location = "/panerita"; 
            }else{
                $error.innerHTML = `<div class="alert alert-danger"><b>¡Error!:</b> ${data.error}<br></div>`;
                mensaje($error);
            }
        }
        catch(error){//bloque de errores
            $error.innerHTML = `<div class="alert alert-danger"><b>Error de exepcion: </b>${error}</div>`;
            mensaje($error);
        }  
    }

    function mensaje($error){
        setTimeout(()=>{
            $error.innerHTML = '';
        }, 3000);
    }

    function datosDeUsuario(dato){
        localStorage.setItem('datos', JSON.stringify(dato));
    }
});