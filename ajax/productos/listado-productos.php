<?php
require('../../models/productos.php');
$producto = new ProductosModel();
if(isset($_POST['tipo'])){
    if($_POST['tipo'] == 'representante'){
        echo $producto->readType('base');//error de diseño
    }else{
        echo $producto->readType($_POST['tipo']);
    }
    
}else{
    echo $producto->read();
}

?>