<?php
require_once('../../config/connect.php');

class SesionModel extends DbModel{
    public $status_id;
    public $status;


    /*public function __construct(){
        $this->db_name = 'mexflix';
    }*/

    public function __destruct(){
        //unset(StatusModel);
    }

    public function create(){

    }
    public function read(){
        $this->query = "SELECT * FROM notas;";
        $this->get_query();
        $this->num_rows = count($this->rows);//este num rows nos sirve para operar en backend
        //echo $this->num_rows;//puede que tengamos que retornar el arreglo sin json al controlador.
        echo json_encode($this->rows);//aun asi nos puede servir
        //return $this->rows;
    }
    public function readRange($start, $end){//
        if(($start >= 0) && ($end > 0) && ($start < $end)){
            $this->query = "SELECT * FROM status LIMIT $start,$end";
            $this->get_query();
        }else{
            $this->rows = null;   
        }        
        echo json_encode($this->rows);
    }
    public function update(){
    
    }
    public function delete(){

    }
    
}

?>