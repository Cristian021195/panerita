<?php
require('../../models/propios/detalles.php');
require('../../models/propios/stock.php');
require('../../models/propios/comprobantes.php');

$json = file_get_contents('php://input');
$data = json_decode($json);

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();
$nuevo_total = 0;

$comprobante->id_comprobante = $data->comprobante;
$detalle->id_comprobante = $data->comprobante;

$detalle->delete();

$previo = $data->previo;
$siguiente = $data->siguiente;
//var_dump($previo); //var_dump($siguiente);


foreach ($previo as &$prev) {
    $stock = new StockModel();
    $stock->id_producto = $prev->id_producto;
    $stock->cantidad = $prev->cantidad;
    $stock->updateStockSum();
}


foreach ($siguiente as &$sig) {
    $stock = new StockModel();
    $_detalle = new DetallesModel();
    $_detalle->id_producto = $sig->id_producto;
    $_detalle->id_comprobante = $comprobante->id_comprobante;
    $_detalle->cantidad = $sig->cantidad;
    $_detalle->devolucion = $sig->devolucion;
    $_detalle->precio = $sig->precio;

    $nuevo_total += (float)$sig->precio * (int)$sig->cantidad;

    $_detalle->create();

    $stock->id_producto = $sig->id_producto;
    $stock->cantidad = $sig->cantidad;
    $stock->updateStock();
}

$comprobante->total = $nuevo_total;
$comprobante->update();
$nuevo_total = 0;
$comprobante = null;
$detalle = null;
$stock = null;

echo json_encode(array("error"=>false));
?>