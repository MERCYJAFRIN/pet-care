try {
  Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 3 | ForEach-Object {
    Write-Host "✅ Backend is running!"
    Write-Host $_.Content
  }
} catch {
  Write-Host "❌ Backend is not responding: $($_.Exception.Message)"
}
