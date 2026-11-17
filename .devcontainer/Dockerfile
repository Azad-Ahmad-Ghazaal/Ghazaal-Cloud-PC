FROM mcr.microsoft.com/devcontainers/base:debian

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      chromium \
      dbus-x11 \
      fonts-liberation \
      novnc \
      websockify \
      xfce4 \
      x11vnc \
      xvfb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 6080
