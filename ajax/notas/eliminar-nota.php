<?php
require('../../models/notas.php');
$notas = new NotasModel();
$notas->id = $_POST['id_nota'];
if(!empty($notas->id)){
    echo json_encode($notas->delete());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 16 caracteres!"));
}

?>