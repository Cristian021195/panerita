<?php
require_once('../../config/connect.php');
session_start();

class ProductosModel extends DbModel{
    public $nombre;
    public $precio;
    public $base;
    public $distribuidor;
    public $mayorista;
    public $minorista;
    public $tipo;
    public $id;
    public $zona;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
        $this->db_open();
        $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
        $_base = mysqli_real_escape_string($this->connect, $this->base);
        $_distribuidor = mysqli_real_escape_string($this->connect, $this->distribuidor);
        $_mayorista = mysqli_real_escape_string($this->connect, $this->mayorista);
        $_minorista = mysqli_real_escape_string($this->connect, $this->minorista);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();

        $zona = $_SESSION['zona'];
        $common = "INSERT INTO productos (nombre, zona, base, distribuidor, mayorista, minorista, estado) VALUES (";

        if(!empty($_zona)){
            if($_distribuidor > 0 && $_mayorista > 0 && $_minorista > 0){
                $this->query = "$common '$_nombre', '$_zona', $_base, $_distribuidor, $_mayorista, $_minorista, 1 );";
            }else{
                $this->query = "$common '$_nombre', '$_zona', $_base, $_base*1.1, $_base*1.2, $_base*1.3, 1 );";
            }
        }else{
            if($_distribuidor > 0 && $_mayorista > 0 && $_minorista > 0){
                $this->query = "$common '$_nombre', '$zona', $_base, $_distribuidor, $_mayorista, $_minorista, 1 );";
            }else{
                $this->query = "$common '$_nombre', '$zona', $_base, $_base*1.1, $_base*1.2, $_base*1.3, 1 );";
            } 
        }

        $this->set_query();        
        if($_distribuidor > 0 && $_mayorista > 0 && $_minorista > 0){
            echo json_encode(array("error"=>false, "id_producto"=>$this->connect->insert_id, "nombre"=>$this->nombre, "base"=>$_base*1, "distribuidor"=>$_distribuidor,"mayorista"=>$_mayorista,"minorista"=>$_minorista));
        }else if($_distribuidor == 0 && $_mayorista == 0 && $_minorista == 0){
            echo json_encode(array("error"=>false, "id_producto"=>$this->connect->insert_id, "nombre"=>$this->nombre, "base"=>$_base*1, "distribuidor"=>$_base*1.1,"mayorista"=>$_base*1.2,"minorista"=>$_base*1.3));
        }else{
            echo json_encode(array("error"=>true));
        }
    }
    public function read(){
        $zona = $_SESSION['zona'];
        //$this->query = "SELECT id_producto, nombre, base, distribuidor, mayorista, minorista FROM productos ORDER BY id_producto DESC;";
        if($zona == 'super'){
            $this->query = "SELECT id_producto, nombre, base, distribuidor, mayorista, minorista FROM productos ORDER BY id_producto DESC;";
        }else{
            $this->query = "SELECT id_producto, nombre, base, distribuidor, mayorista, minorista FROM productos WHERE zona = '$zona' ORDER BY id_producto DESC;";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return json_encode($this->rows);
    }
    public function readType($type){
        $zona = $_SESSION['zona'];
        if($zona == 'super'){
            $this->query = "SELECT id_producto, nombre, $type as precio FROM productos ORDER BY id_producto DESC;";
        }else{
            $this->query = "SELECT id_producto, nombre, $type as precio FROM productos WHERE zona = '$zona' ORDER BY id_producto DESC;";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        
        return json_encode($this->rows);
        
    }
    public function readOne(){

        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();
        $this->query = "SELECT id_nota, nota, fecha FROM notas WHERE id_nota='$_id';";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return json_encode($this->rows);
    }
    public function readRange($start, $end){}
    public function update(){
        if($this->id != null){
            $this->db_open();
            $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
            
            $_id = mysqli_real_escape_string($this->connect, $this->id);
            $this->db_close();
        }

        $this->db_open();
        $_base = mysqli_real_escape_string($this->connect, $this->base);
        $_distribuidor = mysqli_real_escape_string($this->connect, $this->distribuidor);
        $_mayorista = mysqli_real_escape_string($this->connect, $this->mayorista);
        $_minorista = mysqli_real_escape_string($this->connect, $this->minorista);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();

        $zona = $_SESSION['zona'];

        if($zona == 'super'){
            if(isset($_id)){
                $this->query = "UPDATE productos SET nombre = '$_nombre', base = $_base, distribuidor = $_distribuidor, mayorista = $_mayorista, minorista = $_minorista WHERE id_producto = $_id;";
            }else{
                $this->query = "UPDATE productos SET base = base * ".porcentaje($_base).",
                distribuidor = distribuidor * ".porcentaje($_distribuidor).",
                mayorista = mayorista * ".porcentaje($_mayorista).",
                minorista = minorista * ".porcentaje($_minorista)."
                WHERE productos.zona = '$_zona'";
            }
        }else{
            if(isset($_id)){
                $this->query = "UPDATE productos SET nombre = '$_nombre', base = $_base, distribuidor = $_distribuidor, mayorista = $_mayorista, minorista = $_minorista WHERE id_producto = $_id;";
            }else{
                $this->query = "UPDATE productos SET base = base * ".porcentaje($_base).",
                distribuidor = distribuidor * ".porcentaje($_distribuidor).",
                mayorista = mayorista * ".porcentaje($_mayorista).",
                minorista = minorista * ".porcentaje($_minorista)."
                WHERE productos.zona = '$zona'";
            }
        }

        
        $this->set_query();
        if(isset($_id)){
            echo json_encode(array("error"=>false, "base"=>$_base, "distribuidor"=>$_distribuidor,"mayorista"=>$_mayorista,"minorista"=>$_minorista));
        }else if(!isset($_id)){
            echo json_encode(array("error"=>false));
        }else{
            echo json_encode(array("error"=>true));
        }
    }
    public function delete(){
        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "DELETE FROM productos WHERE id_producto = '$_id';";
        if($this->set_query()){
            echo json_encode(array("error"=>false));
        }else{
            echo json_encode(array("error"=>true, "mesaje"=>"No se pudo eliminar la nota"));
        }
    }
    public function readLike($nombre){
        $this->db_open();
        $_nombre = mysqli_real_escape_string($this->connect, $nombre);
        $this->db_close();
        $zona = $_SESSION['zona'];
        if($zona == 'super'){
            $this->query = "SELECT id_producto, nombre, base, distribuidor, mayorista, minorista FROM productos WHERE nombre LIKE '%$_nombre%';";
        }else{
            $this->query = "SELECT id_producto, nombre, base, distribuidor, mayorista, minorista FROM productos WHERE nombre LIKE '%$_nombre%' AND zona = '$zona';";
        }

        
        $this->get_query();
        $this->num_rows = count($this->rows);
        return json_encode($this->rows);
    }
}
function porcentaje($porciento){
    return (100 + $porciento) / 100;
}

?>