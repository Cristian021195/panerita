<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');
$json = file_get_contents('php://input');
$data = json_decode($json);
$error = true;
$total = 0;

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();
$stock = new StockModel();

$comprobante->fecha = date("Y-m-d H:i:s");
$comprobante->cliente = $data[0]->cliente;
$comprobante->vendedor = $data[0]->vendedor;
$comprobante->zona = $data[0]->zona;
foreach ($data[1] as &$valor) {
    $total += intval($valor->cantidad) * $valor->precio;
}
$comprobante->total = $total;

if($comprobante->cliente != 0 && !empty($comprobante->vendedor)){
    $detalle->id_comprobante = $comprobante->create();

    foreach ($data[1] as &$valor){
        $error = true;
    
        $detalle->id_producto = $valor->id;
        $detalle->cantidad = intval($valor->cantidad);
        $detalle->devolucion = intval($valor->devolucion);
        $detalle->precio = $valor->precio;

        $stock->id_producto = $valor->id;
        $stock->cantidad = intval($valor->cantidad) + intval($valor->devolucion);

        if($detalle->cantidad > -1){
            
            $stock->updateStock();
            $detalle->create();
            $error = false;
        }else{
            $error = true;
        }
    }
    
    if(!$error){
        echo json_encode(array("error"=>false));
    }else{
        echo json_encode(array("error"=>true, "mensaje"=>"Error al generar comprobante"));
    }

}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡no recibo datos desde frontend!"));
}

?>