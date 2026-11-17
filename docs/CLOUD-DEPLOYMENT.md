# Ghazaal Cloud PC — Persistent Cloud Desktop Plan

## Goal

Provide a persistent, browser-accessible desktop that remains online when the owner's Lenovo T470 is powered off. The desktop must be reachable from a phone or another computer, keep browser profiles and files on the cloud VM, and avoid putting personal data or credentials in GitHub.

## Reality check

- GitHub Pages is static web hosting; it cannot run a desktop session.
- GitHub-hosted Actions runners are temporary build machines and are destroyed after each job.
- A real always-on desktop requires a separate persistent VM and storage.
- A free tier is not an uptime guarantee. Providers can impose capacity limits, idle-resource reclamation, identity/payment verification, or change their terms.
- A free Windows VM with a valid Windows desktop licence is not assumed. The proposed free-first target is a Linux desktop with a Windows-inspired XFCE layout. A genuine hosted Windows desktop may require paid compute and licensing.

## Proposed free-first stack

| Layer | Choice | Purpose |
|---|---|---|
| Compute | Oracle Cloud Infrastructure Always Free, if eligible capacity is available | Persistent ARM64 Ubuntu VM |
| Operating system | Ubuntu Server ARM64 | Low-overhead base |
| Desktop | XFCE | Lightweight graphical desktop |
| Browser | Chromium | Web browsing and Google sign-in |
| Remote display | TigerVNC + noVNC/websockify | Desktop in a normal mobile/desktop browser |
| Private access | Tailscale Personal + Tailscale Serve | HTTPS access limited to approved tailnet devices |
| Storage | VM boot/block volume | Persistent home directory, browser profile and user files |
| Source/build | This GitHub repository + GitHub Actions | Versioned scripts and repeatable deployment; not the host |

### Oracle Always Free constraints

The current official OCI documentation describes Always Free compute as up to 2 OCPUs and 12 GB RAM total for Ampere A1, plus up to 200 GB combined block-volume storage and 10 TB/month outbound transfer. Capacity can be unavailable in a home region. OCI may reclaim idle compute instances when its documented CPU, network and (for A1) memory thresholds remain below 20% over a 7-day period. Therefore this is a best-effort free host, not guaranteed 24/7 service.

Official references:
- https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- https://docs.oracle.com/iaas/Content/FreeTier/freetier.htm

## Access and security design

1. Keep the VNC server bound to loopback only; never expose TCP 5901 directly to the public internet.
2. Run noVNC/websockify on loopback only (for example, 127.0.0.1:6081).
3. Use Tailscale Serve to expose that local web service only inside the private tailnet, with HTTPS enabled.
4. Install Tailscale on each device that should access the desktop and authenticate those devices to the owner's personal tailnet.
5. Keep SSH restricted to initial provisioning and administration. Use SSH keys; never commit keys, auth tokens, passwords, VNC credentials, browser profiles, or personal files.
6. Use a non-root desktop user. Keep the VM patched and enable a host firewall.
7. Store browser cookies, Google sessions and downloads only on the VM's persistent home/volume. Do not sync them to the public source repository or GitHub Actions artifacts.
8. Add backups before storing important files. A VM disk is persistent storage, not a backup.

Official references:
- https://tailscale.com/pricing
- https://tailscale.com/docs/features/tailscale-serve
- https://novnc.com/noVNC/

## Deployment phases

### Phase 0 — account and eligibility (owner action required)
- Create or sign in to one legitimate OCI account; do not create duplicate accounts.
- Complete any identity/payment verification Oracle requires. Never share card details, passwords, recovery codes, or MFA codes in chat.
- Select a home region and confirm an Always Free eligible ARM64 Ubuntu image and A1 capacity are available.
- Do not enable paid resources or accept a paid upgrade just to get capacity.

### Phase 1 — provision one VM
- Create one Ubuntu ARM64 A1 VM using only the Always Free eligible shape and limits shown in the OCI console.
- Use a strong SSH public key.
- Keep the default 50 GB boot volume initially; confirm the console labels the resources Always Free before creating them.
- Do not add paid public IP, block volume, load balancer, or other chargeable resources.

### Phase 2 — install desktop stack
- Install XFCE, Chromium, TigerVNC, noVNC/websockify, and Tailscale from their trusted upstream repositories/packages.
- Configure a dedicated unprivileged desktop user.
- Configure the VNC session and noVNC proxy to listen on loopback only.
- Enable Tailscale and publish the noVNC port using private Tailscale Serve.
- Verify access from a second device before adding personal data.

### Phase 3 — user workspace
- Create a Windows-inspired XFCE panel, application launcher, file manager and desktop shortcuts.
- Keep one Chromium profile per Google account only if the browser's profile isolation is configured and tested.
- Confirm uploads/downloads use the cloud VM's persistent folders.
- Add backup/restore and storage-usage indicators.

### Phase 4 — reliability and hardening
- Configure unattended security updates, service restart policies, disk-space monitoring and backup/export.
- Test reboot persistence, browser session persistence, mobile touch controls and reconnect after network loss.
- Document Oracle idle-reclamation risk and provide a manual recovery/migration procedure.

## Known limitations

- Tailscale private access means Tailscale must be installed and signed in on each client device. This is safer than exposing a remote desktop login publicly.
- noVNC works in modern mobile and desktop browsers, but a full desktop is less comfortable on a small phone screen.
- ARM64 compatibility must be checked for every package and browser extension.
- OCI free capacity and account eligibility are not guaranteed. Idle instances may be reclaimed.
- This design is a Linux cloud desktop with a Windows-inspired interface, not a licensed Windows 10/11 VM.

## Current repository status

- The existing GitHub Pages prototype remains a separate front-end demo.
- PR #16 adds a local Windows WebView2 browser only; it is not the cloud host and is intentionally not merged as part of this cloud deployment plan.
- This document is a plan only. No OCI resources have been created and no paid service has been enabled.
