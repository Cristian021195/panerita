<?php
require('../../models/stock.php');
$stock = new StockModel();

if(isset($_POST['id_producto']) && isset($_POST['cantidad'])){
    $stock->id_producto = $_POST['id_producto'];
    $stock->cantidad = $_POST['cantidad'];
    if(!$stock->updateStockSum()){
        echo json_encode(array("error"=>false));
    }else{
        echo json_encode(array("error"=>true, "mensaje"=>"Error al devolver a stock"));
    }
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"no llego ningun id de stock ni cantidad de producto.."));
}


?> 