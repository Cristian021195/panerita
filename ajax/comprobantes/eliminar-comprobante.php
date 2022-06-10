<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();
$json_detalle = [];
$error = false;

if(!empty($_POST['id_comprobante']) && isset($_POST['id_comprobante'])){
    $comprobante->id_comprobante = $_POST['id_comprobante'];
    $comprobante->estado = $_POST['estado'];
    $detalle->id_comprobante = $_POST['id_comprobante'];

    array_push($json_detalle, $detalle->readOne());
    
    foreach ($json_detalle as &$_detalle){
        $stock = new StockModel();
        foreach ($_detalle as $valores) {
            $stock->id_producto = intval($valores['id_producto']);
            $stock->cantidad = intval($valores['cantidad']) + intval($valores['devolucion']);
            if($comprobante->estado != 'pagado'){
                $error = $stock->updateStockSum();
            }
            
        }
    }

    if($error == false){
        if(!$detalle->delete() && !$comprobante->delete()){
            echo json_encode(array("error"=>false));
        }else{
            echo json_encode(array("error"=>false, "mensaje"=>"Hubo un error verifique id's en bbdd y backend"));
        }
    }   

}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡no recibo datos desde frontend!"));
}

?>