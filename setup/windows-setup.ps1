# Ghazaal Cloud PC - optional local helper for Windows 10/11.
# This prepares a local project folder only. It does NOT install Windows
# in the cloud, create a VM, or expose this PC to the internet.
[CmdletBinding()]
param(
  [string]$Workspace = (Join-Path $HOME "GhazaalWorkspace")
)
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $Workspace | Out-Null
@"
Welcome to Ghazaal Workspace
Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
This folder is local to this Windows device.
"@ | Set-Content -Path (Join-Path $Workspace "WELCOME.txt") -Encoding UTF8
Write-Host "Workspace ready: $Workspace" -ForegroundColor Green
Write-Host "This helper does not create a cloud PC."
