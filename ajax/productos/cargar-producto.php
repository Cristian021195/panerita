<?php
require('../../models/productos.php');
$producto = new ProductosModel();

if(!empty($_POST['nombre']) && strlen($_POST['nombre']) >= 3){
    if(isset($_POST['zona']) && !empty($_POST['zona'])){
        $producto->zona = $_POST['zona'];    
    }
    $producto->nombre = $_POST['nombre'];
    $producto->base = $_POST['base'];
    $producto->distribuidor = $_POST['distribuidor'];
    $producto->mayorista = $_POST['mayorista'];
    $producto->minorista = $_POST['minorista'];


    $producto->create();
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 3 caracteres!"));
}

?>