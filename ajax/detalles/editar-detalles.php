<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$json = file_get_contents('php://input');
$data = json_decode($json);
$total = 0;

$detalle = new DetallesModel();
$comprobante = new ComprobantesModel();//lo ponemos aqui porque debemos cambiar el precio del comprobante
$stock = new StockModel();

$detalle->id_comprobante = $data[0]->id_comprobante;
$detalle_anterior = $detalle->readOne();
$detalle->delete(); //se borra todo detalle

foreach($detalle_anterior as &$det_ant){
    $stock->id_producto = intval($det_ant["id_producto"]);
    $stock->cantidad = intval($det_ant["cantidad"]);
    $stock->updateStockDetail();
}

foreach ($data[1] as &$valor){  //se reemplazan datos
    
    $detalle->id_producto = $valor->id_producto;
    $detalle->cantidad = $valor->cantidad;
    $detalle->devolucion = $valor->devolucion;
    $detalle->precio = $valor->precio;

    $stock->id_producto = intval($valor->id_producto);
    $stock->cantidad = intval($valor->cantidad);

    $stock->updateStock();
    $total += ($valor->cantidad * $valor->precio);
    $detalle->create();
}
$comprobante->id_comprobante = $data[0]->id_comprobante;
$comprobante->total = $total;
echo json_encode($comprobante->update());
?>