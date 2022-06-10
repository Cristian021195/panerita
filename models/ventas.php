<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once('../../config/connect.php');
class VentasModel extends DbModel{
    public $desde;
    public $hasta;
    public $id_producto;
    public $id_comprobante;
    public $zona;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){}
    public function read(){
        $zona = $_SESSION['zona'];
        $this->db_open();
        $_desde = mysqli_real_escape_string($this->connect, $this->desde);
        $_hasta = mysqli_real_escape_string($this->connect, $this->hasta);
        $_id_producto = mysqli_real_escape_string($this->connect, $this->id_producto);
        $_zona = mysqli_real_escape_string($this->connect, $this->zona);
        $this->db_close();

        if($_id_producto == "todos"){
            $this->query = "SELECT productos.nombre as producto, sum(detalles.cantidad) as ventas, sum(detalles.devolucion) as devoluciones,
            sum(detalles.cantidad) + sum(detalles.devolucion) as total FROM productos INNER JOIN detalles ON productos.id_producto = detalles.id_producto
            INNER JOIN comprobantes ON comprobantes.id_comprobante = detalles.id_comprobante WHERE comprobantes.fecha > '$_desde' AND comprobantes.fecha < '$_hasta' AND comprobantes.zona = '$_zona' GROUP BY productos.nombre;";
        }else{
            $this->query = "SELECT productos.nombre as producto, sum(detalles.cantidad) as ventas, sum(detalles.devolucion) as devoluciones,
            sum(detalles.cantidad) + sum(detalles.devolucion) as total FROM productos INNER JOIN detalles ON productos.id_producto = detalles.id_producto
            INNER JOIN comprobantes ON comprobantes.id_comprobante = detalles.id_comprobante WHERE comprobantes.fecha > '$_desde' AND comprobantes.fecha < '$_hasta' AND productos.id_producto = $_id_producto AND comprobantes.zona = '$_zona';";
        }
        $this->get_query();
        return ($this->rows);
    }
    public function readOne(){
        return array("error"=>true);        
    }
    public function readRange($start, $end){}
    public function update(){}
    public function delete(){}
}

?>