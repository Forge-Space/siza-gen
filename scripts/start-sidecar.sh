#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_DIR="$SCRIPT_DIR/../python"

cd "$PYTHON_DIR"

if ! command -v uvicorn &>/dev/null; then
    echo "Installing siza-ml dependencies..."
    pip install -e ".[dev]"
fi

exec uvicorn siza_ml.app:app \
    --host "${SIZA_ML_HOST:-0.0.0.0}" \
    --port "${SIZA_ML_PORT:-8100}" \
    --log-level info
