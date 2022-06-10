<?php
require('../../models/clientes.php');
$clientes = new ClientesModel();

$clientes->nombre = $_POST['nombre'];
$clientes->dni = $_POST['identificador'];
$clientes->tipo = $_POST['tipo'];
$clientes->estado = $_POST['estado'];
$clientes->telefono = $_POST['telefono'];
$clientes->direccion = $_POST['direccion'];
$clientes->mail = $_POST['mail'];
$clientes->id = $_POST['id_cliente'];

if($_SESSION['zona'] != 'super'){
    $clientes->zona = $_SESSION['zona'];
}else{
    $clientes->zona = $_POST['zona'];
}

if(!empty($clientes->nombre) && strlen($clientes->nombre) >= 10){
    echo json_encode($clientes->update());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 10 caracteres en nombre!"));
}

?>