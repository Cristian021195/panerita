<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');


if(isset($_POST['id_producto']) && isset($_POST['id_comprobante']) && isset($_POST['cantidad']) && isset($_POST['devolucion']) && isset($_POST['precio'])){

    $comprobante = new ComprobantesModel();
    $detalle = new DetallesModel();
    $stock = new StockModel();

    $cantidad_pedida = intval($_POST['cantidad']) + intval($_POST['devolucion']);

    $detalle->id_comprobante = $_POST['id_comprobante'];
    $detalle->id_producto = $_POST['id_producto'];
    $detalle->cantidad = $_POST['cantidad'];
    $detalle->devolucion = $_POST['devolucion'];
    $detalle->precio = $_POST['precio'];

    $comprobante->total = floatval($_POST['cantidad']) * floatval($_POST['precio']);
    $comprobante->id_comprobante = $_POST['id_comprobante'];

    $stock->id_producto = $_POST['id_producto'];
    $disponible = intval($stock->checkStock()[0]['cantidad']);

    if($cantidad_pedida > $disponible){
        echo json_encode(array("error"=>true, "mensaje"=>"¡No hay stock suficiente, cantidad disponible: ".$disponible));
    }else{
        $stock->cantidad = $cantidad_pedida;
        if(!$stock->updateStock()){//error false
            if(!$detalle->create()){
                if(!$comprobante->sumarTotalSimple()){
                    echo json_encode(array("error"=>false));
                }
            }            
        }else{
            echo json_encode(array("error"=>true, "mensaje"=>"¡Error al procesar, volver a intentar!"));
        }
    }
    

}else{
    echo json_encode(array("error"=>true, "mensaje"=>"faltan datos"));
}



/*$json = file_get_contents('php://input');
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
    $stock->cantidad = $valor->cantidad;
    array_push($disponibles, $stock->checkStock()[0]);
}

$total = count($disponibles);
for($i = 0; $i < $total; $i++){    
    if($data[1][$i]->cantidad > intval($disponibles[$i]['cantidad'])){
        array_push($no_disponibles, $disponibles[$i]);
    }
}
echo json_encode($no_disponibles);*/
?>