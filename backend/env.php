<?php
function loadProjectEnvironment(): void
{
    $envFile = dirname(__DIR__) . '/.env';
    if (!is_file($envFile)) {
        return;
    }

    $envValues = parse_ini_file($envFile, false, INI_SCANNER_RAW);
    foreach ($envValues ?: [] as $key => $value) {
        if (getenv($key) === false) {
            putenv($key . '=' . $value);
        }
    }
}
?>