# Ghazaal Cloud PC

Ghazaal Cloud PC contains a Windows-inspired browser workspace prototype and a native Windows desktop browser application.

## Projects

- **GitHub Pages prototype:** the browser-based workspace in the repository root.
- **Windows desktop app:** `desktop/GhazaalCloudPC`, a native WPF shell using Microsoft's Edge WebView2 (Chromium) runtime.

## Current GitHub Pages prototype features

- Responsive desktop, taskbar, clock and Start menu.
- Draggable application windows with minimize and restore controls.
- Browser-local File Explorer with nested folders, text editing, search, sorting, Recycle Bin, download and backup export.
- Optional private GitHub repository backup upload/download (user-provided fine-grained token; not automatic live sync).
- Google Account Workspaces launcher for multiple signed-in Google accounts (Gmail, Drive, Docs and YouTube shortcuts by Google account slot).
- Demo Terminal, Browser, Settings and About windows.
- GitHub Pages deployment workflow.
- Windows GitHub Actions runner for temporary project validation.
- Automated HTML, inline JavaScript, UI wiring and project-scope checks.
- Optional local Windows workspace helper.

## Deploy the GitHub Pages prototype

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Merge the website changes into `main` to trigger `.github/workflows/deploy-pages.yml`.
4. The deployed URL appears in the Pages settings and deployment environment.

## Multiple Google accounts in the web prototype

Open **Google Accounts** from the desktop, Start menu or taskbar. First sign in to each Google account using Google's own account chooser in the same browser. Add a workspace label, email and the account slot number shown by Google (0, 1, 2, etc.). Each saved workspace opens Gmail, Drive, Docs or YouTube using that Google account slot.

The launcher stores only the label, email and slot in this browser's local storage. It never requests or stores Google passwords. This is a shortcut manager that uses Google's supported multi-account sign-in in the current browser; it does **not** create isolated Chromium profiles, remote browser sessions, or cloud-persistent Google logins. Your sessions remain in the browser/device where you signed in. To use another device, sign in there as well and add the shortcuts again. Upload files to websites through the website's own upload control and file picker.

## Windows desktop app: embedded Chromium browser

The native app is under `desktop/GhazaalCloudPC` and uses WebView2:

- Real embedded Chromium browser powered by WebView2.
- Multiple tabs in one app window.
- Address bar, search, back, forward, reload and home.
- Links requesting a new window are opened in a new app tab.
- Downloads are directed to the current Windows user's Downloads folder.
- Browser profile/cookies are stored locally at `%LOCALAPPDATA%\GhazaalCloudPC\BrowserProfile`, allowing Google sign-ins to persist on that PC.

### Build locally

Requirements:
- Windows 10 or Windows 11 x64
- .NET 8 SDK
- Microsoft Edge WebView2 Evergreen Runtime

From PowerShell:

```powershell
dotnet publish desktop/GhazaalCloudPC/GhazaalCloudPC.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o publish
```

Run `publish/GhazaalCloudPC.exe`.

### Downloadable builds

The Windows GitHub Actions workflow compiles the app on pull requests and manual runs. A manual workflow run produces a downloadable Actions artifact. Pushing a version tag such as `v0.1.0` triggers a Windows x64 build and attaches a ZIP to a GitHub Release.

## Windows runner: temporary automation only

GitHub Actions uses **temporary hosted Windows runner** machines for build or validation jobs. These are **temporary automation runners**, not a permanent computer. The runner is destroyed after the job; it does not preserve files or sessions between runs. It is **not a remote desktop** and is not an interactive remote desktop service.

## Private GitHub workspace backup

The File Explorer can upload/download one workspace backup file to a **separate private GitHub repository**. This is backup/restore, not continuous real-time synchronization or a live desktop filesystem.

1. Create a new **private** repository, for example `Ghazaal-Cloud-Data`, and select **Add a README file** so the repository has an initial `main` branch. Do not use this public source-code repository for personal files.
2. Create a fine-grained personal access token at https://github.com/settings/personal-access-tokens/new.
3. Set **Resource owner** to your account, **Repository access** to **Only select repositories**, and select only the private data repository.
4. Under **Repository permissions**, grant **Contents: Read and write**. Metadata read is included automatically. Set an expiry; do not create a classic token or grant broad account access.
5. In File Explorer, enter your GitHub username, private repository name and token, then choose **Connect private repo**. Use **Upload to cloud** to replace the remote backup, or **Download from cloud** to replace this browser's workspace.

The token is held in this browser tab's session storage, not in the workspace backup or source code. It is still accessible to scripts running in this page, so only use a trusted device, disconnect when finished, and revoke the token in GitHub settings if it is exposed. You must connect separately on each device/browser. Upload and download are explicit actions; there is no automatic conflict resolution. Keep a separate export before replacing data.

## Honest scope and privacy

The GitHub Pages UI is **not a real cloud desktop**. It does not install or host a persistent Windows 10/11 VM. GitHub Pages hosts the web interface, while GitHub Actions provides temporary automation runners only. File Explorer keeps a local browser copy and offers an optional private GitHub backup. The GitHub backup is **not a live desktop filesystem**, and the demo Terminal does not execute shell commands. Clearing browser data can erase the local copy; use cloud backup/export to protect it.

The native Windows desktop app is also not a hosted cloud Windows machine: the PC running it must be powered on. WebView2 uses the installed Microsoft Edge WebView2 Evergreen Runtime. The .NET app is self-contained, but the browser runtime is a separate Microsoft component. Browser cookies, Google sessions, history and profile data remain on the local PC; they are not synced to GitHub. Do not commit browser profiles, cookies, tokens or personal data. Some websites may block embedding, although normal top-level navigation inside WebView2 is supported.

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
- [x] Optional private GitHub backup upload/download (requires user-created private repository and fine-grained token)
- [x] Google account shortcut workspaces (browser-local; uses Google's own multi-account sign-in)
- [x] Initial native WebView2 desktop browser foundation
- [ ] Full Windows 10-style desktop shell and integrated Google account workspace manager
- [ ] Isolated persistent cloud browser profiles (not provided by GitHub Pages or Actions)
- [ ] Real remote Windows desktop (requires a persistent hosted and licensed VM)

## Open-source components

- [Microsoft WebView2](https://github.com/MicrosoftEdge/WebView2Samples) — browser control and runtime documentation.
- [Microsoft Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) — MIT-licensed icon set intended for desktop shell polish.

Never commit credentials or personal files.
