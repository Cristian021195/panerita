<?php
require('../../models/comprobantes.php');
require('../../helpers/empresa.php');
require('../../models/detalles.php');

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();
$json_detalle = [];

if(isset($_POST['id_comprobante']) && !empty($_POST['id_comprobante'])){
    $comprobante->id_comprobante = $_POST['id_comprobante'];
    $detalle->id_comprobante = $_POST['id_comprobante'];

    array_push($json_detalle, $empresa, $comprobante->readOne(), $detalle->readOne());
    echo json_encode($json_detalle);
}else{
    echo json_encode(array("error"=>true));
}




?>