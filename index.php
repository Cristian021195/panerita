<?php
session_start();
//session_destroy();
if(isset($_SESSION['logueado']) && $_SESSION['logueado'] == true){
    require('./views/partials/head.html');
    if($_SESSION['tipo'] == 'administrador' || $_SESSION['tipo'] == 'super'){
        require('./views/partials/header.html');
    }else if($_SESSION['tipo'] == 'empleado' || $_SESSION['tipo'] == 'secretaria'){
        require('./views/partials/header-empleado.html');
    }
    require('./views/partials/main.html');
}else{
    require('./views/partials/login-head.html');
    require('./views/partials/login.html');
}
?>


