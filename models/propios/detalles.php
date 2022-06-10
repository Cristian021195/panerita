<?php
require_once('../../config/connect.php');

class DetallesModel extends DbModel{
    public $id_detalle;
    public $id_comprobante;
    public $id_producto;
    public $cantidad;
    public $devolucion;
    public $precio;

    public function __destruct(){/*unset(StatusModel);*/}

    public function create(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $_id_producto = mysqli_real_escape_string($this->connect, $this->id_producto);
        $_cantidad = mysqli_real_escape_string($this->connect, $this->cantidad);
        $_devolucion = mysqli_real_escape_string($this->connect, $this->devolucion);
        $_precio = mysqli_real_escape_string($this->connect, $this->precio);
        
        $this->db_close();
        $this->query = "INSERT INTO detalles (id_comprobante, id_producto, cantidad, devolucion, precio) VALUES 
        ('$_id_comprobante','$_id_producto','$_cantidad','$_devolucion','$_precio');";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
    public function read(){}
    public function readOne(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();
        $this->query = "SELECT productos.nombre AS producto, cantidad, devolucion, precio, (cantidad * precio) as total, detalles.id_producto as id_producto FROM detalles INNER JOIN productos ON detalles.id_producto = productos.id_producto WHERE id_comprobante = $_id_comprobante;";
        $this->get_query();
        $this->num_rows = count($this->rows);
        return $this->rows;
    }
    public function readUno($id_comp){
        $this->query = "SELECT productos.nombre AS producto FROM detalles INNER JOIN productos ON detalles.id_producto = productos.id_producto WHERE detalles.id_comprobante = $id_comp;";
        $this->get_query();
        return $this->rows;
    }
    public function readRange($start, $end){}
    public function update(){}
    public function delete(){
        $this->db_open();
        $_id_comprobante = mysqli_real_escape_string($this->connect, $this->id_comprobante);
        $this->db_close();

        $this->query = "DELETE FROM detalles WHERE id_comprobante = '$_id_comprobante';";
        if($this->set_query()){
            return false;
        }else{
            return true;
        }
    }
    public function readLike($nombre, $tipo, $zona){}
}
function precioCantidad($precio, $cantidad){
    return ($precio * $cantidad);
}

?>