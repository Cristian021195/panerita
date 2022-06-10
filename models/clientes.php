<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class ClientesModel extends DbModel{
    public $id;
    public $nombre;
    public $dni;
    public $tipo;
    public $telefono;
    public $mail;
    public $direccion;
    public $estado;
    public $zona;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
        $zona = $_SESSION['zona'];
        $this->db_open();
        $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
        $_dni = mysqli_real_escape_string($this->connect, $this->dni);
        $_tipo = mysqli_real_escape_string($this->connect, $this->tipo);
        $_telefono = mysqli_real_escape_string($this->connect, $this->telefono);
        $_mail = mysqli_real_escape_string($this->connect, $this->mail);
        $_estado = mysqli_real_escape_string($this->connect, $this->estado);
        $_direccion = mysqli_real_escape_string($this->connect, $this->direccion);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();
        if($zona == 'super'){
            $this->query = "INSERT INTO clientes (nombre, dni, tipo, telefono, mail, zona, estado, direccion) VALUES (
                '$_nombre','$_dni','$_tipo','$_telefono','$_mail','$_zona','$_estado','$_direccion'
            );";
        }else{
            $this->query = "INSERT INTO clientes (nombre, dni, tipo, telefono, mail, zona, estado, direccion) VALUES (
                '$_nombre','$_dni','$_tipo','$_telefono','$_mail','$zona','$_estado','$_direccion'
            );";
        }
        
        if($this->set_query()){
            return array("error"=>false, "id_cliente"=>$this->connect->insert_id, "estado"=>$this->estado, "nombre"=>$this->nombre, "dni"=>$this->dni, "tipo"=>$this->tipo, "telefono"=>$this->telefono, "mail"=>$this->mail, "direccion"=>$this->direccion);
        }else{
            return array("error"=>true, "mensaje"=>"Cliente / Dni / Mail duplicados, revise que cliente quiere agregar..");
        }
    }
    public function read(){
        $zona = $_SESSION['zona'];
        if($zona == 'super'){
            //$this->query = "SELECT id_cliente, nombre, dni, tipo, telefono, mail, direccion, estado FROM clientes ORDER BY id_cliente DESC LIMIT 10;"; 
            $this->zona = 'catamarca';
            $this->query = "SELECT id_cliente, nombre, dni, tipo, telefono, mail, direccion, estado FROM clientes WHERE clientes.zona = '$this->zona' ORDER BY id_cliente DESC LIMIT 10;";
        }else{
            $this->query = "SELECT id_cliente, nombre, dni, tipo, telefono, mail, direccion, estado FROM clientes WHERE clientes.zona = '$zona' ORDER BY id_cliente DESC LIMIT 10;";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function contadorClientes(){
        $zona = $_SESSION['zona'];
        $tipo = $_SESSION['tipo'];
        $id = $_SESSION['id'];
        $common = "SELECT COUNT(id_cliente) AS cantidad FROM clientes";
        if($zona == 'super'){
            $this->query = $common;
        }else{
            $this->query = "$common WHERE zona = '$zona'";
        }
        $this->get_query();
        return $this->rows;
    }
    public function readOne(){}
    public function readRange($desde, $hasta){
        $tipo = $_SESSION['tipo'];
        $id_usuario = $_SESSION['id'];
        $zona = $_SESSION['zona'];

        $common = "SELECT id_cliente, nombre, dni, tipo, telefono, mail, direccion, estado FROM clientes ORDER BY id_cliente LIMIT $desde , $hasta";

        if($tipo == 'super'){
            $this->query = $common;
        }else{
            $this->query = "$common WHERE zona= '$zona'";
        }
        $this->get_query();
        return $this->rows;//aun asi nos puede servir
    }
    public function update(){
        if($this->id != null){
            $this->db_open();
            $_id = mysqli_real_escape_string($this->connect, $this->id);
            $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
            $_dni = mysqli_real_escape_string($this->connect, $this->dni);
            $_tipo = mysqli_real_escape_string($this->connect, $this->tipo);
            $_telefono = mysqli_real_escape_string($this->connect, $this->telefono);
            $_mail = mysqli_real_escape_string($this->connect, $this->mail);
            $_zona = mysqli_real_escape_string($this->connect, $this->zona);
            $_estado = mysqli_real_escape_string($this->connect, $this->estado);
            $_direccion = mysqli_real_escape_string($this->connect, $this->direccion);
            $this->db_close();
        }
        $this->query = "UPDATE clientes SET 
        nombre = '$_nombre', dni = '$_dni', tipo = '$_tipo', telefono = '$_telefono', mail = '$_mail', zona = '$_zona', estado = '$_estado', direccion = '$_direccion' WHERE id_cliente = $_id";
        if($this->set_query()){
            return array("error"=>false, "id_cliente"=>$this->id, "estado"=>$this->estado, "nombre"=>$this->nombre, "dni"=>$this->dni, "tipo"=>$this->tipo, "telefono"=>$this->telefono, "mail"=>$this->mail, "direccion"=>$this->direccion);
        }else{
            return array("error"=>true, "mensaje"=>"¡No se pudo actualizar el registro, verifique bien los campos desde bbdd!");
        }
    }
    public function delete(){
        $this->db_open();
        $_id = mysqli_real_escape_string($this->connect, $this->id);
        $this->db_close();

        $this->query = "DELETE FROM clientes WHERE id_cliente = '$_id';";
        if($this->set_query()){
            return array("error"=>false);
        }else{
            return array("error"=>true, "mesaje"=>"No se pudo eliminar el cliente, ver BBDD");
        }
    }
    public function readLike($nombre, $tipo, $zona){
        $this->db_open();
        $_nombre = mysqli_real_escape_string($this->connect, $nombre);
        $_tipo = mysqli_real_escape_string($this->connect, $tipo);
        $_zona = mysqli_real_escape_string($this->connect, $zona);
        $this->db_close();

        $tipo = $_SESSION['tipo'];
        $id = $_SESSION['id'];

        $common = "SELECT id_cliente, nombre, dni, tipo, telefono, mail, zona, direccion, estado FROM clientes WHERE nombre LIKE '%$_nombre%'";

        if($zona == 'super'){
            if($_tipo != 'todos'){
                $this->query = "$common AND tipo = '$_tipo';";
            }else{
                $this->query = $common;
            }
        }else{
            if($_tipo == 'todos' && $_zona == 'todos'){
                $this->query = "$common";
            }else if($_tipo != 'todos' && $_zona == 'todos'){
                $this->query = "$common AND tipo = '$_tipo';";
            }else if($_tipo == 'todos' && $_zona != 'todos'){
                $this->query = "$common AND zona = '$_zona';";
            }else{
                $this->query = "$common AND zona = '$_zona' AND tipo = '$_tipo';";
            }
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
}
function porcentaje($porciento){//1.1
    return (100 + $porciento) / 100;
}

?>