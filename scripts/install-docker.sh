#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  printf 'Run this script with sudo: sudo bash %s\n' "$0" >&2
  exit 1
fi

if [[ ! -r /etc/os-release ]]; then
  printf 'Cannot identify this Linux distribution.\n' >&2
  exit 1
fi

. /etc/os-release
if [[ "${ID:-}" != "ubuntu" && "${ID:-}" != "debian" ]]; then
  printf 'This installer supports Ubuntu and Debian; detected: %s\n' "${ID:-unknown}" >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL "https://download.docker.com/linux/${ID}/gpg" -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

architecture="$(dpkg --print-architecture)"
codename="${VERSION_CODENAME:-}"
if [[ -z "$codename" ]]; then
  printf 'Could not determine the distribution codename.\n' >&2
  exit 1
fi

printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/%s %s stable\n' \
  "$architecture" "$ID" "$codename" > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

if [[ -n "${SUDO_USER:-}" ]]; then
  usermod -aG docker "$SUDO_USER"
  printf 'Added %s to the docker group. Log out and back in for the new group to apply.\n' "$SUDO_USER"
fi

docker --version
docker compose version