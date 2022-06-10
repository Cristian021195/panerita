<?php
require('../../models/stock.php');
$stock = new StockModel();
$zona = $_SESSION['zona'];


if($zona == 'super'){
    $stock->zona = 'catamarca';
    //$stock->zona = 'catamarca';
}else{
    $stock->zona = $zona;
}
echo json_encode($stock->readBasic());


?> 