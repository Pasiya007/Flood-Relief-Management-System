<?php
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "flood_relief_management_db"; 
$conn = null;

try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
} catch (mysqli_sql_exception $e) {
    
    die(json_encode(["success" => false, "message" => "Connection failed."]));
}
?>