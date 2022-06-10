<?php
require('../../models/usuarios.php');
$usuario = new UsuariosModel();
$usuario->mail = $_POST['mail'];
if(!empty($usuario->mail)){
    echo json_encode($usuario->delete());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Error de ID / Mail, Verificar Creacion de tabla Javascript!"));
}

?>