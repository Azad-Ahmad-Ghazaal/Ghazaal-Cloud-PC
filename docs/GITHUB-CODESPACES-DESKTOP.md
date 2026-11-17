# GitHub Codespaces desktop (free-quota proof of concept)

This repository includes an optional XFCE + Chromium desktop for GitHub Codespaces. It is intended as a no-card, GitHub-native trial path while a separately hosted persistent VM is unavailable.

## What it is

- A Debian-based XFCE desktop with Chromium.
- Accessed through noVNC on forwarded port 6080.
- Port 6080 is configured as **private**. Keep it private; do not change it to public.
- Chromium's profile is stored in `/workspaces/.ghazaal-chromium-profile`, outside tracked repository files, so browser sessions can persist when the same Codespace is stopped and resumed.
- The Codespace can be stopped when not in use.

## Create it

1. Open this repository on GitHub and select the `feat/containerized-cloud-desktop` branch.
2. Select **Code → Codespaces → Create codespace on feat/containerized-cloud-desktop**.
3. Wait for the dev container to build. The startup script launches XFCE, Chromium, and noVNC.
4. In the Codespaces **Ports** tab, open port **6080**. Confirm its visibility is **Private**.
5. Sign in to websites inside Chromium. Do not share the forwarded URL or Codespace with anyone.

If the desktop does not open automatically, use the forwarded 6080 port from the Ports tab. The noVNC page may need its **Connect** button.

## Included free quota and limits

GitHub's current documentation lists a personal Free account allowance of **120 Codespaces core-hours and 15 GB-month storage**. On a 2-core machine, 120 core-hours is up to 60 hours of active runtime, before other usage and storage constraints. Codespaces stop after the idle timeout (30 minutes by default). This is not an always-on or 24/7 cloud PC.

GitHub says personal accounts can start using included Codespaces quota without providing payment details. If the included quota is exhausted and there is no payment method, Codespaces usage is blocked until the quota renews. This setup does not add a payment method or enable paid usage.

Check current usage and limits in GitHub Settings → Billing and licensing → Usage. Do not add a payment method for this experiment.

## Persistence and security notes

- Stop and resume the same Codespace to preserve its workspace and browser profile. Deleting the Codespace deletes its local workspace data.
- Do not use **Rebuild Container** or delete the Codespace unless you have backed up important files and understand the data impact.
- Browser cookies and signed-in sessions are sensitive. Anyone with access to the Codespace/workspace may be able to access them.
- The VNC server has no separate password because the forwarded port is configured private and Codespaces authentication gates access. Never make port 6080 public.
- This is a proof of concept, not a hardened production desktop. Do not store highly sensitive data or credentials here.
- GitHub Codespaces is an interactive development environment, not a general-purpose always-on hosting service. It may stop automatically and has monthly usage limits.

## Official GitHub documentation

- [Creating a codespace for a repository](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository)
- [GitHub Codespaces billing and included quota](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces)
- [Getting the most out of included usage](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage)
