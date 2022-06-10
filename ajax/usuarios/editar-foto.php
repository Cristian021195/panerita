<?php
require('../../models/fotos.php');
$fotos = new FotosModel();

//$ruta = dirname(__FILE__);
$carpeta = '/panerita/profiles/img';
$ruta = $_SERVER['DOCUMENT_ROOT'].$carpeta;

$default = '/panerita/profiles/img/default.svg';
$ruta_default = $_SERVER['DOCUMENT_ROOT'].$default;

if(file_exists($ruta)){
    $usuario = explode(' ', $_POST['nombre'])[0];
    $id = $_POST['id']; $anterior = $_POST['anterior'];

    $tmp_name = $_FILES['foto']['tmp_name'];
    $name = $usuario.'_'.basename(time().'.png');
    move_uploaded_file($tmp_name, "$ruta/$name");
    $fotos->foto = $name;
    $fotos->id = $id;

    if($_SESSION['foto'] == 'default.svg'){
      $_SESSION['foto'] = $name;
    }else{
      unlink("$ruta/$anterior");
      $_SESSION['foto'] = $name;
    }
    echo json_encode($fotos->updateFoto());    
    
}else{
    echo json_encode(array("error"=>true, "mensaje"=>"¡No existe la carpeta donde guardan las fotos!"));
}
?>