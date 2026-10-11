# Script de Restauracao de Backup do Banco de Dados PostgreSQL
# Permite restaurar um arquivo .sql em qualquer banco (Supabase, Neon, Render ou Local)

param (
    [Parameter(Mandatory=$true)]
    [string]$ArquivoBackup,

    [Parameter(Mandatory=$false)]
    [string]$DestinoUrl
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $ArquivoBackup)) {
    Write-Error "Arquivo de backup nao encontrado: $ArquivoBackup"
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

if ([string]::IsNullOrEmpty($DestinoUrl)) {
    $EnvPath = Join-Path $ProjectRoot "backend\.env"
    if (Test-Path $EnvPath) {
        Get-Content $EnvPath | ForEach-Object {
            if ($_ -match '^\s*DIRECT_URL\s*=\s*"(.*)"\s*$') {
                $DestinoUrl = $matches[1]
            } elseif ($_ -match '^\s*DATABASE_URL\s*=\s*"(.*)"\s*$' -and [string]::IsNullOrEmpty($DestinoUrl)) {
                $DestinoUrl = $matches[1]
            }
        }
    }
}

if ([string]::IsNullOrEmpty($DestinoUrl)) {
    Write-Error "Informe a URL de conexao do banco de destino com o parametro -DestinoUrl"
    exit 1
}

# Ajusta porta pgbouncer se necessario
$RestoreUrl = $DestinoUrl -replace ':6543/', ':5432/' -replace '\?pgbouncer=true', ''
if (!($RestoreUrl -match 'sslmode=')) {
    if ($RestoreUrl -match '\?') {
        $RestoreUrl += "&sslmode=require"
    } else {
        $RestoreUrl += "?sslmode=require"
    }
}

$AbsBackupPath = (Resolve-Path $ArquivoBackup).Path
$BackupDir = Split-Path -Parent $AbsBackupPath
$BackupFile = Split-Path -Leaf $AbsBackupPath

Write-Host ">>> Iniciando restauracao do backup para o banco..." -ForegroundColor Cyan
Write-Host ">>> Arquivo: $BackupFile" -ForegroundColor Yellow

# Executa o restore via psql no container Postgres 17
docker run --rm -v "${BackupDir}:/backup" postgres:17-alpine psql "$RestoreUrl" -f "/backup/$BackupFile"

Write-Host ""
Write-Host "[SUCESSO] RESTAURACAO CONCLUIDA COM SUCESSO!" -ForegroundColor Green
