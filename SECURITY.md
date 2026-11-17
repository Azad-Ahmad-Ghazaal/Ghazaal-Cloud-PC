# Security policy

## Supported deployment posture

- Keep Webtop bound to `127.0.0.1:3000`; do not publish the desktop directly to the public internet.
- Use private tailnet access (Tailscale Serve) and protect the host account with strong authentication.
- Keep `.env`, browser profiles, cookies, downloads, SSH keys, and user data out of Git.
- Keep the host, Docker Engine, Compose plugin, and Webtop image updated.
- Back up the persistent `webtop-config/` directory to a separate private location.

## Vulnerability scanning

The `Audit Webtop container image` workflow scans the configured image for known HIGH and CRITICAL vulnerabilities using Trivy. It uploads a machine-readable JSON report as a GitHub Actions artifact for 30 days.

The scan is report-only at present: a successful workflow means the scan completed and the report was uploaded. It does **not** mean the image is vulnerability-free. Review findings before deploying or upgrading.

The initial audit on 2026-11-17 reported two HIGH findings in bundled Docker CLI plugins:

- `CVE-2026-17106` in `github.com/moby/go-archive`, installed `v0.2.0`, fixed in `0.3.0`.
- `CVE-2026-78661` in `golang.org/x/net`, installed `v0.60.0`, fixed in `0.62.0`.

No CRITICAL findings were reported in that scan. These are findings in components detected inside the scanned image; assess actual exposure and update to a vendor image containing fixed components when available. Do not suppress findings merely to make CI green.

## Reporting

Do not put passwords, access tokens, private browser data, or personal files in GitHub issues. For a suspected secret leak, revoke or rotate the credential first, then remove the exposed value from the repository history as appropriate.
