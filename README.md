# Ghazaal Cloud PC

A Windows-inspired, browser-based workspace prototype built and deployed with GitHub.

## Current v0.1 features
- Responsive desktop, taskbar, clock and Start menu
- Draggable application windows with minimize and restore controls
- Browser-local File Explorer with nested folders, text editing, search, sorting, Recycle Bin, download and backup export
- Optional private GitHub repository backup upload/download (user-provided fine-grained token; not automatic live sync)
- Demo Terminal, Browser, Settings and About windows
- GitHub Pages deployment workflow
- Windows GitHub Actions runner for temporary project validation
- Automated HTML, inline JavaScript, UI wiring and project-scope checks
- Optional local Windows workspace helper

## Deploy
1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Merge the desktop implementation into `main` to trigger `.github/workflows/deploy-pages.yml`.
4. The deployed URL will appear in the Pages settings and deployment environment.

## Windows runner
Run **Actions → Windows Runner Check → Run workflow**. GitHub will start a temporary hosted Windows runner to validate project files. The runner is destroyed after the job; it is not a remote desktop and does not preserve files between runs.

The workflow runs `node scripts/validate-project.mjs` before its Windows environment and temporary-file checks. The validator uses Node.js built-in modules only; it does not install packages or contact external services.

## Private GitHub workspace backup
The File Explorer can upload/download one workspace backup file to a **separate private GitHub repository**. This is backup/restore, not continuous real-time synchronization.

1. Create a new **private** repository, for example `Ghazaal-Cloud-Data`, and select **Add a README file** so the repository has an initial `main` branch. Do not use this public source-code repository for personal files.
2. Create a fine-grained personal access token at https://github.com/settings/personal-access-tokens/new.
3. Set **Resource owner** to your account, **Repository access** to **Only select repositories**, and select only the private data repository.
4. Under **Repository permissions**, grant **Contents: Read and write**. Metadata read is included automatically. Set an expiry; do not create a classic token or grant broad account access.
5. In File Explorer, enter your GitHub username, private repository name and token, then choose **Connect private repo**. Use **Upload to cloud** to replace the remote backup, or **Download from cloud** to replace this browser's workspace.

The token is held in this browser tab's session storage, not in the workspace backup or source code. It is still accessible to scripts running in this page, so only use a trusted device, disconnect when finished, and revoke the token in GitHub settings if it is exposed. You must connect separately on each device/browser. Upload and download are explicit actions; there is no automatic conflict resolution. Keep a separate export before replacing data.

## Honest scope
This repository does not install or host a persistent Windows 11 VM. GitHub Pages hosts the web interface, while GitHub Actions provides temporary automation runners only. File Explorer keeps a local browser copy and offers an optional private GitHub backup. The GitHub backup is not a live desktop filesystem, and the demo Terminal does not execute shell commands. Clearing browser data can erase the local copy; use cloud backup/export to protect it.

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
- [x] Automated static project validation
- [x] Add optional private GitHub backup upload/download (requires user-created private repository and fine-grained token)
- [ ] Real remote Windows desktop (requires a separately hosted and licensed VM)

Never commit credentials or personal files.
