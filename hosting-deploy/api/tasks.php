<?php
require_once '../api/cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
	$data = fetchData(
		"SELECT Tugas.*, Jadwal_Kuliah.subject AS subject_name
		FROM Tugas
		JOIN Jadwal_Kuliah ON Tugas.subject_id = Jadwal_Kuliah.subject_id
		ORDER BY Tugas.created_at DESC"
	);

	echo json_encode($data);
	exit();
}

if (!in_array($method, ['POST', 'PUT'], true)) {
	header('Allow: GET, POST, PUT, OPTIONS');
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
	exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
	http_response_code(400);
	echo json_encode(['error' => 'Request body must be valid JSON']);
	exit();
}

$subjectId = trim((string) ($input['subject_id'] ?? ''));
$deadline = trim((string) ($input['deadline'] ?? ''));
$note = trim((string) ($input['note'] ?? ''));

if ($subjectId === '' || $deadline === '' || $note === '') {
	http_response_code(422);
	echo json_encode(['error' => 'subject_id, deadline, and note are required']);
	exit();
}

if (empty(fetchData(
	'SELECT subject_id FROM Jadwal_Kuliah WHERE subject_id = ?',
	[$subjectId],
	's'
))) {
	http_response_code(422);
	echo json_encode(['error' => 'subject_id does not match a schedule']);
	exit();
}

if ($method === 'POST') {
	$stmt = $conn->prepare(
		'INSERT INTO Tugas (subject_id, deadline, note) VALUES (?, ?, ?)'
	);
	$stmt->bind_param('sss', $subjectId, $deadline, $note);
	$stmt->execute();

	http_response_code(201);
	echo json_encode(['id' => $conn->insert_id]);
	exit();
}

$taskId = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
if ($taskId === false || $taskId < 1) {
	http_response_code(422);
	echo json_encode(['error' => 'A valid task id is required']);
	exit();
}

if (empty(fetchData('SELECT id FROM Tugas WHERE id = ?', [$taskId], 'i'))) {
	http_response_code(404);
	echo json_encode(['error' => 'Task not found']);
	exit();
}

$stmt = $conn->prepare(
	'UPDATE Tugas SET subject_id = ?, deadline = ?, note = ? WHERE id = ?'
);
$stmt->bind_param('sssi', $subjectId, $deadline, $note, $taskId);
$stmt->execute();

echo json_encode(['id' => $taskId]);
?>
