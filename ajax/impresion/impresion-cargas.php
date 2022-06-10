<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../helpers/empresa.php');
require('../../models/cargas.php');
require('../../public/libraries/vendor/autoload.php');

if (!isset($_SESSION['id'])) {
    header('Location: /panerita');
}
$pdf_name = "CARGA DESDE EL DIA: ".$_GET['desde'].".pdf";

$comprobante = new ComprobantesModel();
$json_detalle = [];
$general = [];
$cajones = 0;
$total = 0;

if( isset($_GET['desde']) && isset($_GET['hasta']) && isset($_GET['cajones'])){

    if(!isset($_GET['zona'])){
        //$comprobante->zona = $_GET['zona'];
        $comprobante->zona = 'catamarca';
    }else{
        $comprobante->zona = $_SESSION['zona'];
    }
    
    if(!empty($_GET['desde']) && !empty($_GET['hasta'])){
        $desde = $_GET['desde']." 00:00:00";
        $hasta = $_GET['hasta']." 23:59:59";
    
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
        /*print_r($json_detalle[0]['general']);
        echo '<br>';
        print_r($json_detalle[1]['ventas']);// otro array
        echo '<br>';
        print_r($json_detalle[2]['empresa']);
        echo '<br>';
        print_r($json_detalle[3][0]);//clientes y dentro de cada cliente otro arreglo de productos
        echo '<br>';
        ESTRUCTURA DE DATOS
        Array ( 
        [0] => Array ( 
            [general] => Array ( 
                [0] => Array ( 
                    [fecha] => 2021-10-05 16:17:43 [cliente] => BURGOS 920 [vendedor] => Gonzalo Zelada [total] => 1563.00 ) 
                [1] => Array ( 
                    [fecha] => 2021-10-05 19:06:42 [cliente] => VILLACORTA 920 [vendedor] => Gonzalo Zelada [total] => 763.50 ) 
                ) 
            ) 
        [1] => Array ( 
            [ventas] => Array ( 
                [0] => Array ( [producto] => GALLETA C/ CHIA x 1 KG [ventas] => 1 [devoluciones] => 0 [total] => 1 ) 
                [1] => Array ( [producto] => PAN DE HAMBURGUESA x 4 UNID [ventas] => 11 [devoluciones] => 0 [total] => 11 ) 
                [2] => Array ( [producto] => PAN DE VIENA x 6 UNI [ventas] => 13 [devoluciones] => 0 [total] => 13 ) 
                [3] => Array ( [producto] => PAN LACTAL BLANCO x 400 GR [ventas] => 3 [devoluciones] => 0 [total] => 3 ) ) ) 
        [2] => Array ( 
            [empresa] => La Panerita [telefono1] => Catamarca 383 4992688 (Personal) [telefono2] => Tucumán 3865 206753 (Personal) 
            ) 
        [3] => Array ( 
            [0] => Array ( 
                [cliente] => BURGOS 920 [direccion] => ZONA ALTA [telefono] => 3834412790 [fecha] => 2021-10-05 16:17:43 [total] => 1563.00 [vendedor] => Gonzalo Zelada [id_comprobante] => 21 
                [0] => Array ( 
                    [0] => Array ( [producto] => PAN DE VIENA x 6 UNI [cantidad] => 10 [devolucion] => 0 [precio] => 69.50 [total] => 695.00 [id_producto] => 14 [fecha] => 2021-11-20 18:27:11 ) 
                    [1] => Array ( [producto] => PAN LACTAL BLANCO x 400 GR [cantidad] => 3 [devolucion] => 0 [precio] => 104.00 [total] => 312.00 [id_producto] => 16 [fecha] => 2021-11-20 18:27:11 ) 
                    [2] => Array ( [producto] => PAN DE HAMBURGUESA x 4 UNID [cantidad] => 8 [devolucion] => 0 [precio] => 69.50 [total] => 556.00 [id_producto] => 60 [fecha] => 2021-11-20 18:27:11 ) ) 
                ) 
            [1] => Array ( 
                [cliente] => VILLACORTA 920 [direccion] => ZONA 1 [telefono] => 3865206753 [fecha] => 2021-10-05 19:06:42 [total] => 763.50 [vendedor] => Gonzalo Zelada [id_comprobante] => 22 
                [0] => Array ( 
                    [0] => Array ( [producto] => GALLETA C/ CHIA x 1 KG [cantidad] => 1 [devolucion] => 0 [precio] => 346.50 [total] => 346.50 [id_producto] => 4 [fecha] => 2021-11-20 18:27:11 ) 
                    [1] => Array ( [producto] => PAN DE VIENA x 6 UNI [cantidad] => 3 [devolucion] => 0 [precio] => 69.50 [total] => 208.50 [id_producto] => 14 [fecha] => 2021-11-20 18:27:11 ) 
                    [2] => Array ( [producto] => PAN DE HAMBURGUESA x 4 UNID [cantidad] => 3 [devolucion] => 0 [precio] => 69.50 [total] => 208.50 [id_producto] => 60 [fecha] => 2021-11-20 18:27:11 ) ) 
                ) 
            ) 
        )
        */

        $vista_general = '<table border="1" style="width:100%" cellspacing="0" cellpadding="3">
                        <tr>
                            <td>FECHA</td>
                            <td>CLIENTE</td>
                            <td>VENDEDOR</td>
                            <td>TOTAL</td>
                        </tr>';

        foreach($json_detalle[0]['general'] as &$general){
            $cajones++;
            $total += floatval($general['total']);

            $vista_general .= '<tr>
                        <td>'.$general['fecha'].'</td>
                        <td>'.$general['cliente'].'</td>
                        <td>'.$general['vendedor'].'</td>
                        <td>'.$general['total'].'</td>
                    </tr>';
        }

        $cabecera = '<h3>CAJONES: '.$_GET['cajones'].', TOTAL: '.$total.', COMPROBANTES: '.$cajones.'</h3>';

        $tabla_detalle = '<h3>DETALLE DE CARGAS Y DEVOLUCIONES</h3>
                            <table border="" style="width:100%" cellspacing="0" cellpadding="3">
                            <tr>
                                <th>PRODUCTO</th>
                                <th>VENTAS</th>
                                <th>DEVOLUCIONES</th>
                                <th>TOTAL</th>
                            </tr>';

        foreach($json_detalle[1]['ventas'] as &$venta){
            $tabla_detalle .= '<tr>
                                <td>'.$venta['producto'].'</td>
                                <td>'.$venta['ventas'].'</td>
                                <td>'.$venta['devoluciones'].'</td>
                                <td>'.$venta['total'].'</td>
                            </tr>';
        }
        $tabla_detalle.='</table><br>';
        
        $tablas_comprobantes = '';

        foreach($json_detalle[3] as &$comprobante){

            $tablas_comprobantes .= '<div class="fondo">
                                        <div class="div-comp" style="page-break-inside:avoid">
                                            <p><b><img src="../../public/img/camion.svg" width="16"/> '.$empresa['empresa'].' | Telefonos: </b>'.$empresa['telefono1'].', '.$empresa['telefono2'].'</p>';

            $tablas_comprobantes .= '<table border="" style="width:100%" cellspacing="0" cellpadding="3">
                                        <tr><th>CLIENTE</th><th>DIRECCION</th><th>TELEFONO</th><th>FECHA</th></tr>
                                        <tr>
                                            <td>'.$comprobante['cliente'].'</td>
                                            <td>'.$comprobante['direccion'].'</td>
                                            <td>'.$comprobante['telefono'].'</td>
                                            <td>'.$comprobante['fecha'].'</td>
                                        </tr>
                                    </table>';
            
            $tablas_comprobantes .= '<table border="1" style="width:100%" cellspacing="0" cellpadding="3">
                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>CANTIDAD</th>
                                    <th>DEVOLUCION</th>
                                    <th>PRECIO</th>
                                    <th>TOTAL</th>
                                </tr>';
            foreach($comprobante[0] as &$detalle){
                $tablas_comprobantes.= '<tr>
                                    <td>'.$detalle['producto'].'</td>
                                    <td>'.$detalle['cantidad'].'</td>
                                    <td>'.$detalle['devolucion'].'</td>
                                    <td>'.$detalle['precio'].'</td>
                                    <td>'.$detalle['total'].'</td>
                                </tr>';
            }
            $tablas_comprobantes .= '</table><h4>TOTAL COMPROBANTE: $'.$comprobante['total'].' | VENDEDOR: '.$comprobante['vendedor'].'</h4></div></div>';
        }
        /*echo  $cabecera; echo    $vista_general.='</table>'; echo    $tabla_detalle; echo    $tablas_comprobantes;
        //array_push($json_detalle, $empresa, $resumenes); //echo json_encode($json_detalle);*/
        //echo $html;

        $html = $cabecera.$vista_general.='</table>'.$tabla_detalle.$tablas_comprobantes;

        $mpdf = new \Mpdf\Mpdf(['default_font' => 'dejavusans','default_font_size' => 8]);
        $stylesheet = file_get_contents('../../public/css/impresiones.css');
        $mpdf->WriteHTML($stylesheet,\Mpdf\HTMLParserMode::HEADER_CSS);
        $mpdf->WriteHTML($html,\Mpdf\HTMLParserMode::HTML_BODY);
        $mpdf->Output($pdf_name, \Mpdf\Output\Destination::DOWNLOAD);
    }else{
        echo json_encode(array("error"=>$html));
    }
}else{
    echo 'Sin datos..';
}

?>
