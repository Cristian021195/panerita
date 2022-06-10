<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');
class StockModel extends DbModel{
    public $id_producto;
    public $nombre;
    public $cantidad;
    public $zona;
    public $locked;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
        return array("error"=>true, "mensaje"=>"esta funcion no esta definida para su uso..");
    }
    public function read(){
        $this->query = "SELECT id_producto, nombre, cantidad, zona FROM stock WHERE zona = '$this->zona' ORDER BY id_producto DESC;";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }

    public function readBasic(){
        $this->query = "SELECT nombre, cantidad FROM stock WHERE zona = '$this->zona' ORDER BY id_producto DESC;";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }

    public function readType($type){
        return array("error"=>true, "mensaje"=>"esta funcion no esta definida para su uso..");
    }
    public function readOne(){
        return array("error"=>true, "mensaje"=>"esta funcion no esta definida para su uso..");
    }
    public function readRange($start, $end){return array("error"=>true, "mensaje"=>"esta funcion no esta definida para su uso..");}
    public function update(){
        if($this->id_producto != null){
            $this->db_open();
            $_cantidad = mysqli_real_escape_string($this->connect, $this->cantidad);
            $_id_producto = mysqli_real_escape_string($this->connect, $this->id_producto);
            $this->db_close();
        }
        $this->query = "UPDATE stock SET cantidad = '$_cantidad' WHERE stock.id_producto = '$_id_producto'";
        
        if($this->set_query()){
            return array("error"=>false, "cantidad"=>$_cantidad, "id_producto"=>$_id_producto);
        }else{
            return array("error"=>true);
        }
    }
    public function updateStockDetail(){
        if($this->id_producto != null){
            $this->db_open();
            $_cantidad = mysqli_real_escape_string($this->connect, $this->cantidad);
            $_id_producto = mysqli_real_escape_string($this->connect, $this->id_producto);
            $this->db_close();
        }
        $this->query = "UPDATE stock SET cantidad = ((SELECT cantidad FROM stock WHERE id_producto = '$this->id_producto') + '$this->cantidad') WHERE stock.id_producto = '$_id_producto'";
        if($this->set_query()){
            return array("error"=>false);
        }else{
            return array("error"=>true, "mesaje"=>"No se pudo modificar");
        }
    }
    public function delete(){
        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "DELETE FROM productos WHERE id_producto = '$_id';";
        if($this->set_query()){
            return json_encode(array("error"=>false));
        }else{
            return json_encode(array("error"=>true, "mesaje"=>"No se pudo eliminar la nota"));
        }
    }
    public function readLike(){
        if(strlen($this->nombre) == 0){
            $this->query = "SELECT id_producto, nombre, cantidad, zona FROM stock WHERE zona = '$this->zona' ORDER BY id_producto DESC;";    
        }else if(strlen($this->nombre) >= 3){
            $this->query = "SELECT id_producto, nombre, cantidad, zona FROM stock WHERE zona = '$this->zona' AND nombre LIKE '%$this->nombre%'";            
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function checkStock(){
        $this->query = "SELECT id_producto, cantidad, nombre FROM stock WHERE id_producto = '$this->id_producto';";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function updateStock(){
        $this->query = "UPDATE stock SET cantidad = cantidad - '$this->cantidad' WHERE id_producto = '$this->id_producto';";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
    public function updateStockSum(){
        $this->query = "UPDATE stock SET cantidad = cantidad + '$this->cantidad' WHERE id_producto = '$this->id_producto';";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
}

?>