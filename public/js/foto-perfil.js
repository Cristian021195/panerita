export function existeFotoPerfil(){ 
    //DOM GLOBALES
    const $foto = document.getElementById('foto');
    const $archivo = document.getElementById('archivo');
    const $guardar = document.getElementById('guardar');
    const $izquierda = document.getElementById('izquierda');
    const $derecha = document.getElementById('derecha');

    //MODIFICACIONES DEL DOM

    //VARIABLES Y AUXILIARES

    let $croppie = new Croppie($foto, {
        viewport: { width: 200, height: 200 },
        boundary: { width: 300, height: 300 },
        showZoomer: false,
        enableOrientation: true
    });

    $croppie.bind({
        url: `/panerita/profiles/img/${JSON.parse(localStorage.getItem('datos')).foto}`,
        orientation: 1
    });

    $archivo.addEventListener('change' ,(file)=>{
        let reader = new FileReader();
        reader.onload = (e)=>{
            let dataURL = reader.result;
            $croppie.bind({
                url: dataURL,
                orientation: 1
            });
        }
        reader.readAsDataURL(file.target.files[0]);
    });

    $izquierda.addEventListener('click', ()=>{
        $croppie.rotate(90);
    });
    $derecha.addEventListener('click', ()=>{
        $croppie.rotate(-90);
    });

    $guardar.addEventListener('click', ()=>{
        let datos = new FormData();
        $croppie.result('blob').then(function(blob) {
            datos.append('foto', blob);
            datos.append('nombre', JSON.parse(localStorage.getItem('datos')).nombre.toLowerCase());
            datos.append('anterior', JSON.parse(localStorage.getItem('datos')).foto);
            datos.append('id', JSON.parse(localStorage.getItem('datos')).id.toLowerCase());

            fetch('/panerita/ajax/usuarios/editar-foto.php',{
                method:'POST',
                body: datos
            }).then(res => {
                return res.json();                
            }).then(res=>{
                let auxData = JSON.parse(localStorage.getItem('datos'));
                auxData.foto = res.foto; localStorage.removeItem('datos');
                localStorage.setItem('datos', (JSON.stringify(auxData)));
                document.querySelector('.side-ul-pic').src = `/panerita/profiles/img/${res.foto}`;
                history.back(3);
            })
            .catch(err => {console.error(err)})
        });
    });
}
