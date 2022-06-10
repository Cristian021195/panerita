<?php
require('../../models/cargas.php');
$json = file_get_contents('php://input');
$data = json_decode($json);
$error = true;

$json_response = array("general"=>$data);
//echo json_encode($json_response);

foreach ($data as &$valor) {
    $carga = new CargasModel();
    $carga->id_comprobante = $valor->id_comprobante;
    $error = $carga->create();
}

if(!$error){
    $_carga = new CargasModel();
    $ventas = $_carga->mostrarCargas();
    $_carga->deleteCargas();
    array_push($json_response, $ventas);
    echo json_encode($json_response);
}
?>