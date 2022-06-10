<?php
require('../../models/comprobantes.php');
require('../../models/stock.php');
require('../../models/detalles.php');
$detalle = new DetallesModel();
$stock = new StockModel();
$comprobante = new ComprobantesModel();


if(isset($_POST['id_producto']) && isset($_POST['id_comprobante']) && isset($_POST['cantidad']) && isset($_POST['total']) && isset($_POST['fecha'])){
    $stock->id_producto = $_POST['id_producto'];
    $stock->cantidad = $_POST['cantidad'];

    $detalle->id_comprobante = $_POST['id_comprobante'];
    $detalle->id_producto = $_POST['id_producto'];
    $detalle->fecha = $_POST['fecha'];

    $comprobante->id_comprobante = $_POST['id_comprobante'];
    $comprobante->total = $_POST['total'];

    if(!$stock->updateStockSum()){//ok
        if(!$detalle->deleteSimple()){
            if(!$comprobante->restarTotalSimple()){
                echo json_encode(array("error"=>false));
            }            
        }else{
            echo json_encode(array("error"=>true, "mensaje"=>"Error al eliminar detalle"));    
        }
    }else{//not ok
        echo json_encode(array("error"=>true, "mensaje"=>"Error al devolver a stock"));
    }
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"no llego ningun id de stock ni cantidad de producto.."));
}


?> 