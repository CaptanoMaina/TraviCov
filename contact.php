<?php
$username = "root";
$password = "testDatabase";
$database = "Contacts"

// Connect to MySQL server
$connection = mysqli_connect("localhost", $username, $password, $database);

// Check connection
if($connection === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

// Get form data
$name = mysqli_real_escape_string($connection, $_REQUEST['name']);
$email = mysqli_real_escape_string($connection, $_REQUEST['email']);
$message = mysqli_real_escape_string($connection, $_REQUEST['message']);

// Attempt insert query execution
$sql = "INSERT INTO messages (name, email, message) VALUES ('$name', '$email', '$message')";
if(mysqli_query($connection, $sql)){
    echo "Success.";
} else{
    echo "ERROR: " . mysqli_error($connection);
}

// Close connection
mysqli_close($connection);
?>
