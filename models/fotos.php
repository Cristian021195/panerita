<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class FotosModel extends DbModel{
    public $id;
    public $nombre;
    public $foto;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
    }
    public function read(){
    }
    public function readOne(){
    }
    public function readRange($start, $end){//
    }
    public function update(){
    }
    public function updateFoto(){
        $this->db_open();
        $_foto = mysqli_real_escape_string($this->connect, $this->foto);
        $this->db_close();
        
        if(!empty($_foto)){
            $this->query = "UPDATE usuarios SET foto = '$_foto' WHERE mail = '$this->id'";
        }

        if($this->set_query()){
            $_SESSION['id'] = $_foto;
            return array("error"=>false, "foto"=>"$_foto");
        }else{
            return array("error"=>true, "mensaje"=>"¡No se pudo actualizar la foto, verifique id o nombre de archivo png!");
        }
    }
    public function delete(){
    }
    public function readLike($nombre, $tipo, $zona){   
    }
}
?>