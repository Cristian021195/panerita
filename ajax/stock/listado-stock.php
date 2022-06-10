<?php
require('../../models/stock.php');
$stock = new StockModel();
$zona = $_SESSION['zona'];
$stock->nombre = $_POST['producto'];


if($zona == 'super'){
    $stock->zona = $_POST['zona'];
    //$stock->zona = 'catamarca';
}else{
    $stock->zona = $zona;
}
echo json_encode($stock->readLike());


?> 