<?php
require('../../models/ventas.php');
$ventas = new VentasModel();
if(!empty($_POST['desde']) && !empty($_POST['hasta'])){
    if(isset($_POST['zona'])){
        $ventas->zona = $_POST['zona'];
    }else{
        $ventas->zona = $_SESSION['zona'];
    }
    $ventas->id_producto = $_POST['producto'];
    $ventas->desde = $_POST['desde']." 00:00:00";
    $ventas->hasta = $_POST['hasta']." 23:59:59";
    echo json_encode($ventas->read());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Seleccione fecha de inicio y de fin!"));
}
?>