<?php
require('../../models/usuarios.php');
$usuarios = new UsuariosModel();

if(($_POST['contra'] == $_POST['contra-verifica']) && (!empty($_POST['contra']) && !empty($_POST['contra-verifica']))){
    $usuarios->contra = $_POST['contra'];
}else{
    $usuarios->contra = '';
}

$usuarios->id_usuario = $_POST['id_usuario'];
$usuarios->mail = $_POST['mail'];
$usuarios->nombre = $_POST['nombre'];
//$usuarios->foto = $_POST['foto'];
$usuarios->dni = $_POST['dni'];
$usuarios->nacimiento = $_POST['nacimiento'];
$usuarios->tipo = $_POST['tipo'];
$usuarios->telefono = $_POST['telefono'];
$usuarios->zona = $_POST['zona'];
$usuarios->direccion = $_POST['direccion'];
$usuarios->estado = $_POST['estado'];



if(!empty($usuarios->mail) && strlen($usuarios->mail) >= 10){
    echo json_encode($usuarios->update());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 10 caracteres en mail / usuario, verificar validaciones correspondientes!"));
}

?>