<?php
require('../models/login.php');
$user = new LoginModel();

if(!empty($_POST['contra']) && !empty($_SESSION['id'])){
    echo json_encode($user->doCheckLogin($_SESSION['id'], $_POST['contra']));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Contraseña Vacia!"));
}
?>