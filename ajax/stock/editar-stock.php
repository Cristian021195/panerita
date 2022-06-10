<?php
require('../../models/stock.php');
$stock = new StockModel();

if(isset($_POST['producto']) && isset($_POST['cantidad'])){
    $stock->id_producto = $_POST['producto'];
    $stock->cantidad = $_POST['cantidad'];
    echo json_encode($stock->update());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"no llego ningun id de stock ni cantidad de producto.."));
}


?> 