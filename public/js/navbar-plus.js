document.addEventListener('DOMContentLoaded', ()=>{

    //VARIABLES
    let $navBar = document.querySelector('.navbar');
    let $sidePic = document.createElement('div'); $sidePic.innerHTML = `<img class="img-fluid side-ul-pic" src=""></img>`;
    let navHeigth = document.getElementsByTagName('nav')[0].clientHeight;
    let $sideNavClasses = $navBar.classList;
    let $sideDiv = document.getElementById('navbarSupportedContent');
    let $sideDivClone = $sideDiv.cloneNode(true);
    let colorTheme = obtenerColor($navBar.parentElement.classList);
    let colorFont = obtenerColorLetra($sideNavClasses);
    let sideNavState = false;
    let sideBarColor;
    let leftTolerance = window.innerWidth / 6;

    if($navBar.dataset.sideColor !== undefined){
        sideBarColor = `bg-${$navBar.dataset.sideColor}`;
    }else{
        sideBarColor = 'bg-';
    }

    let sideBarLetterColor;
    if($navBar.dataset.letterColor !== undefined){
        sideBarLetterColor = $navBar.dataset.letterColor;
    }else{
        sideBarLetterColor = colorFont;
    }

    let toggleTime;
    if($navBar.dataset.toggleDuration !== undefined){
        toggleTime = parseInt($navBar.dataset.toggleDuration);
    }else{
        toggleTime = 250;
    }
    
    //ASIGNACIONES, INSERSIONES DE DOM, CLONADO DE DOM OBJECT EXISTENTE (navbar existente)
    $sideDivClone.insertAdjacentElement('afterbegin',$sidePic);
    $sideDivClone.removeAttribute('class'); $sideDivClone.removeAttribute('id');
    document.body.appendChild($sideDivClone);
    $sideDivClone.style.height = `${window.innerHeight - navHeigth}px`;
    $sideDivClone.style.top = `${navHeigth}px`;
    $sideDivClone.classList = $sideNavClasses;
    $sideDivClone.classList.remove('container'); $sideDivClone.classList.remove('navbar'); $sideDivClone.classList.remove('navbar-expand-lg'); $sideDivClone.classList.add('d-none');
    $sideDivClone.classList.add('overflow-auto');
    $sideDivClone.classList.add(`overflow`);
    $sideDivClone.classList.replace(`bg-${colorTheme}`, `${colorSideBar(sideBarColor, `bg-${colorTheme}`)}`);
    $sideDivClone.classList.replace(colorFont, `${colorSideBarLetter(sideBarLetterColor, colorFont)}`);
    
    //EVENTO NO REQUERIDO: por si necesitamos rescatar datos de una session y mostrar foto + nombre localStorage.getItem('miGato');
    /*fetch('data.json').then(res=>{return res.json()}).then(res => { 
        let $sideUlPic = document.querySelector('.side-ul-pic');        
        $sideUlPic.src = res.pic;
        $sideUlPic.insertAdjacentHTML('afterend', `<p class="navbar-brand" href="#">${res.username}</p>`);
    });*/
    cargarDatosUsuario();


    //EVENTO RESIZE: para cerrar el sidebar y dejarlo inactivo
    window.addEventListener('resize', ()=>{
        $sideDivClone.style.height = `${window.innerHeight - navHeigth}px`;
        if(window.innerWidth >= 1000){
            $sideDivClone.classList.add('d-none');
            sideNavState = false;
        }
    });

    //EVENTO CLICK (exclusivo boostrap 5)
    window.addEventListener('click', (e)=>{
        if(e.target.matches(".navbar-toggler") || e.target.matches(".navbar-toggler-icon")){
            toggleSideBar(toggleTime);
        }else if(e.target.matches(".dropdown-item") || e.target.matches(".nav-link") || e.target.matches(".side-ul") || e.target.matches(".side-ul-pic") || e.target.matches(".navbar-brand") || e.target.matches(".container-fluid")){
        }else{
            slowSlideHide(toggleTime);
            sideNavState = !sideNavState;
        }
    });

    //DETECCION DE MOBIL
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        let direccion = [];

        //document.querySelector('.navbar-toggler').style.display = 'none';

        window.addEventListener('touchstart', (e)=>{
            direccion.push(e.touches[0].pageX);
        });
        window.addEventListener('touchend', (e)=>{
            direccion.push(e.changedTouches[0].screenX);
            evaluarDireccion(direccion, toggleTime);
            direccion = [];
        });
    }

    //FUNCIONES
    function cargarDatosUsuario(){
        let datos = JSON.parse(localStorage.getItem('datos'));
        let $sideUlPic = document.querySelector('.side-ul-pic');
        $sideUlPic.src = `/panerita/profiles/img/${datos.foto}`;
        $sideUlPic.insertAdjacentHTML('afterend', `<p class="navbar-brand text-wrap" href="#">${datos.nombre}</p>`);
        document.querySelector('#logout .modal-body').innerHTML =`<h5>${datos.nombre}, ¿Salir?</h5>`;
        document.querySelectorAll('.navbarDropdown')[0].textContent = `🔒 ${datos.zona}`;
        document.querySelectorAll('.navbarDropdown')[1].textContent = `🔒 ${datos.zona}`;
    }
    function removerDatosUsuario(){
        let datos = JSON.parse(localStorage.getItem('datos'));
        let $sideUlPic = document.querySelector('.side-ul-pic');
        $sideUlPic.src = `/panerita/profiles/img/default.svg`;
        $sideUlPic.insertAdjacentHTML('afterend', ``);
        document.querySelector('#logout .modal-body').innerHTML =``;
    }

    //SWIPE
    function evaluarDireccion(direccion, time){//evaluar mejorar para swipe misma direccion
        if(direccion[0] < leftTolerance){
            if(direccion[0] < direccion[1] && (direccion[1] / direccion[0]) > 2){
                slowSlideShow(time);
            }
        }else{
            if(direccion[0] > direccion[1] && (direccion[0] / direccion[1]) > 2){
                slowSlideHide(time);
            }
        }
        /*if(direccion[0] < direccion[1] && (direccion[1] / direccion[0]) > 2){//TOLERANCIA
            slowSlideShow(time);
        }else if(direccion[0] > direccion[1] && (direccion[0] / direccion[1]) > 2){
            slowSlideHide(time);
        }*/
    }
    
    function toggleSideBar(time){
        sideNavState = !sideNavState;
        if(sideNavState){
            slowSlideShow(time);
        }else{
            slowSlideHide(time);
        }
    }
    function slowSlideShow(time){
        $sideDivClone.classList.add('side-ul');
        $sideDivClone.classList.remove('d-none');

        $sideDivClone.animate([
            { transform: 'translateX(-100%)' }, 
            { transform: 'translateX(0%)' }
          ], {
            duration: time,
            easing: 'ease-in'
        });
        sideNavState = true;

    }
    function slowSlideHide(time){
        $sideDivClone.animate([
            { transform: 'translateX(0%)' }, 
            { transform: 'translateX(-100%)' }
          ], {
            duration: time,
            easing: 'ease-in'
        });
        setTimeout(() => {
            $sideDivClone.classList.add('d-none');
            sideNavState = false;
        }, time - 50);
    }

    function colorSideBar(newColor, defaultColor){
        if(newColor != "bg-" && newColor != ""){
            return newColor;
        }else{
            return defaultColor;
        }
    }
    function colorSideBarLetter(newColor, defaultColor){
        if(newColor != ""){
            return newColor;
        }else{
            return defaultColor;
        }
    }
    function obtenerColorLetra(domTokenListColor){
        if(domTokenListColor.contains('navbar-dark')){
            return 'navbar-dark';
        }else if(domTokenListColor.contains('navbar-light')){
            return 'navbar-light';
        }
    }

    function obtenerColor(domTokenListColor){
        let picker;
        if(domTokenListColor.contains('bg-primary')){
            picker = 'primary';
        }else if(domTokenListColor.contains('bg-secondary')){
            picker = 'secondary';
        }else if(domTokenListColor.contains('bg-info')){
            picker = 'info';
        }else if(domTokenListColor.contains('bg-danger')){
            picker = 'danger';
        }else if(domTokenListColor.contains('bg-warning')){
            picker = 'warning';
        }else if(domTokenListColor.contains('bg-success')){
            picker = 'success';
        }else if(domTokenListColor.contains('bg-light')){
            picker = 'light';
        }else if(domTokenListColor.contains('bg-white')){
            picker = 'white';
        }else if(domTokenListColor.contains('bg-dark')){
            picker = 'dark';
        }
        return picker;
    }
});
