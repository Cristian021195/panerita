<?php
require('../../models/comprobantes.php');
$comprobantes = new ComprobantesModel();
echo json_encode($comprobantes->read());
?>