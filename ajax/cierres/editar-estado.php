<?php
require('../../models/cierres.php');
$cierres = new CierresModel();

if(!empty($_POST['id_comprobante']) && !empty($_POST['estado'])){

    $cierres->id_comprobante = $_POST['id_comprobante'];
    $cierres->estado = $_POST['estado'];

    echo json_encode($cierres->update());
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Desde php no recibimos id ni estado!"));
}


?>