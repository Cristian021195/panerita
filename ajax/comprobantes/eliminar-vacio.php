<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();

if(!empty($_POST['id_comprobante']) && isset($_POST['id_comprobante'])){
    $comprobante->id_comprobante = $_POST['id_comprobante'];
    $detalle->id_comprobante = $_POST['id_comprobante'];

    if( count($detalle->readOne()) == 0){
        if(!$comprobante->delete()){
            echo json_encode(array("error"=>false, "mensaje"=>"Se elimino comprobante vacio"));
        }else{
            echo json_encode(array("error"=>true, "mensaje"=>"No se pudo eliminar comprobante vacio"));
        }
    }else{
        echo json_encode(array("error"=>false, "mensaje"=>"Ok"));
    }
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡no recibo datos desde frontend!"));
}

?>