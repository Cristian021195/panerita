<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class UsuariosModel extends DbModel{
    public $id_usuario;
    public $mail;
    public $nombre;
    public $foto;
    public $dni;
    public $contra;
    public $nacimiento;
    public $tipo;
    public $telefono;
    public $zona;
    public $direccion;
    public $estado;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
        $this->db_open();
        $_mail = mysqli_real_escape_string($this->connect, $this->mail);
        $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
        $_dni = mysqli_real_escape_string($this->connect, $this->dni);
        $_contra = password_hash($this->contra, PASSWORD_DEFAULT);//mysqli_real_escape_string($this->connect, $this->contra);
        $_nacimiento = mysqli_real_escape_string($this->connect, $this->nacimiento);
        $_tipo = mysqli_real_escape_string($this->connect, $this->tipo);
        $_telefono = mysqli_real_escape_string($this->connect, $this->telefono);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $_direccion = mysqli_real_escape_string($this->connect, $this->direccion);
        $_estado = mysqli_real_escape_string($this->connect, $this->estado);
        $this->db_close();
        $this->query = "INSERT INTO usuarios (mail, nombre, dni, contra, nacimiento, tipo, telefono, direccion, zona, estado) VALUES (
            '$_mail','$_nombre','$_dni','$_contra','$_nacimiento','$_tipo','$_telefono','$_direccion','$_zona','$_estado'
        );";
        if($this->set_query()){
            return array("error"=>false, "mail"=>$this->mail, "nombre"=>$this->nombre, "foto"=>"default.svg", "dni"=>$this->dni, "nacimiento"=>$this->nacimiento,"tipo"=>$this->tipo, "telefono"=>$this->telefono, "direccion"=>$this->direccion, "zona"=>$this->zona, "estado"=>$this->estado);
        }else{
            return array("error"=>true, "mensaje"=>"Dni / Mail duplicados, revise que usuario quiere agregar..");
        }
    }
    public function read(){
        $tipo_usuario = $_SESSION['tipo'];
        $id = $_SESSION['id'];
        $zona = $_SESSION['zona'];
        
        if($zona == 'super'){
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE usuarios.mail <>'$id';";
        }else{
            if($tipo_usuario == 'administrador'){
                $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE usuarios.zona = '$zona' AND usuarios.mail <> '$id';";//LIMIT 10
            }else if($tipo_usuario == 'empleado'){
                $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE usuarios.mail = '$id'";//LIMIT 10
            }if($tipo_usuario == 'secretaria'){
                $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE usuarios.zona = '$zona';";//LIMIT 10
            }
        }
        
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readOne(){
        $this->db_open();
        $_mail = mysqli_real_escape_string($this->connect, $this->mail);
        $this->db_close();

        $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE mail='$_mail';";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readRange($start, $end){//
        if(($start >= 0) && ($end > 0) && ($start < $end)){
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios LIMIT $start,$end";
            $this->get_query();
        }else{
            $this->rows = null;   
        }        
        return $this->rows;
    }
    public function update(){
        if($this->id_usuario != null){
            $this->db_open();
            $_id_usuario = mysqli_real_escape_string($this->connect, $this->id_usuario);
            $_mail = mysqli_real_escape_string($this->connect, $this->mail);
            $_nombre = mysqli_real_escape_string($this->connect, $this->nombre);
            $_foto = mysqli_real_escape_string($this->connect, $this->foto);
            $_dni = mysqli_real_escape_string($this->connect, $this->dni);
            $_contra = password_hash($this->contra, PASSWORD_DEFAULT);//mysqli_real_escape_string($this->connect, $this->contra);
            $_nacimiento = mysqli_real_escape_string($this->connect, $this->nacimiento);
            $_tipo = mysqli_real_escape_string($this->connect, $this->tipo);
            $_telefono = mysqli_real_escape_string($this->connect, $this->telefono);
            $_zona = mysqli_real_escape_string($this->connect, $this->zona);
            $_direccion = mysqli_real_escape_string($this->connect, $this->direccion);
            $_estado = mysqli_real_escape_string($this->connect, $this->estado);
            $this->db_close();
        }

        if(!empty($this->contra)){
            $this->query = "UPDATE usuarios SET nombre = '$_nombre', mail ='$_mail',
            dni = '$_dni',
            contra = '$_contra',
            nacimiento = '$_nacimiento',
            tipo = '$_tipo',
            telefono = '$_telefono',
            zona = '$_zona',
            direccion = '$_direccion',
            estado = '$_estado' WHERE mail = '$_id_usuario';";
        }else{
            $this->query = "UPDATE usuarios SET nombre = '$_nombre', mail ='$_mail',
            dni = '$_dni',
            nacimiento = '$_nacimiento',
            tipo = '$_tipo',
            telefono = '$_telefono',
            zona = '$_zona',
            direccion = '$_direccion',
            estado = '$_estado' WHERE mail = '$_id_usuario';";
        }
        if($this->set_query()){
            return array("error"=>false, "mail"=>$this->mail, "nombre"=>$this->nombre, "foto"=>$this->foto, "dni"=>$this->dni, "nacimiento"=>$this->nacimiento, "tipo"=>$this->tipo, "telefono"=>$this->telefono, "direccion"=>$this->direccion, "zona"=>$this->zona, "estado"=>$this->estado);
        }else{
            return array("error"=>true, "mensaje"=>"¡No se pudo actualizar el registro, verifique bien los campos desde bbdd!");
        }
    }
    
    public function updateProfile(){
        $id = $_SESSION['id'];
        $this->db_open();
        $_telefono = mysqli_real_escape_string($this->connect, $this->telefono);
        $_direccion = mysqli_real_escape_string($this->connect, $this->direccion);
        $_mail = mysqli_real_escape_string($this->connect, $this->mail);
        $_contra = password_hash($this->contra, PASSWORD_DEFAULT);
        $this->db_close();

        if(strlen($this->contra) >= 8){
            $this->query = "UPDATE usuarios SET mail = '$_mail', telefono = '$_telefono', direccion='$_direccion', contra = '$_contra' WHERE mail = '$id'";
        }else{
            $this->query = "UPDATE usuarios SET mail = '$_mail', telefono = '$_telefono', direccion='$_direccion' WHERE mail = '$id'";
        }

        if($this->set_query()){
            $_SESSION['id'] = $_mail;
            return array("error"=>false, "id"=>$_mail, "telefono"=>$_telefono, "direccion"=>$_direccion);
        }else{
            return array("error"=>true, "mensaje"=>mysqli_error($this->connect));
        }
    }
    
    public function delete(){
        $this->db_open();
        $_mail = mysqli_real_escape_string($this->connect, $this->mail);
        $this->db_close();

        $this->query = "DELETE FROM usuarios WHERE mail = '$_mail';";
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

        if($_tipo == 'todos' && $_zona == 'todos'){
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE nombre LIKE '%$_nombre%';";// AND tipo = '$_tipo'
        }else if($_tipo == 'todos' && $_zona != 'todos'){
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE nombre LIKE '%$_nombre%' AND zona = '$_zona';";// AND tipo = '$_tipo'
        }else if($_tipo != 'todos' && $_zona == 'todos'){
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE nombre LIKE '%$_nombre%' AND tipo = '$_tipo';";// AND tipo = '$_tipo'
        }else{
            $this->query = "SELECT mail, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE nombre LIKE '%$_nombre%' AND tipo = '$_tipo' AND zona = '$_zona';";// AND tipo = '$_tipo'
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;        
    }
}
function porcentaje($porciento){
    return (100 + $porciento) / 100;
}

?>