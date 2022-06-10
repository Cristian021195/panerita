<?php
require('../../models/productos.php');
$producto = new ProductosModel();
$producto->nombre = $_POST['producto'];


echo json_encode($producto->readFilterLike($_POST['tipo']));
?>