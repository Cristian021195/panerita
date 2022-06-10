document.addEventListener('DOMContentLoaded', ()=>{
    const $error = document.querySelector('#error');
    const $logout = document.getElementById('logout');

    $logout.addEventListener('submit', (e)=>{
        e.preventDefault();

        const datos = new FormData($logout);
        desloguear(datos);
    });

    async function desloguear(datos){
        try{//bloque de ejecucion
            let respuesta = await fetch('/panerita/ajax/logout.php',{
                method: 'POST',
                body: datos
            });//guardamos la respuesta de fetch que demora en respuesta
            let data = await respuesta.json();//la respuesta es convertida a json
            if(!data.error){
                localStorage.removeItem('datos');
                if ('serviceWorker' in navigator) {
                    caches.keys().then(function(cacheNames) {
                      cacheNames.forEach(function(cacheName) {
                        caches.delete(cacheName);
                      });
                    });
                }
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
});