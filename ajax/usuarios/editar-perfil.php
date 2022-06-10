<?php
require('../../models/usuarios.php');
$usuarios = new UsuariosModel();

if(isset($_POST['contra']) && isset($_POST['contra-verifica'])){
    if(strlen($_POST['contra']) >= 8 && strlen($_POST['contra-verifica']) >= 8){
        if($_POST['contra'] == $_POST['contra-verifica']){
            $usuarios->contra = $_POST['contra'];
            $usuarios->mail = $_POST['email'];
            $usuarios->telefono = $_POST['telefono'];
            $usuarios->direccion = $_POST['direccion'];
        }    
    }
}else{
    $usuarios->mail = $_POST['email'];
    $usuarios->telefono = $_POST['telefono'];
    $usuarios->direccion = $_POST['direccion'];
}


if(!empty($usuarios->mail) && strlen($usuarios->mail) >= 10){
    echo json_encode($usuarios->updateProfile());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 10 caracteres en mail / usuario, verificar validaciones correspondientes!"));
}

?>