$project = "C:\Users\diogo\Videos\second brain\Status-Concept"
$cmd = Join-Path $project "dev-server.cmd"
Start-Process -FilePath $cmd -WorkingDirectory $project -WindowStyle Minimized
