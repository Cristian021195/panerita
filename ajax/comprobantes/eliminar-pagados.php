<?php
require('../../models/comprobantes.php');

$comprobantes = new ComprobantesModel();

if(!$comprobantes->deletePayed()){
    echo json_encode(array("error"=>false));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Verificar nombres de campos y Restricciones BBDD!"));
}

?>