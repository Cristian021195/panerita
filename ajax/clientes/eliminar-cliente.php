<?php
require('../../models/clientes.php');
$cliente = new ClientesModel();
$cliente->id = $_POST['id_cliente'];
if(!empty($cliente->id)){
    echo json_encode($cliente->delete());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Error de ID, Verificar Creacion de tabla Javascript!"));
}

?>