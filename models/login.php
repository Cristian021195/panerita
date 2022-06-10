<?php
require_once('../config/connect.php');

class LoginModel extends DbModel{
    public $status_id;
    public $status;

    public function __construct(){
        session_start();
    }
    public function __destruct(){/*unset(StatusModel);*/}
    public function create(){}
    public function doLogin($usuario, $contra){
        $this->query = "SELECT * FROM usuarios WHERE mail = '" . $usuario . "';";
        $this->get_query();
        $this->num_rows = count($this->rows);//este num rows nos sirve para operar en backend
        if ( $this->num_rows == 1 ){
            if (password_verify($contra, $this->rows[0]['contra'])) {
                $_SESSION['logueado'] = true;
                $_SESSION['id'] = $this->rows[0]['mail'];
                $_SESSION['nombre'] = $this->rows[0]['nombre'];
                $_SESSION['nacimiento'] = $this->rows[0]['nacimiento']; $_SESSION['foto'] = $this->rows[0]['foto'];
                $_SESSION['tipo'] = $this->rows[0]['tipo'];
                $_SESSION['dni'] = $this->rows[0]['dni']; $_SESSION['telefono'] = $this->rows[0]['telefono']; $_SESSION['direccion'] = $this->rows[0]['direccion'];
                $_SESSION['zona'] = $this->rows[0]['zona'];
                $_SESSION['estado'] = $this->rows[0]['estado'];
                echo json_encode(array("error"=>false, "datos"=>[
                    "id"=>$this->rows[0]['mail'],//si
                    "nombre"=>$this->rows[0]['nombre'],//si
                    "foto"=>$this->rows[0]['foto'],
                    "dni"=>$this->rows[0]['dni'],
                    "nacimiento"=>$this->rows[0]['nacimiento'],
                    "tipo"=>$this->rows[0]['tipo'],//si
                    "telefono"=>$this->rows[0]['telefono'],//posible
                    "direccion"=>$this->rows[0]['direccion'],
                    "zona"=>$this->rows[0]['zona'],//posible
                    "estado"=>$this->rows[0]['estado'],//no
                    "error"=>false//no
                ]
                ));
            } else {
                echo json_encode(array("error"=>"Usuario o Contraseña Incorrectos.."));
            }
        }else if ( $this->num_rows > 1 ){
            echo json_encode(array("error"=>"Error #A001, Comuniquese con el Administrador de la Base de datos"));//usuario duplicado
        }else{
            echo json_encode(array("error"=>"Usuario o Contraseña Incorrectos.."));
        }
    }
    public function getUserData($usuario){
        $this->query = "SELECT mail as id, nombre, foto, dni, nacimiento, tipo, telefono, direccion, zona, estado FROM usuarios WHERE mail = '$usuario';";
        $this->get_query();
        return $this->rows;
    }
    public function doCheckLogin($usuario, $contra){
        $this->query = "SELECT * FROM usuarios WHERE mail = '" . $usuario . "';";
        $this->get_query();
        $this->num_rows = count($this->rows);//este num rows nos sirve para operar en backend
        if ( $this->num_rows == 1 ){
            if (password_verify($contra, $this->rows[0]['contra'])) {
                return array("error"=>false);
            } else {
                return array("error"=>true, "mensaje"=>"¡Contraseña Incorrecta!");
            }
        }else if ( $this->num_rows > 1 ){
            echo json_encode(array("error"=>true, "mensaje"=>"Error #A001, Comuniquese con el Administrador de la Base de datos"));//usuario duplicado
        }else{
            echo json_encode(array("error"=>true, "mensaje"=>"Usuario o Contraseña Incorrectos.."));
        }
    }
    public function read(){
    }
    public function readOne(){
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
    
    }
    public function delete(){

    }
    public function doLogout()
    {
        $_SESSION = array();//null sesion
        session_destroy();
        $this->messages[] = "Has sido desconectado.";
    }
    public function isUserLoggedIn()
    {
        if (isset($_SESSION['user_login_status']) AND $_SESSION['user_login_status'] == 1) {
            return true;
        }
        return false;
    }
    
}


?>