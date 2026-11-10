# Architecture

## What this version is
Ghazaal Cloud PC v0.1 is a static desktop-style web workspace hosted by GitHub Pages. It includes a responsive desktop shell, demo app windows, a mock terminal, and an informational panel.

## GitHub-only services
- GitHub repository: source of truth.
- GitHub Pages: serves the static web interface.
- GitHub Actions on `windows-latest`: temporary CI validation runner.
- GitHub Actions on `ubuntu-latest`: static site deployment.

## Important limitations
A GitHub Actions runner is an ephemeral automation machine. It is not a persistent interactive Windows desktop, and the workflow does not provide RDP/VNC/browser streaming. The demo file manager does not upload or persist user files. The demo terminal does not execute shell commands.

A real always-on Windows 11 Cloud PC requires a separately hosted Windows VM, a valid Windows licence/eligible hosting rights, persistent storage, and a secured remote desktop gateway. GitHub alone does not provide those resources.

## Security
Never place passwords, recovery codes, private keys, or personal files in this public repository. Do not add an unauthenticated remote shell or expose RDP to the public internet.
