<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');

class ComprobantesModel extends DbModel{
    public $id_comprobante;
    public $cliente;
    public $vendedor;
    public $fecha;
    public $estado;
    public $total;
    public $entregado;
    public $zona;

    public function __destruct(){}

    public function create(){
        $_total = $this->total;
        $this->db_open();
        $_cliente = mysqli_real_escape_string($this->connect, $this->cliente);
        $_vendedor = mysqli_real_escape_string($this->connect, $this->vendedor);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();
        $this->query = "INSERT INTO comprobantes (id_cliente, mail, total, zona, fecha) VALUES ('$_cliente','$_vendedor', '$_total', '$_zona', '$this->fecha');";
        if($this->set_query()){
            return $this->connect->insert_id;
        }else{
            return array("error"=>true, "mensaje"=>"¡id comprobante, id detalle, vendedor o cliente!");
        }
    }
    public function read(){
        $tipo = $_SESSION['tipo'];
        $id_usuario = $_SESSION['id'];
        $zona = $_SESSION['zona'];
        $common = "SELECT fecha, clientes.nombre as cliente, usuarios.nombre as vendedor, comprobantes.estado, 
        total, id_comprobante, clientes.tipo as tipo, usuarios.tipo as tipo_vendedor FROM comprobantes INNER JOIN 
        clientes ON clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail";
        $common_end = "ORDER BY comprobantes.fecha DESC LIMIT 10";

        if($tipo == 'super'){
            $this->query = "$common $common_end";
        }else if($tipo == 'administrador' || $tipo == 'secretaria'){
            $this->query = "$common WHERE comprobantes.zona = '$zona' $common_end;";
        }else if($tipo == 'empleado'){
            $this->query = "$common WHERE usuarios.mail = '$id_usuario' $common_end;";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function contadorComprobantes(){
        $zona = $_SESSION['zona'];
        $tipo = $_SESSION['tipo'];
        $id = $_SESSION['id'];
        $common = "SELECT 'estados' as estados,
        sum(case when estado = 'pagado' then 1 else 0 end) AS pagado,
        sum(case when estado = 'pendiente' then 1 else 0 end) AS pendiente,
        sum(case when estado = 'deudor' then 1 else 0 end) AS deudor
        FROM comprobantes";
        if($zona == 'super'){
            $this->query = $common;
        }else{
            if($tipo == 'empleado'){
                $this->query = "$common WHERE comprobantes.mail = '$id'";
            }else{
                $this->query = "$common WHERE comprobantes.zona = '$zona'";
            }            
        }
        $this->get_query();
        return json_encode($this->rows);
    }
    public function readOne(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();
        $this->query = "SELECT clientes.nombre as cliente, clientes.direccion as direccion, clientes.telefono, fecha, usuarios.nombre as vendedor, total, clientes.tipo as tipo FROM comprobantes INNER JOIN clientes ON clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios on comprobantes.mail = usuarios.mail WHERE id_comprobante = $_id_comprobante;";
        $this->get_query();
        return $this->rows;
    }
    public function readRange($desde, $hasta){
        $tipo = $_SESSION['tipo'];
        $id_usuario = $_SESSION['id'];
        $zona = $_SESSION['zona'];

        $common = "SELECT fecha, clientes.nombre as cliente, usuarios.nombre as vendedor, comprobantes.estado, total, id_comprobante FROM comprobantes INNER JOIN clientes ON
        clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail ";
        $common_end = "ORDER BY comprobantes.fecha DESC LIMIT $desde , $hasta";

        if($tipo == 'super'){
            $this->query = $common.$common_end;
        }else if($tipo == 'administrador'){
            $this->query = "$common WHERE comprobantes.zona = '$zona' $common_end;";
        }else if($tipo == 'empleado'){
            $this->query = "$common WHERE usuarios.mail = '$id_usuario' $common_end;";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readDateRange($desde, $hasta){
        $this->db_open();
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();
        $tipo = $_SESSION['tipo'];
        $id_usuario = $_SESSION['id'];
        $common = "SELECT clientes.nombre as cliente, clientes.direccion as direccion, clientes.telefono, fecha, total, usuarios.nombre as vendedor, id_comprobante FROM comprobantes INNER JOIN clientes ON
        clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail WHERE comprobantes.fecha > '$desde' AND comprobantes.fecha < '$hasta'";

        if($tipo == 'super'){
            $this->query = "$common AND comprobantes.zona = '$_zona'";
        }else if($tipo == 'administrador'){
            $this->query = "$common AND comprobantes.zona = '$_zona';";
        }else if($tipo == 'empleado'){
            $this->query = "$common AND usuarios.mail = '$id_usuario';";
        }
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function update(){
        $this->db_open();
        $_total = mysqli_real_escape_string($this->connect, $this->total);
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();

        if(!empty($_id_comprobante)){
            $this->query = "UPDATE comprobantes SET total = '$_total' WHERE id_comprobante = '$_id_comprobante';";
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
        $this->query = "DELETE FROM comprobantes WHERE estado = 'pagado';";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
    public function restarTotalSimple(){
        $this->db_open();
        $_total = mysqli_real_escape_string($this->connect, $this->total);
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();

        if(!empty($_id_comprobante)){
            $this->query = "UPDATE comprobantes SET total = total - '$_total' WHERE id_comprobante = '$_id_comprobante';";
            if($this->set_query()){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    }
    public function sumarTotalSimple(){
        $this->db_open();
        $_total = mysqli_real_escape_string($this->connect, $this->total);
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();

        if(!empty($_id_comprobante)){
            $this->query = "UPDATE comprobantes SET total = total + '$_total' WHERE id_comprobante = '$_id_comprobante';";
            if($this->set_query()){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    }
    public function delete(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();

        $this->query = "DELETE FROM comprobantes WHERE id_comprobante = '$_id_comprobante';";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
    public function readLike($cliente, $estado, $zona){
        $this->db_open();
        $_cliente = mysqli_real_escape_string($this->connect, $cliente);
        $_estado = mysqli_real_escape_string($this->connect, $estado);
        $_zona = mysqli_real_escape_string($this->connect, $zona);
        $this->db_close();
        $zona = $_SESSION['zona'];
        $tipo = $_SESSION['tipo'];
        $id = $_SESSION['id'];
        $common = "SELECT fecha, clientes.nombre as cliente, usuarios.nombre as vendedor, comprobantes.estado, total, id_comprobante FROM comprobantes INNER JOIN clientes ON
        clientes.id_cliente = comprobantes.id_cliente INNER JOIN usuarios ON usuarios.mail = comprobantes.mail WHERE clientes.nombre LIKE '%$_cliente%'";

        if($zona == 'super'){
            if($_estado == "todos"){
                $this->query = $common;
            }else if($_estado != "todos"){
                $this->query = "$common AND comprobantes.estado = '$_estado';";
            }    
        }else{
            if($tipo == 'empleado'){
                if($_estado == "todos"){
                    $this->query = "$common AND usuarios.mail = '$id'";
                }else if($_estado != "todos"){
                    $this->query = "$common AND usuarios.mail = '$id' AND comprobantes.estado = '$_estado';";
                }
            }else{
                if($_estado == "todos"){
                    $this->query = "$common AND comprobantes.zona = '$zona'";
                }else if($_estado != "todos"){
                    $this->query = "$common AND comprobantes.zona = '$zona' AND comprobantes.estado = '$_estado';";
                }
            }
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