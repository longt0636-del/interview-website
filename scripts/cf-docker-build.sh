#!/usr/bin/env bash
# Dựng / chạy thử / đưa web tuyển sinh lên Cloudflare trong máy Linux (Docker) — 25/10/2026.
# Vì sao Docker: OpenNext cần tạo symlink khi đóng gói (Windows chặn nếu chưa bật Developer Mode), và bản dựng ghi
# đường dẫn tuyệt đối kiểu Linux (/app/...) nên bước gói worker (wrangler) cũng phải chạy ở cùng chỗ.
#
#   bash scripts/cf-docker-build.sh build          dựng
#   bash scripts/cf-docker-build.sh dev            chạy thử trên máy: http://localhost:8787 (PORT=8788 để đổi cổng) (kho D1/R2 giả lập ở .wrangler/)
#   bash scripts/cf-docker-build.sh build dev      dựng rồi chạy thử
#   bash scripts/cf-docker-build.sh build deploy   dựng rồi đưa lên Cloudflare (tài khoản wrangler đã đăng nhập trên máy)
set -euo pipefail
export MSYS_NO_PATHCONV=1  # Git Bash trên Windows tự đổi "/app" thành "C:/Program Files/Git/app" — tắt đi
HERE="$(cd "$(dirname "$0")/.." && pwd -W 2>/dev/null || pwd)"
NAME="$(basename "$HERE")"
WRANGLER_DIR="${APPDATA:-$HOME/AppData/Roaming}/xdg.config/.wrangler"
ACTIONS="${*:-build}"
PORT_ARGS=()
if [[ " $ACTIONS " == *" dev "* ]]; then PORT_ARGS=(-p "${PORT:-8787}:8787"); fi
docker run --rm "${PORT_ARGS[@]}" \
  -v "$HERE:/src" \
  -v "longielts-cf-$NAME-app:/app" \
  -v "$WRANGLER_DIR:/root/.config/.wrangler" \
  -e ACTIONS="$ACTIONS" -e WRANGLER_SEND_METRICS=false -e GIT_SHA="$(git -C "$HERE" rev-parse HEAD 2>/dev/null)" \
  -w /app node:24-bookworm bash -c '
    set -euo pipefail
    command -v rsync >/dev/null || { apt-get -qq update >/dev/null && apt-get -qq install -y rsync >/dev/null; }
    rsync -a --delete --exclude node_modules --exclude .next --exclude .open-next --exclude .wrangler --exclude .git /src/ /app/
    if ! cmp -s /app/package-lock.json /app/node_modules/.lock-copy 2>/dev/null; then
      npm ci --no-audit --no-fund --loglevel=error && cp /app/package-lock.json /app/node_modules/.lock-copy
    fi
    for a in $ACTIONS; do
      case "$a" in
        build) node scripts/cf-build.mjs ;;
        dev) npx wrangler dev --ip 0.0.0.0 --port 8787 --persist-to /src/.wrangler/state ;;
        deploy) npx opennextjs-cloudflare deploy ;;
        *) echo "không hiểu lệnh: $a"; exit 1 ;;
      esac
    done
  '
