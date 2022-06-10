<?php
require('../../models/clientes.php');
$clientes = new ClientesModel();

if(isset($_POST['rango']) && !empty($_POST['rango'])){
    $hasta = intval($_POST['rango']) * 10;
    if($hasta >= 10){
        $desde = $hasta - 10;
    }else{
        $desde = 0;
    }
    echo json_encode($clientes->readRange($desde, $hasta));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡No vino ninguno valor desde el enlace!"));
}


?>