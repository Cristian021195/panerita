<?php
require('../../models/clientes.php');
$clientes = new ClientesModel();
echo json_encode($clientes->read());
?>