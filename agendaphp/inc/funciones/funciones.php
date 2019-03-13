<?php 

function obtenerContactos(){
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contactos, nombre, empresa, telefono FROM contactos");
    } catch (Exeption $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }
}

function obtenerContacto($id){
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contactos, nombre, empresa, telefono FROM contactos WHERE id_contactos = $id");
    } catch (Exeption $e) {
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }
}
?>