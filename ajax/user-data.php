<?php
require('../models/login.php');
$user_data = new LoginModel();
if(!session_id()){
    echo json_encode(array("error"=>true, "mensaje"=>"¡No hay sesion iniciada!"));
}else{
    echo json_encode($user_data->getUserData($_SESSION['id']));
}
?>