# Containerized Ghazaal Cloud PC

This is a provider-neutral deployment option for a **persistent Linux desktop**. It can run on an ARM64 or x86-64 Linux VM that supports Docker Compose. It does not create a cloud VM or provide free compute by itself.

The desktop is powered by the LinuxServer.io Webtop Ubuntu XFCE image. The container keeps its desktop configuration and browser profile in the persistent `./webtop-config` directory.

## What this provides

- XFCE desktop with a browser, delivered through a normal web browser.
- Persistent desktop configuration and browser data in `webtop-config/`.
- A local-only host port (`127.0.0.1:3000`), not a public internet listener.
- A login password supplied locally through an ignored `.env` file.
- Docker Compose restart policy so the container starts again after a host reboot.

This is a Linux desktop with an XFCE interface, not a licensed Windows 10/11 VM. A VM or server must still be supplied by a hosting provider and may incur charges.

## Requirements

- Ubuntu Server 22.04 or 24.04 on ARM64 or x86-64.
- Docker Engine and the Docker Compose plugin.
- A persistent disk with enough free space for the desktop profile and downloaded files.
- Tailscale installed on the host if private remote access is desired.

## Deploy

Run these commands on the Linux cloud host from a checkout of this repository:

```bash
cp .env.example .env
nano .env
```

Change `WEBTOP_USER` and replace `WEBTOP_PASSWORD` with a long, unique password. Keep the real `.env` file private; it is ignored by Git. Then start the desktop:

```bash
docker compose up -d
docker compose ps
docker compose logs --tail=100 webtop
```

The service listens only on the host loopback interface at `http://127.0.0.1:3000`. Do not change the port binding to `0.0.0.0` or expose port 3000 directly to the public internet.

## Private access with Tailscale Serve

Install and authenticate Tailscale on the host using its official instructions. Then publish the local Webtop service only to the authenticated tailnet:

```bash
sudo tailscale serve --bg http://127.0.0.1:3000
sudo tailscale serve status
```

Use the HTTPS address shown by `tailscale serve status` from a device signed in to the same tailnet. Do not use Funnel or a public reverse proxy for this private desktop. Tailscale must be installed and signed in on each client device.

## Persistence and backups

- Do not delete `webtop-config/`; it contains the desktop profile, browser state, and user files.
- Back up `webtop-config/` to a separate private location before upgrades or migration.
- Never upload `.env`, browser profiles, cookies, downloads, SSH keys, or personal files to GitHub.
- The container restart policy does not protect against VM deletion, disk failure, or provider reclamation.

## Stop and update

```bash
docker compose down
docker compose pull
docker compose up -d
```

`docker compose down` leaves the bind-mounted `webtop-config/` directory in place. Do not add `--volumes` when stopping the service.

## Upstream references

- LinuxServer Webtop: https://docs.linuxserver.io/images/docker-webtop/
- Docker Compose: https://docs.docker.com/compose/
- Tailscale Serve: https://tailscale.com/docs/features/tailscale-serve
