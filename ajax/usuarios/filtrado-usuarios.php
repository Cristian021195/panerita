<?php
require('../../models/usuarios.php');
$usuarios = new UsuariosModel();
echo json_encode($usuarios->readLike($_POST['nombre'], $_POST['tipo'], $_POST['zona']));
?>