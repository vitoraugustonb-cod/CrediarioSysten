# Script de Backup Automatico do Banco de Dados PostgreSQL (Supabase)
# Salva um snapshot completo em arquivo .sql com data e hora

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackupsDir = Join-Path $ProjectRoot "backups"

if (!(Test-Path $BackupsDir)) {
    New-Item -ItemType Directory -Path $BackupsDir -Force | Out-Null
}

# Ler arquivo .env do backend
$EnvPath = Join-Path $ProjectRoot "backend\.env"
if (!(Test-Path $EnvPath)) {
    Write-Error "Arquivo backend/.env nao encontrado!"
    exit 1
}

$DatabaseUrl = ""
Get-Content $EnvPath | ForEach-Object {
    if ($_ -match '^\s*DIRECT_URL\s*=\s*"(.*)"\s*$') {
        $DatabaseUrl = $matches[1]
    } elseif ($_ -match '^\s*DATABASE_URL\s*=\s*"(.*)"\s*$' -and [string]::IsNullOrEmpty($DatabaseUrl)) {
        $DatabaseUrl = $matches[1]
    }
}

if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Error "DIRECT_URL ou DATABASE_URL nao encontrada no arquivo .env!"
    exit 1
}

# Se for pgbouncer (porta 6543), ajusta para a porta direta de sessao 5432 necessaria para pg_dump
$DumpUrl = $DatabaseUrl -replace ':6543/', ':5432/' -replace '\?pgbouncer=true', ''
if (!($DumpUrl -match 'sslmode=')) {
    if ($DumpUrl -match '\?') {
        $DumpUrl += "&sslmode=require"
    } else {
        $DumpUrl += "?sslmode=require"
    }
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFileName = "backup_crediario_$Timestamp.sql"
$BackupFilePathLocal = Join-Path $BackupsDir $BackupFileName

Write-Host ">>> Iniciando backup completo do banco de dados..." -ForegroundColor Cyan
Write-Host ">>> Data/Hora: $Timestamp" -ForegroundColor Gray

# Executa pg_dump usando o container isolado do Postgres 17
docker run --rm -v "${BackupsDir}:/backups" postgres:17-alpine pg_dump "$DumpUrl" --schema=public -f "/backups/$BackupFileName"

if (Test-Path $BackupFilePathLocal) {
    $FileSize = (Get-Item $BackupFilePathLocal).Length / 1KB
    Write-Host ""
    Write-Host "[SUCESSO] BACKUP GERADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "Arquivo: $BackupFileName ($([math]::Round($FileSize, 2)) KB)" -ForegroundColor Yellow
    Write-Host "Local: $BackupFilePathLocal" -ForegroundColor Gray
} else {
    Write-Error "Falha: O arquivo de backup nao foi encontrado apos a execucao."
}
