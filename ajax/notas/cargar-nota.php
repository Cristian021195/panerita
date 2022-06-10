<?php
require('../../models/notas.php');
$notas = new NotasModel();

$notas->contenido = $_POST['contenido'];
$notas->usuario = $_SESSION['id'];
$notas->tipo = $_SESSION['tipo'];
if(!empty($notas->contenido) && strlen($notas->contenido) >= 16){
    echo json_encode($notas->create());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 16 caracteres!"));
}

?>