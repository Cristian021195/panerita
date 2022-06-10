<?php
require('../../models/comprobantes.php');
$comprobantes = new ComprobantesModel();



if(!empty($_POST['comprobante'] && !empty($_POST['estado']))){
    $comprobantes->zona = $_SESSION['zona'];
    $comprobantes->estado = $_POST['estado'];
    $comprobantes->cliente = $_POST['comprobante'];
    echo json_encode($comprobantes->readLike($comprobantes->cliente, $comprobantes->estado, $comprobantes->zona));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡No se encontraron comprobantes!"));
}


?>