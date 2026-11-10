# Ghazaal Cloud PC

A Windows 11-inspired browser workspace published with GitHub Pages. Built for quick access from laptops, tablets and phones.

## Included in v0.1

- Responsive desktop shell, taskbar, Start menu, clock and quick settings
- File Explorer demo with browser-local files
- Terminal simulator with basic workspace commands
- Safe browser launch panel
- Offline app-shell caching
- GitHub Pages deployment workflow
- On-demand temporary GitHub-hosted Windows runner for diagnostics

## Important: what this project is not

This is **not** a licensed Windows 11 installation or a persistent cloud computer. GitHub Pages serves static web files. The Windows Actions workflow starts a temporary Windows runner for automation, produces a diagnostic artifact, and then the runner is discarded. It does not expose an interactive desktop or retain a Windows session.

Files created in the File Explorer demo are stored in the current browser's local storage. They do not automatically sync between devices or upload to GitHub.

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Merge the feature branch into `main` after reviewing it.
4. Open **Actions → Deploy Ghazaal Cloud PC** and inspect the validation/deploy run.
5. Your site will be available at `https://azad-ahmad-ghazaal.github.io/Ghazaal-Cloud-PC/` after Pages is enabled and deployment succeeds.

## Run the temporary Windows diagnostic

1. Open the repository's **Actions** tab.
2. Select **Windows Runner (Temporary)**.
3. Choose **Run workflow** and select a task.
4. When the job finishes, download the `ghazaal-windows-runner-report` artifact.

GitHub-hosted runner availability and usage limits depend on the account and repository plan.

## Development

No build step is required. The app uses plain HTML, CSS and JavaScript.

## Privacy and safety

- No passwords, tokens or secrets are requested by this app.
- Do not put credentials in repository files.
- Browser demo files stay in that browser's local storage.
- Keep the repository free of personal or sensitive data.

## Roadmap

- v0.1: browser desktop shell and temporary Windows diagnostics
- v0.2: optional account-backed file sync (requires a secure backend)
- v0.3: evaluate a real remote-desktop host separately if the project requirements change