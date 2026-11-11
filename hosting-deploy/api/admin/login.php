<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../db.php';

header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST, OPTIONS');
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim((string) ($input['username'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Username dan password wajib diisi']);
    exit();
}

$stmt = $conn->prepare(
    'SELECT id, username, password, name FROM admins WHERE username = ? LIMIT 1'
);
$stmt->bind_param('s', $username);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

if (!$admin || !password_verify($password, $admin['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Username atau password salah']);
    exit();
}

$jwtSecret = getenv('JWT_SECRET');
if ($jwtSecret === false || strlen($jwtSecret) < 32) {
    http_response_code(500);
    echo json_encode(['error' => 'JWT_SECRET belum dikonfigurasi dengan aman']);
    exit();
}

$base64UrlEncode = static function (string $value): string {
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
};

$issuedAt = time();
$header = $base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
$payload = $base64UrlEncode(json_encode([
    'sub' => (string) $admin['id'],
    'username' => $admin['username'],
    'name' => $admin['name'],
    'iat' => $issuedAt,
    'exp' => $issuedAt + 28800,
]));
$signature = $base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $jwtSecret, true));

echo json_encode([
    'token' => $header . '.' . $payload . '.' . $signature,
    'admin' => [
        'id' => (int) $admin['id'],
        'username' => $admin['username'],
        'name' => $admin['name'],
    ],
]);
?>