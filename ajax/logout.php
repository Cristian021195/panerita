<?php

session_start();
session_destroy();
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
echo json_encode(array("error"=>false));

?>