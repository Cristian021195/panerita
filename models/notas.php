<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class NotasModel extends DbModel{
    public $status_id;
    public $status;
    public $contenido;
    public $usuario;
    public $tipo;
    public $id;

    public function __destruct(){
        //unset(StatusModel);
    }

    public function create(){
        $this->db_open();
        $_contenido = mysqli_real_escape_string($this->connect, $this->contenido);
        $_usuario = mysqli_real_escape_string($this->connect, $this->usuario);
        $_tipo = mysqli_real_escape_string($this->connect, $this->tipo);
        $this->db_close();
        $this->query = "INSERT INTO notas (nota, usuario, tipo) VALUES ('$_contenido', '$_usuario', '$_tipo');";
        if($this->set_query()){
            return array("error"=>false, "id_nota"=>$this->connect->insert_id);
        }else{
            return array("error"=>true);
        }
    }
    public function read(){
        $id_usuario = $_SESSION['id'];
        $this->query = "SELECT id_nota, nota, usuario, fecha, tipo FROM notas WHERE usuario = '$id_usuario' ORDER BY id_nota DESC;";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;//aun asi nos puede servir
    }
    public function readOne(){

        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "SELECT id_nota, nota, fecha FROM notas WHERE id_nota='$_id';";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readRange($start, $end){//
        if(($start >= 0) && ($end > 0) && ($start < $end)){
            $this->query = "SELECT * FROM status LIMIT $start,$end";
            $this->get_query();
        }else{
            $this->rows = null;   
        }        
        return json_encode($this->rows);
    }
    public function update(){

        $this->db_open();
        $_contenido = mysqli_real_escape_string($this->connect, $this->contenido);
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "UPDATE notas set nota = '$_contenido' WHERE id_nota = '$_id';";
        if($this->set_query()){
            return array("error"=>false);
        }else{
            return array("error"=>true);
        }
    }
    public function delete(){
        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "DELETE FROM notas WHERE id_nota = '$this->id';";
        if($this->set_query()){
            return array("error"=>false);
        }else{
            return array("error"=>true, "mesaje"=>"No se pudo eliminar la nota");
        }
    }
    
}

?>