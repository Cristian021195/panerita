<?php
require('../../models/usuarios.php');
$usuario = new UsuariosModel();
$usuario->mail = $_POST['mail'];
if(!empty($usuario->mail)){
    echo json_encode($usuario->readOne());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡No se encuentra ese id, verifique bbdd o creacion de script tabla!"));
}
?>