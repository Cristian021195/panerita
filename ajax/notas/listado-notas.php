<?php
require('../../models/notas.php');
$notas = new NotasModel();
echo json_encode($notas->read());
?>