<?php
require('../../models/comprobantes.php');
require('../../helpers/empresa.php');
require('../../models/detalles.php');
require('../../public/libraries/vendor/autoload.php');

if (!isset($_SESSION['id'])) {
    header('Location: /panerita');
}
$pdf_name = "COMPROBANTE".$_GET['id_comprobante'].".pdf";

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();

$json_detalle = [];

if(isset($_GET['id_comprobante']) && !empty($_GET['id_comprobante'])){

    $comprobante->id_comprobante = $_GET['id_comprobante'];
    $detalle->id_comprobante = $_GET['id_comprobante'];
    array_push($json_detalle, $empresa, $comprobante->readOne(), $detalle->readOne());
    /*print_r($json_detalle[0]);
    echo '<br>';
    print_r($json_detalle[1][0]);
    echo '<br>';
    print_r($json_detalle[2]);*/
    $html = '<div class="fondo"><div class="div-comp" style="page-break-inside:avoid"><p><b>'.$empresa['empresa'].' | Telefonos: </b>'.$empresa['telefono1'].', '.$empresa['telefono2'].'</p>';
    //$html = '<p><b>'.$empresa['empresa'].' | Telefonos: </b></p>';
    $html .= '<table border="" style="width:100%" cellspacing="0" cellpadding="3">
        <tr><th>CLIENTE</th><th>DIRECCION</th><th>TELEFONO</th><th>FECHA</th></tr>
        <tr>
            <td>'.$json_detalle[1][0]['cliente'].'</td>
            <td>'.$json_detalle[1][0]['direccion'].'</td>
            <td>'.$json_detalle[1][0]['telefono'].'</td>
            <td>'.$json_detalle[1][0]['fecha'].'</td>
        </tr>
    </table><br>';

    $html .= '<table border="" style="width:100%">
        <tr><th>PRODUCTO</th><th>CANTIDAD</th><th>DEVOLUCION</th><th>PRECIO</th><th>TOTAL</th></tr>';

    foreach ($json_detalle[2] as &$detalle) {
        $html .= '
            <tr>
                <td>'.$detalle['producto'].'</td>
                <td>'.$detalle['cantidad'].'</td>
                <td>'.$detalle['devolucion'].'</td>
                <td>'.$detalle['precio'].'</td>
                <td>'.$detalle['total'].'</td>
            </tr>
        ';
    }

    $html .= '</table><h4>TOTAL COMPROBANTE: $'.$json_detalle[1][0]['total'].' | VENDEDOR: '.$json_detalle[1][0]['vendedor'].'</h4></div></div>';

    $mpdf = new \Mpdf\Mpdf(['default_font' => 'dejavusans','default_font_size' => 8]);
    $stylesheet = file_get_contents('../../public/css/impresiones.css');
    $mpdf->WriteHTML($stylesheet,\Mpdf\HTMLParserMode::HEADER_CSS);
    $mpdf->WriteHTML($html,\Mpdf\HTMLParserMode::HTML_BODY);
    $mpdf->Output($pdf_name, \Mpdf\Output\Destination::DOWNLOAD);
}else{
    echo 'Sin datos..';
}

?>