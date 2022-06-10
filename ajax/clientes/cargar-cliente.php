<?php
require('../../models/clientes.php');
$clientes = new ClientesModel();

$clientes->nombre = $_POST['nombre'];
$clientes->dni = $_POST['identificador'];
$clientes->tipo = $_POST['tipo'];
$clientes->telefono = $_POST['telefono'];
$clientes->mail = $_POST['mail'];
$clientes->direccion = $_POST['direccion'];
$clientes->estado = $_POST['estado'];

if(isset($_POST['zona']) && !empty($_POST['zona'])){
    $clientes->zona = $_POST['zona'];
}

if(!empty($clientes->nombre) && strlen($clientes->nombre) >= 10){
    echo json_encode($clientes->create());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 16 caracteres!"));
}

?>