<?php
require('../../models/clientes.php');
$clientes = new ClientesModel();
if(isset($_POST['zona'])){
    $zona = $_POST['zona'];
}else{
    $zona = $_SESSION['zona'];
}
echo json_encode($clientes->readLike($_POST['nombre'], $_POST['tipo'], $zona));
?>