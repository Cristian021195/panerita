<?php
require('../models/login.php');
$notas = new LoginModel();
$notas->doLogin($_POST['usuario'], $_POST['contra']);
?>