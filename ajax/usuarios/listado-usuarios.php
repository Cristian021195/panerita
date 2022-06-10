<?php
require('../../models/usuarios.php');
$usuarios = new UsuariosModel();
echo json_encode($usuarios->read());
?>