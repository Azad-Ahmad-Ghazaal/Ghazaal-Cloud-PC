#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=:1
PROFILE_DIR="/workspaces/.ghazaal-chromium-profile"
mkdir -p "$PROFILE_DIR"

if ! pgrep -x Xvfb >/dev/null 2>&1; then
  Xvfb :1 -screen 0 1440x900x24 -ac +extension GLX +render -noreset >/tmp/ghazaal-xvfb.log 2>&1 &
fi

for _ in $(seq 1 20); do
  if xdpyinfo -display "$DISPLAY" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! pgrep -f '[x]fce4-session' >/dev/null 2>&1; then
  dbus-launch --exit-with-session startxfce4 >/tmp/ghazaal-xfce.log 2>&1 &
fi

if ! pgrep -f '[x]11vnc.*5900' >/dev/null 2>&1; then
  x11vnc -display "$DISPLAY" -forever -shared -nopw -listen 127.0.0.1 -rfbport 5900 >/tmp/ghazaal-x11vnc.log 2>&1 &
fi

if ! pgrep -f '[w]ebsockify.*6080' >/dev/null 2>&1; then
  websockify --web=/usr/share/novnc 6080 127.0.0.1:5900 >/tmp/ghazaal-novnc.log 2>&1 &
fi

if ! pgrep -f '[c]hromium.*ghazaal-chromium-profile' >/dev/null 2>&1; then
  chromium --user-data-dir="$PROFILE_DIR" --no-first-run --no-default-browser-check --start-maximized https://www.google.com >/tmp/ghazaal-chromium.log 2>&1 &
fi

echo "Ghazaal desktop started. Open the private forwarded port 6080."
