<?php
require_once __DIR__ . '/../../env.php';
loadProjectEnvironment();

function adminAuthError(string $message, int $status)
{
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit();
}

function decodeAdminJwtPart(string $part)
{
    $base64 = strtr($part, '-_', '+/');
    $base64 .= str_repeat('=', (4 - strlen($base64) % 4) % 4);
    return base64_decode($base64, true);
}

function verifyAdminRequest(): void
{
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($authorization === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
        adminAuthError('Unauthorized', 401);
    }

    $parts = explode('.', $matches[1]);
    if (count($parts) !== 3) {
        adminAuthError('Unauthorized', 401);
    }

    $jwtSecret = getenv('JWT_SECRET');
    if ($jwtSecret === false || strlen($jwtSecret) < 32) {
        adminAuthError('JWT_SECRET is not configured', 500);
    }

    $headerJson = decodeAdminJwtPart($parts[0]);
    $payloadJson = decodeAdminJwtPart($parts[1]);
    $signature = decodeAdminJwtPart($parts[2]);
    if ($headerJson === false || $payloadJson === false || $signature === false) {
        adminAuthError('Unauthorized', 401);
    }

    $header = json_decode($headerJson, true);
    $payload = json_decode($payloadJson, true);
    if (!is_array($header) || ($header['alg'] ?? null) !== 'HS256' || !is_array($payload)) {
        adminAuthError('Unauthorized', 401);
    }

    $expectedSignature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], $jwtSecret, true);
    if (!hash_equals($expectedSignature, $signature)
        || !isset($payload['sub'], $payload['exp'])
        || (int) $payload['exp'] <= time()) {
        adminAuthError('Unauthorized', 401);
    }
}
?>