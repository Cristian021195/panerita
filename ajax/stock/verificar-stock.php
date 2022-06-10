<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$json = file_get_contents('php://input');
$data = json_decode($json);
$error = true;
$total = 0;

$disponibles = [];
$no_disponibles = [];

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();

$comprobante->cliente = $data[0]->cliente;
$comprobante->vendedor = $data[0]->vendedor;
$comprobante->zona = $data[0]->zona;
foreach ($data[1] as &$valor) {
    $stock = new StockModel();
    $stock->id_producto = $valor->id;
    $stock->cantidad = intval($valor->cantidad) + intval($valor->devolucion);
    array_push($disponibles, $stock->checkStock()[0]);
}

$total = count($disponibles);
for($i = 0; $i < $total; $i++){    
    if($data[1][$i]->cantidad > intval($disponibles[$i]['cantidad'])){
        array_push($no_disponibles, $disponibles[$i]);
    }
}
echo json_encode($no_disponibles);
?>