$ErrorActionPreference = 'Continue'

$ports = @(3000, 3001, 3002)

function Kill-Port($port) {
  $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
  if (-not $conns) {
    Write-Host ("[ok] No listener on {0}" -f $port)
    return
  }

  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    if (-not $pid) { continue }
    try {
      $proc = Get-Process -Id $pid -ErrorAction Stop
      $name = $proc.ProcessName

      # Only terminate node-like dev processes by default.
      if ($name -notin @('node', 'node64', 'next-server', 'npm', 'pnpm', 'yarn')) {
        Write-Host ("[skip] Port {0} held by PID {1} ({2}) — not killing (not node-like)." -f $port, $pid, $name)
        continue
      }

      Write-Host ("[kill] Port {0} listener PID {1} ({2})" -f $port, $pid, $name)
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    } catch {
      Write-Host ("[warn] Couldn't inspect/kill PID {0} on port {1}: {2}" -f $pid, $port, $_.Exception.Message)
    }
  }
}

foreach ($p in $ports) { Kill-Port $p }
