<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class CierresModel extends DbModel{
    public $id_comprobante;
    public $estado;
    public $estado_cliente;
    public $desde;
    public $hasta;
    public $identificador;

    public function __destruct(){
        //unset(StatusModel);
    }

    public function create(){
        echo json_encode(array("error"=>true, "mensaje"=>"¡id comprobante, id detalle, vendedor o cliente!"));
    }
    public function read(){
        $zona = $_SESSION['zona'];
        $this->db_open();
        $_desde = mysqli_real_escape_string($this->connect, $this->desde);
        $_hasta = mysqli_real_escape_string($this->connect, $this->hasta);
        $_estado = mysqli_real_escape_string($this->connect, $this->estado);
        $_estado_cliente = mysqli_real_escape_string($this->connect, $this->estado_cliente);
        $this->db_close();

        $common = "SELECT fecha, clientes.nombre as cliente, usuarios.nombre as vendedor, comprobantes.estado, total, id_comprobante FROM comprobantes INNER JOIN clientes ON
        clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail WHERE comprobantes.fecha > '$_desde' AND comprobantes.fecha < '$_hasta'";

        if($zona == 'super'){
            if($_estado == 'todos' && $_estado_cliente == 'todos'){
                $this->query = $common;
            }else if($_estado != 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND clientes.estado = '$_estado_cliente'";
            }else if($_estado != 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado'";
            }else if($_estado == 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND clientes.estado = '$_estado_cliente'";
            }
        }else{
            if($_estado == 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.zona = '$zona'";
            }else if($_estado != 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND clientes.estado = '$_estado_cliente' AND comprobantes.zona = '$zona'";
            }else if($_estado != 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND comprobantes.zona = '$zona'";
            }else if($_estado == 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND clientes.estado = '$_estado_cliente' AND comprobantes.zona = '$zona'";
            }
        }
        
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function contadorComprobantes(){
        $zona = $_SESSION['zona'];
        $common = "SELECT 'estados' as estados,
        sum(case when estado = 'pagado' then 1 else 0 end) AS pagado,
        sum(case when estado = 'pendiente' then 1 else 0 end) AS pendiente,
        sum(case when estado = 'deudor' then 1 else 0 end) AS deudor
        FROM comprobantes";
        if($zona == 'super'){
            $this->query = $common;
        }else{
            $this->query = "$common WHERE comprobantes.zona = '$zona'";
        }
        
        $this->get_query();
        return json_encode($this->rows);
    }
    public function readOne(){
        $zona = $_SESSION['zona'];
        $this->db_open();
        $_desde = mysqli_real_escape_string($this->connect, $this->desde);
        $_hasta = mysqli_real_escape_string($this->connect, $this->hasta);
        $_cliente = mysqli_real_escape_string($this->connect, $this->identificador);
        $_estado = mysqli_real_escape_string($this->connect, $this->estado);
        $_estado_cliente = mysqli_real_escape_string($this->connect, $this->estado_cliente);
        $this->db_close();

        $common = "SELECT fecha, clientes.nombre as cliente, usuarios.nombre as vendedor, comprobantes.estado, total, id_comprobante FROM comprobantes INNER JOIN clientes ON
        clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail WHERE clientes.nombre LIKE '%$_cliente%' AND comprobantes.fecha > '$_desde' AND comprobantes.fecha < '$_hasta'";

        if($zona == 'super'){
            if($_estado == 'todos' && $_estado_cliente == 'todos'){
                $this->query = $common;
            }else if($_estado != 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND clientes.estado = '$_estado_cliente'";
            }else if($_estado != 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado'";
            }else if($_estado == 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND clientes.estado = '$_estado_cliente'";
            }
        }else{
            if($_estado == 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.zona = '$zona'";
            }else if($_estado != 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND clientes.estado = '$_estado_cliente' AND comprobantes.zona = '$zona'";
            }else if($_estado != 'todos' && $_estado_cliente == 'todos'){
                $this->query = "$common AND comprobantes.estado = '$_estado' AND comprobantes.zona = '$zona'";
            }else if($_estado == 'todos' && $_estado_cliente != 'todos'){
                $this->query = "$common AND clientes.estado = '$_estado_cliente' AND comprobantes.zona = '$zona'";
            }
        }
        
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readRange($desde, $hasta){
        echo json_encode(array("error"=>true, "mensaje"=>"¡Funcion sin definir en backend!"));
    }
    public function update(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $_estado = mysqli_real_escape_string($this->connect, $this->estado);
        $this->db_close();

        if(!empty($_id_comprobante)){
            $this->query = "UPDATE comprobantes SET estado = '$_estado' WHERE id_comprobante = '$_id_comprobante';";
            if($this->set_query()){
                return array("error"=>false);
            }else{
                return array("error"=>true, "mensaje"=>"¡Verifique si estan todos los campos a actualizar!");
            }
        }else{
            return array("error"=>true, "mensaje"=>"¡Verifique si estan todos los campos a actualizar!");
        }
    }
    public function deletePayed(){
        return array("error"=>true, "mensaje"=>"¡Funcion sin definir en backend!");
    }
    public function delete(){
        return array("error"=>true, "mensaje"=>"¡Funcion sin definir en backend!");
    }
    public function readLike($cliente, $estado, $zona){
        return array("error"=>true, "mensaje"=>"¡Funcion sin definir en backend!");
    }
}

?>