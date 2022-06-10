<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../helpers/empresa.php');

$json = file_get_contents('php://input');
$cargas = json_decode($json);
$json_detalle = [];

foreach ($cargas as &$carga) {
    $comprobante = new ComprobantesModel();
    $detalle = new DetallesModel();
    $comprobante->id_comprobante = $carga->id_comprobante;
    $detalle->id_comprobante = $carga->id_comprobante;
    array_push($json_detalle, array("cabecera"=> $empresa,"comprobante"=>$comprobante->readOne(), "detalle"=>$detalle->readOne()));
}
echo json_encode($json_detalle);

?>