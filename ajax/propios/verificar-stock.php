<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$json = file_get_contents('php://input');
$data = json_decode($json);
$error = true;
$total = 0;
$contador = count($data->previo);

$disponibles = [];
$no_disponibles = [];

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();
$comprobante->id_comprobante = $data->comprobante;

//var_dump($data);  // array_splice($array, 1, 1);

$diferido = array_splice($data->siguiente, 0, $contador);

//var_dump($data->siguiente);
foreach ($data->siguiente as &$valor) {
    $stock = new StockModel();
    $stock->id_producto = $valor->id_producto;
    $stock->cantidad = $valor->cantidad;
    array_push($disponibles, $stock->checkStock()[0]);
    $contador++;
}
$total = count($disponibles);
for($i = 0; $i < $total; $i++){    
    if($data->siguiente[$i]->cantidad > intval($disponibles[$i]['cantidad'])){
        array_push($no_disponibles, $disponibles[$i]);
    }
}
echo json_encode($no_disponibles);
?>