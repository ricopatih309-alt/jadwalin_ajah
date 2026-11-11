<?php
function adminJsonResponse($data, int $status = 200)
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function adminReadInput(): array
{
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        adminJsonResponse(['error' => 'Request body must be valid JSON'], 400);
    }
    return $input;
}

function adminCrud(mysqli $conn, array $config)
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    try {
        if ($method === 'GET') {
            $sql = 'SELECT ' . $config['select'] . ' FROM ' . $config['from'];
            $params = [];
            $types = '';

            if (!empty($config['filterSubject']) && isset($_GET['subject_id']) && $_GET['subject_id'] !== '') {
                $sql .= ' WHERE ' . $config['table'] . '.subject_id = ?';
                $params[] = (string) $_GET['subject_id'];
                $types = 's';
            }
            if (!empty($config['orderBy'])) {
                $sql .= ' ORDER BY ' . $config['orderBy'];
            }

            if ($params) {
                $stmt = $conn->prepare($sql);
                $stmt->bind_param($types, ...$params);
                $stmt->execute();
                $result = $stmt->get_result();
            } else {
                $result = $conn->query($sql);
            }

            adminJsonResponse($result->fetch_all(MYSQLI_ASSOC));
        }

        if (!in_array($method, ['POST', 'PUT', 'DELETE'], true)) {
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            adminJsonResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $method === 'DELETE' && isset($_GET['id'])
            ? ['id' => $_GET['id']]
            : adminReadInput();

        if ($method === 'DELETE') {
            $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
            if ($id === false || $id < 1) {
                adminJsonResponse(['error' => 'A valid id is required'], 422);
            }

            $stmt = $conn->prepare('DELETE FROM ' . $config['table'] . ' WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            if ($stmt->affected_rows === 0) {
                adminJsonResponse(['error' => 'Record not found'], 404);
            }
            adminJsonResponse(['id' => (int) $id, 'deleted' => true]);
        }

        $allowedKeys = array_merge(array_keys($config['fields']), ['id']);
        $unknownKeys = array_diff(array_keys($input), $allowedKeys);
        if ($unknownKeys) {
            adminJsonResponse(['error' => 'Unknown field: ' . reset($unknownKeys)], 422);
        }

        $values = [];
        $types = '';
        foreach ($config['fields'] as $field => $fieldConfig) {
            if (!array_key_exists($field, $input)) {
                if (!empty($fieldConfig['required'])) {
                    adminJsonResponse(['error' => $field . ' is required'], 422);
                }
                continue;
            }

            $value = $input[$field];
            if (is_array($value) || is_object($value) || $value === null) {
                adminJsonResponse(['error' => $field . ' is invalid'], 422);
            }

            if (($fieldConfig['type'] ?? 'string') === 'int') {
                $value = filter_var($value, FILTER_VALIDATE_INT);
                if ($value === false) {
                    adminJsonResponse(['error' => $field . ' must be an integer'], 422);
                }
                $types .= 'i';
            } else {
                $value = trim((string) $value);
                if (!empty($fieldConfig['required']) && $value === '') {
                    adminJsonResponse(['error' => $field . ' is required'], 422);
                }
                if (!empty($fieldConfig['enum']) && !in_array($value, $fieldConfig['enum'], true)) {
                    adminJsonResponse(['error' => $field . ' has an invalid value'], 422);
                }
                $types .= 's';
            }

            $values[$field] = $value;
        }

        if (!empty($config['subjectForeignKey'])) {
            $subjectId = $values['subject_id'] ?? '';
            $subjectStmt = $conn->prepare('SELECT subject_id FROM Jadwal_Kuliah WHERE subject_id = ? LIMIT 1');
            $subjectStmt->bind_param('s', $subjectId);
            $subjectStmt->execute();
            if (!$subjectStmt->get_result()->fetch_assoc()) {
                adminJsonResponse(['error' => 'subject_id does not match a schedule'], 422);
            }
        }

        if ($method === 'POST') {
            $fieldNames = array_keys($values);
            $placeholders = implode(', ', array_fill(0, count($fieldNames), '?'));
            $stmt = $conn->prepare(
                'INSERT INTO ' . $config['table'] . ' (' . implode(', ', $fieldNames) . ') VALUES (' . $placeholders . ')'
            );
            $valueList = array_values($values);
            $stmt->bind_param($types, ...$valueList);
            $stmt->execute();
            adminJsonResponse(['id' => $conn->insert_id], 201);
        }

        $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id < 1) {
            adminJsonResponse(['error' => 'A valid id is required'], 422);
        }

        $existsStmt = $conn->prepare('SELECT id FROM ' . $config['table'] . ' WHERE id = ? LIMIT 1');
        $existsStmt->bind_param('i', $id);
        $existsStmt->execute();
        if (!$existsStmt->get_result()->fetch_assoc()) {
            adminJsonResponse(['error' => 'Record not found'], 404);
        }

        $assignments = implode(', ', array_map(static fn(string $field): string => $field . ' = ?', array_keys($values)));
        $stmt = $conn->prepare('UPDATE ' . $config['table'] . ' SET ' . $assignments . ' WHERE id = ?');
        $valueList = array_values($values);
        $valueList[] = $id;
        $stmt->bind_param($types . 'i', ...$valueList);
        $stmt->execute();
        adminJsonResponse(['id' => (int) $id, 'updated' => true]);
    } catch (mysqli_sql_exception $error) {
        $status = in_array($error->getCode(), [1062, 1451, 1452], true) ? 409 : 500;
        $message = $status === 409
            ? 'Perubahan bertentangan dengan data yang sudah ada atau relasi database.'
            : 'Database request failed.';
        adminJsonResponse(['error' => $message], $status);
    }
}
?>