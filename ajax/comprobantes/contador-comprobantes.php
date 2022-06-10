<?php
require('../../models/comprobantes.php');
$comprobantes = new ComprobantesModel();
echo $comprobantes->contadorComprobantes();
?>