<?php
require('../../models/productos.php');
$producto = new ProductosModel();

if(!empty($_POST['id_producto'])){
    $producto->id = $_POST['id_producto'];
    $producto->nombre = $_POST['nombre'];
    $producto->base = $_POST['base'];
    $producto->distribuidor = $_POST['distribuidor'];
    $producto->mayorista = $_POST['mayorista'];
    $producto->minorista = $_POST['minorista'];
}else{
    $producto->id = null;
    $producto->base = $_POST['base'];
    $producto->distribuidor = $_POST['distribuidor'];
    $producto->mayorista = $_POST['mayorista'];
    $producto->minorista = $_POST['minorista'];
    if(isset($_POST['zona'])){
        $producto->zona = $_POST['zona'];
    }
    
}


if(isset($producto->base)){
    $producto->update();
    //echo json_encode(array("error"=>true, "mensaje"=>$producto->base));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 3 caracteres!"));
}

?>