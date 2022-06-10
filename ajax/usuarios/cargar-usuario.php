<?php
require('../../models/usuarios.php');

if($_POST['contra'] == $_POST['contra-verifica']){
    $usuarios = new UsuariosModel();

    if(!isset($_POST['zona'])){
        $usuarios->zona = $_SESSION['zona'];
    }else{
        $usuarios->zona = $_POST['zona'];
    }

    $usuarios->mail = $_POST['mail'];
    $usuarios->nombre = $_POST['nombre'];
    $usuarios->dni = $_POST['dni'];
    $usuarios->contra = $_POST['contra'];
    $usuarios->nacimiento = $_POST['nacimiento'];
    $usuarios->tipo = $_POST['tipo'];
    $usuarios->telefono = $_POST['telefono'];    
    $usuarios->direccion = $_POST['direccion'];
    $usuarios->estado = $_POST['estado'];

    if(!empty($usuarios->mail) && strlen($usuarios->mail) >= 10){
        echo json_encode($usuarios->create());
    }else{
        echo json_encode(array("error"=>true, "mensaje"=>"¡Minimo 10 caracteres, tambien verifique que datos son unicos desde bbdd"));
    }

}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Las Contraseñas no Coinciden!"));
}

?>