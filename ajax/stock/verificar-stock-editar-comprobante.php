<?php
require('../../models/comprobantes.php');
require('../../models/detalles.php');
require('../../models/stock.php');

$json = file_get_contents('php://input');
$data = json_decode($json);
$error = true;
$total = 0;

$disponibles = [];
$no_disponibles = [];

$comprobante = new ComprobantesModel();
$detalle = new DetallesModel();


$comprobante->id_comprobante = intval($data[0]->id_comprobante);

foreach ($data[1] as &$valor) {
    $stock = new StockModel();
    $stock->id_producto = $valor->id_producto;
    $stock->cantidad = $valor->cantidad;


    
    if(ISSET($valor->locked)){
        //entran los que se tocaron
        //array_push($disponibles, $stock->checkStock()[0]);
        if(!$stock->updateStock()){
            $error = false;
        }else{
            $error = true;
        }
        //var_dump($valor,$valor->locked);
    }else{
        //entran los que nunca se tocaron
        //var_dump('undefined',$valor,$valor->locked);
    }
}
if($error == false){
    echo json_encode(array("error"=>false));
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡Debes agregar / eliminar un producto almenos!"));
}

/*$total = count($disponibles);
for($i = 0; $i < $total; $i++){    
    if(intval($data[1][$i]->cantidad) > intval($disponibles[$i]['cantidad'])){
        array_push($no_disponibles, $disponibles[$i]);
    }
}
echo json_encode($no_disponibles);*/

?>