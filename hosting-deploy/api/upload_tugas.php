<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../env.php';
loadProjectEnvironment();

header('Cache-Control: no-store');

function uploadJsonResponse(array $body, int $status)
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit();
}

function findOrCreateFolder($driveService, string $folderName, string $parentFolderId): string
{
    $escapedName = str_replace(['\\', "'"], ['\\\\', "\\'"], $folderName);
    $escapedParentId = str_replace(['\\', "'"], ['\\\\', "\\'"], $parentFolderId);
    $query = "name = '{$escapedName}' and mimeType = 'application/vnd.google-apps.folder' "
        . "and '{$escapedParentId}' in parents and trashed = false";

    $result = $driveService->files->listFiles([
        'q' => $query,
        'spaces' => 'drive',
        'pageSize' => 1,
        'fields' => 'files(id,name)',
        'supportsAllDrives' => true,
        'includeItemsFromAllDrives' => true,
    ]);
    $folders = $result->getFiles();
    if (count($folders) > 0) {
        return $folders[0]->getId();
    }

    $folder = new Google\Service\Drive\DriveFile([
        'name' => $folderName,
        'mimeType' => 'application/vnd.google-apps.folder',
        'parents' => [$parentFolderId],
    ]);
    $created = $driveService->files->create($folder, [
        'fields' => 'id',
        'supportsAllDrives' => true,
    ]);

    return $created->getId();
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST, OPTIONS');
    uploadJsonResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    uploadJsonResponse(['error' => 'File tugas wajib dipilih'], 422);
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
    uploadJsonResponse(['error' => 'File gagal diterima. Pilih ulang file dan coba lagi.'], 422);
}

$maxFileBytes = 20 * 1024 * 1024;
if ($file['size'] < 1 || $file['size'] > $maxFileBytes) {
    uploadJsonResponse(['error' => 'Ukuran file maksimal 20 MB'], 413);
}

$allowedTypes = [
    'pdf' => ['application/pdf'],
    'doc' => ['application/msword', 'application/octet-stream'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
    'ppt' => ['application/vnd.ms-powerpoint', 'application/octet-stream'],
    'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'],
    'xls' => ['application/vnd.ms-excel', 'application/octet-stream'],
    'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
    'txt' => ['text/plain'],
    'csv' => ['text/plain', 'text/csv', 'application/vnd.ms-excel'],
    'zip' => ['application/zip', 'application/x-zip-compressed'],
    'jpg' => ['image/jpeg'],
    'jpeg' => ['image/jpeg'],
    'png' => ['image/png'],
];
$originalName = basename((string) $file['name']);
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($allowedTypes[$extension]) || !in_array($mimeType, $allowedTypes[$extension], true)) {
    uploadJsonResponse(['error' => 'Format file tidak didukung. Gunakan PDF, Office, TXT, CSV, ZIP, JPG, atau PNG.'], 415);
}

$subjectId = trim((string) ($_POST['subject_id'] ?? ''));
$taskType = trim((string) ($_POST['tipe_tugas'] ?? ''));
$studentId = null;
$groupName = null;

if ($subjectId === '' || !in_array($taskType, ['Individu', 'Kelompok'], true)) {
    uploadJsonResponse(['error' => 'Mata kuliah dan tipe tugas wajib dipilih'], 422);
}

if ($taskType === 'Individu') {
    $studentId = filter_var($_POST['mahasiswa_id'] ?? null, FILTER_VALIDATE_INT);
    if ($studentId === false || $studentId < 1) {
        uploadJsonResponse(['error' => 'Mahasiswa wajib dipilih untuk tugas individu'], 422);
    }
} else {
    $groupName = trim((string) ($_POST['nama_kelompok'] ?? ''));
    $allowedGroups = array_map(static function (int $number): string {
        return 'Kelompok ' . $number;
    }, range(1, 10));
    if (!in_array($groupName, $allowedGroups, true)) {
        uploadJsonResponse(['error' => 'Pilih kelompok yang tersedia'], 422);
    }
}

$oauthClientId = getenv('GOOGLE_OAUTH_CLIENT_ID');
$oauthClientSecret = getenv('GOOGLE_OAUTH_CLIENT_SECRET');
$oauthRefreshToken = getenv('GOOGLE_OAUTH_REFRESH_TOKEN');
$rootFolderId = getenv('ROOT_FOLDER_ID');
if (!$oauthClientId || !$oauthClientSecret || !$oauthRefreshToken || !$rootFolderId) {
    uploadJsonResponse(['error' => 'Konfigurasi Google OAuth belum lengkap. Atur GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, dan ROOT_FOLDER_ID di .env.'], 503);
}

$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
if (!is_file($autoloadPath)) {
    uploadJsonResponse(['error' => 'Google API Client belum terpasang di server'], 503);
}
require_once $autoloadPath;

require_once __DIR__ . '/../db.php';

$scheduleRows = fetchData(
    'SELECT subject FROM Jadwal_Kuliah WHERE subject_id = ? LIMIT 1',
    [$subjectId],
    's'
);
if (!$scheduleRows) {
    uploadJsonResponse(['error' => 'Mata kuliah tidak ditemukan'], 422);
}
$subjectName = trim($scheduleRows[0]['subject']);

$studentName = null;
if ($taskType === 'Individu') {
    $studentRows = fetchData(
        'SELECT name FROM Nama_Mahasiswa WHERE id = ? LIMIT 1',
        [$studentId],
        'i'
    );
    if (!$studentRows) {
        uploadJsonResponse(['error' => 'Mahasiswa tidak ditemukan'], 422);
    }
    $studentName = trim($studentRows[0]['name']);
}

$safeFileName = preg_replace('/[^A-Za-z0-9._ -]/u', '_', $originalName);
$safeFileName = trim($safeFileName, '. ');
if ($safeFileName === '') {
    uploadJsonResponse(['error' => 'Nama file tidak valid'], 422);
}

$driveFileId = null;
try {
    $client = new Google\Client();
    $client->setApplicationName('Jadwalin Ajah Task Upload');
    $client->setClientId($oauthClientId);
    $client->setClientSecret($oauthClientSecret);
    $client->setScopes([Google\Service\Drive::DRIVE]);
    $token = $client->fetchAccessTokenWithRefreshToken($oauthRefreshToken);
    if (isset($token['error'])) {
        throw new RuntimeException('Google OAuth token refresh failed: ' . ($token['error_description'] ?? $token['error']));
    }
    $client->setAccessToken($token);
    $driveService = new Google\Service\Drive($client);

    $subjectFolderId = findOrCreateFolder($driveService, $subjectName, $rootFolderId);
    $typeFolderName = $taskType === 'Individu' ? 'Tugas Individu' : 'Tugas Kelompok';
    $typeFolderId = findOrCreateFolder($driveService, $typeFolderName, $subjectFolderId);
    $submitterFolderName = $taskType === 'Individu' ? $studentName : $groupName;
    $submitterFolderId = findOrCreateFolder($driveService, $submitterFolderName, $typeFolderId);

    $driveFile = new Google\Service\Drive\DriveFile([
        'name' => $safeFileName,
        'parents' => [$submitterFolderId],
    ]);
    $createdFile = $driveService->files->create($driveFile, [
        'data' => file_get_contents($file['tmp_name']),
        'mimeType' => $mimeType,
        'uploadType' => 'multipart',
        'fields' => 'id,webViewLink',
        'supportsAllDrives' => true,
    ]);
    $driveFileId = $createdFile->getId();

    $driveService->permissions->create($driveFileId, new Google\Service\Drive\Permission([
        'type' => 'anyone',
        'role' => 'reader',
    ]), ['supportsAllDrives' => true]);

    $webViewLink = $createdFile->getWebViewLink();
    if (!$webViewLink) {
        $driveDetails = $driveService->files->get($driveFileId, [
            'fields' => 'webViewLink',
            'supportsAllDrives' => true,
        ]);
        $webViewLink = $driveDetails->getWebViewLink();
    }
    if (!$webViewLink) {
        throw new RuntimeException('Google Drive tidak mengembalikan webViewLink');
    }

    $stmt = $conn->prepare(
        'INSERT INTO Pengumpulan_Tugas '
        . '(subject_id, tipe_tugas, mahasiswa_id, nama_kelompok, file_name, file_url, waktu_kumpul) '
        . 'VALUES (?, ?, ?, ?, ?, ?, NOW())'
    );
    $stmt->bind_param('ssisss', $subjectId, $taskType, $studentId, $groupName, $safeFileName, $webViewLink);
    $stmt->execute();

    uploadJsonResponse([
        'message' => 'Tugas berhasil dikumpulkan',
        'file_name' => $safeFileName,
        'file_url' => $webViewLink,
        'waktu_kumpul' => date('Y-m-d H:i:s'),
    ], 201);
} catch (Throwable $error) {
    if ($driveFileId !== null && isset($driveService)) {
        try {
            $driveService->files->delete($driveFileId, ['supportsAllDrives' => true]);
        } catch (Throwable $cleanupError) {
            error_log('Google Drive upload cleanup failed: ' . $cleanupError->getMessage());
        }
    }
    error_log('Task upload failed: ' . $error->getMessage());
    $userMessage = 'Upload gagal diproses. Pastikan Google Drive dapat diakses lalu coba lagi.';
    if ($error instanceof Google\Service\Exception) {
        foreach ($error->getErrors() as $apiError) {
            $reason = $apiError['reason'] ?? '';
            if ($reason === 'accessNotConfigured') {
                $userMessage = 'Google Drive API belum diaktifkan pada Google Cloud project OAuth. Aktifkan Drive API lalu coba lagi.';
                break;
            }
            if ($reason === 'storageQuotaExceeded') {
                $userMessage = 'Kuota penyimpanan Google Drive akun yang terhubung sudah penuh.';
                break;
            }
            if ($reason === 'insufficientFilePermissions' || $reason === 'notFound') {
                $userMessage = 'Akun Google yang terhubung tidak memiliki akses ke ROOT_FOLDER_ID. Pastikan folder dibagikan ke akun tersebut.';
                break;
            }
        }
    }
    uploadJsonResponse(['error' => $userMessage], 500);
}
?>