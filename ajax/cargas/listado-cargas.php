<?php
require('../../models/cargas.php');
$cargas = new CargasModel();

if(isset($_POST['zona'])){
    $cargas->zona = $_POST['zona'];
}else{
    //$cargas->zona = $_SESSION['zona'];
    $cargas->zona = 'catamarca';
}

if(!empty($_POST['desde']) && !empty($_POST['hasta'])){

    $cargas->desde = $_POST['desde']." 00:00:00";
    $cargas->hasta = $_POST['hasta']." 23:59:59";
    
    if(!empty($_POST['identificador'])){
        $cargas->identificador = $_POST['identificador'];
        echo json_encode($cargas->readOne());

    }else{
        echo json_encode($cargas->read());
    }
}
?>