<?php
// db.php - Database Connection Configuration

$isLocal = ($_SERVER['SERVER_NAME'] === 'localhost');

if ($isLocal) {
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', 'Rico10124173');
    define('DB_NAME', 'Jadwalin_Ajah');
} else {
    define('DB_HOST', 'localhost');
    define('DB_USER', 'Rico_2KA19');
    define('DB_PASS', 'Rico123.@!');
    define('DB_NAME', 'Rico_2KA19_DB');
}

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set charset to utf8mb4 (support emoji & special characters)
$conn->set_charset("utf8mb4");

// Helper function untuk fetch data
function fetchData($query, $params = [], $types = '') {
    global $conn;

    if (!empty($params)) {
        $stmt = $conn->prepare($query);
        if (!$stmt) return [];
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }

    if (!$result) return [];

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}
?>
