<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../helpers/empresa.php');
require('../../models/cargas.php');

$comprobante = new ComprobantesModel();
$json_detalle = [];
$general = [];
//$json_response = array("general"=>$data);

if(isset($_POST['zona'])){
    $comprobante->zona = $_POST['zona'];
}else{
    $comprobante->zona = $_SESSION['zona'];
}

if(!empty($_POST['desde']) && !empty($_POST['hasta'])){
    $desde = $_POST['desde']." 00:00:00";
    $hasta = $_POST['hasta']." 23:59:59";

    $resumenes = $comprobante->readDateRange($desde, $hasta);

    foreach ($resumenes as &$resumen){

        $detalle = new DetallesModel();
        $detalle->id_comprobante = $resumen["id_comprobante"];
        $carga = new CargasModel();
        $carga->id_comprobante = $resumen["id_comprobante"];
        $error = $carga->create();
        array_push($resumen, $detalle->readOne());
        array_push($general, array("fecha"=>$resumen["fecha"], "cliente"=>$resumen["cliente"], "vendedor"=>$resumen["vendedor"], "total"=>$resumen["total"]));
    }
    $_general = array("general"=>$general);

    if(!$error){
        $_carga = new CargasModel();
        $_ventas = $_carga->mostrarCargas();
        $_carga->deleteCargas();
        $ventas = array("ventas"=>$_ventas);
    }

    array_push($json_detalle, $_general,$ventas, $empresa, $resumenes);
    echo json_encode($json_detalle);

    //array_push($json_detalle, $empresa, $resumenes);
    //echo json_encode($json_detalle);
}else{
    //echo json_encode(array("error"=>true));
}
?>