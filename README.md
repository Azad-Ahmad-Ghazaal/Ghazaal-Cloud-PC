# Ghazaal Cloud PC

A Windows-inspired, browser-based workspace prototype built and deployed with GitHub.

## Current v0.1 features
- Responsive desktop, taskbar, clock and Start menu
- Demo File Explorer, Terminal, Browser, Settings and About windows
- GitHub Pages deployment workflow
- Windows GitHub Actions runner for temporary project validation
- Optional local Windows workspace helper

## Deploy
1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Merge the desktop implementation into `main` to trigger `.github/workflows/deploy-pages.yml`.
4. The deployed URL will appear in the Pages settings and deployment environment.

## Windows runner
Run **Actions → Windows Runner Check → Run workflow**. GitHub will start a temporary hosted Windows runner to validate project files. The runner is destroyed after the job; it is not a remote desktop and does not preserve files between runs.

## Honest scope
This repository does not install or host a persistent Windows 11 VM. GitHub Pages hosts the web interface, while GitHub Actions provides temporary automation runners only. The desktop apps and file manager are prototypes; no real cloud storage or shell execution is configured.

## Local helper
On Windows PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup\windows-setup.ps1
```
This only creates a local `GhazaalWorkspace` folder.

## Roadmap
- [x] Desktop UI prototype
- [x] GitHub Pages workflow
- [x] Windows CI runner workflow
- [ ] Add authenticated, persistent file storage (requires a storage service)
- [ ] Real remote Windows desktop (requires a separately hosted and licensed VM)

Never commit credentials or personal files.
