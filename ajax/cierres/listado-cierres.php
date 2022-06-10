<?php
require('../../models/cierres.php');
$cierres = new CierresModel();

if(!empty($_POST['desde']) && !empty($_POST['hasta'])){

    $cierres->desde = $_POST['desde']." 00:00:00";
    $cierres->hasta = $_POST['hasta']." 23:59:59";
    $cierres->estado = $_POST['estado'];
    $cierres->estado_cliente = $_POST['estado-cliente'];

    
    if(!empty($_POST['identificador'])){
        $cierres->identificador = $_POST['identificador'];
        echo json_encode($cierres->readOne());

    }else{
        echo json_encode($cierres->read());
    }
}
?>