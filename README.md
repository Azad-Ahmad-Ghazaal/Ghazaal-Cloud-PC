# Ghazaal Cloud PC — Windows Desktop App

This repository now contains two related projects:

- **GitHub Pages prototype:** the browser-based workspace in the repository root.
- **Windows desktop app:** `desktop/GhazaalCloudPC`, a native WPF shell using Microsoft's Edge WebView2 (Chromium) runtime.

## Build locally

Requirements:
- Windows 10 or Windows 11 x64
- .NET 8 SDK
- Microsoft Edge WebView2 Evergreen Runtime

From PowerShell:

```powershell
dotnet publish desktop/GhazaalCloudPC/GhazaalCloudPC.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o publish
```

Run `publish/GhazaalCloudPC.exe`.

## Browser features in this first desktop foundation

- Real embedded Chromium browser powered by WebView2.
- Multiple tabs in one app window.
- Address bar, search, back, forward, reload and home.
- Links requesting a new window are opened in a new app tab.
- Downloads are directed to the current Windows user's Downloads folder.
- Browser profile/cookies are stored locally at `%LOCALAPPDATA%\GhazaalCloudPC\BrowserProfile`, allowing Google sign-ins to persist on that PC.

## Downloadable builds

Pushing a version tag such as `v0.1.0` triggers the Windows x64 build workflow and attaches a ZIP to a GitHub Release. A manual workflow run also produces a downloadable Actions artifact.

## Important limitations and privacy

- This is a Windows desktop application, not a hosted cloud Windows machine. The PC running it must be powered on.
- WebView2 uses the installed Microsoft Edge WebView2 Evergreen Runtime. The .NET app is self-contained, but the browser runtime is a separate Microsoft component.
- Browser cookies, Google sessions, history and profile data remain on the local PC. They are not synced to GitHub.
- Do not commit browser profiles, cookies, tokens or personal data.
- Some websites may block embedding, but normal top-level navigation inside WebView2 is supported.

## Open-source components

- [Microsoft WebView2](https://github.com/MicrosoftEdge/WebView2Samples) — browser control and runtime documentation.
- [Microsoft Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) — MIT-licensed icon set intended for the upcoming desktop shell polish.
