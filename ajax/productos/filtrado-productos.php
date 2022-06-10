<?php
require('../../models/productos.php');
$producto = new ProductosModel();
echo $producto->readLike($_POST['nombre']);
?>