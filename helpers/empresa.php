<?php
    //session_start();
	if($_SESSION['zona'] == 'catamarca'){
        $empresa = array("empresa"=>"La Panerita", "telefono1"=>"Catamarca 383 4992688 (Personal)", "telefono2"=>"Tucumán 3865 206753 (Personal)");
	}else if($zona = 'tucuman'){
		$empresa = array("empresa"=>"La Panerita", "telefono1"=>"Catamarca 383 4992688 (Personal)", "telefono2"=>"Tucumán 3865 206753 (Personal)");
    }
?>