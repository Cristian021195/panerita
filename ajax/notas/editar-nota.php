<?php
require('../../models/notas.php');
$notas = new NotasModel();

$notas->contenido = $_POST['contenido'];
$notas->id = $_POST['idNota'];
if(!empty($notas->contenido) && strlen($notas->contenido) >= 16){
    echo json_encode($notas->update());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 16 caracteres!"));
}

?>