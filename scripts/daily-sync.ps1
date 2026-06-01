# BankerOS · Daily Git Sync
# Runs once a day via Windows Task Scheduler.
# Stages all changes, commits if anything changed, pushes to origin/main.
# Logs to scripts/sync.log so you can audit what happened.
#
# Manual run: powershell -ExecutionPolicy Bypass -File F:\BankerOS\scripts\daily-sync.ps1

# DO NOT set $ErrorActionPreference = 'Stop'. PowerShell wraps native-command stderr
# as ErrorRecords, which would incorrectly terminate on benign git output like
# "From https://github.com/..." that git writes to stderr by convention.
$ErrorActionPreference = 'Continue'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$LogFile  = Join-Path $PSScriptRoot 'sync.log'

function Log {
    param([string]$Msg)
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Msg
    Add-Content -Path $LogFile -Value $line -Encoding utf8
    Write-Host $line
}

function Invoke-Git {
    # Runs git, captures combined stdout+stderr as a string, returns @{ exitCode; output }.
    # Using cmd.exe redirection keeps PowerShell from wrapping stderr as ErrorRecords.
    # NB: parameter name must not be $Args (PowerShell automatic variable).
    param([string]$GitArgs)
    $output = & cmd.exe /c "git $GitArgs 2>&1"
    return @{ exitCode = $LASTEXITCODE; output = ($output -join "`n") }
}

Set-Location $RepoRoot
Log "=== Daily sync started in $RepoRoot ==="

# Verify git is available
$null = & git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Log "FATAL: git not found in PATH"
    exit 1
}

# Fetch latest from remote (non-fatal if offline — we still try to commit)
$fetch = Invoke-Git 'fetch origin main'
if ($fetch.exitCode -ne 0) {
    Log "WARN: git fetch failed (offline? auth?). Continuing with local-only commit if possible."
    Log "  output: $($fetch.output)"
}

# Detect changes
$statusLines = (& git status --porcelain) -join "`n"
$hasChanges  = -not [string]::IsNullOrWhiteSpace($statusLines)

if (-not $hasChanges) {
    Log "No local changes. Trying pull --rebase only."
    $pull = Invoke-Git 'pull --rebase origin main'
    if ($pull.exitCode -eq 0) {
        Log "Pulled latest from origin/main (no local changes to push)."
    } else {
        Log "WARN: pull --rebase failed: $($pull.output)"
    }
    Log "=== Daily sync finished (no-op) ==="
    exit 0
}

$fileCount = ($statusLines -split "`n").Count
Log "$fileCount changed line(s) detected. Staging..."

$add = Invoke-Git 'add -A'
if ($add.exitCode -ne 0) {
    Log "FATAL: git add -A failed: $($add.output)"
    exit 1
}

# Commit BEFORE rebasing so the working tree is clean when we rebase.
$msg = "chore: daily sync $(Get-Date -Format 'yyyy-MM-dd')"
$commit = Invoke-Git "commit -m `"$msg`""
if ($commit.exitCode -ne 0) {
    if ($commit.output -match 'nothing to commit|nothing added') {
        Log "Nothing to commit (staging produced no diff)."
    } else {
        Log "WARN: commit returned non-zero: $($commit.output)"
    }
} else {
    Log "Committed: $msg"
}

# Now rebase any remote work under our new commit (safe — tree is clean).
$pull = Invoke-Git 'pull --rebase --autostash origin main'
if ($pull.exitCode -ne 0) {
    Log "ERROR: pull --rebase failed. Aborting rebase to leave tree clean."
    Log "  output: $($pull.output)"
    Invoke-Git 'rebase --abort' | Out-Null
    Log "=== Daily sync finished (rebase conflict, manual intervention required) ==="
    exit 1
}

$push = Invoke-Git 'push origin main'
if ($push.exitCode -ne 0) {
    Log "FATAL: push failed: $($push.output)"
    exit 1
}
Log "Push OK -> origin/main"
Log "=== Daily sync finished successfully ==="
exit 0
