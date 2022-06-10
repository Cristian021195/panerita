<?php
require('../../models/productos.php');
$producto = new ProductosModel();
$producto->id = $_POST['id_producto'];
if(!empty($producto->id)){
    $producto->delete();
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 16 caracteres!"));
}

?>