#!/bin/bash
set -e

# Run in root folder.

python -m venv .venv

.venv/bin/pip install -r scripts/requirements.txt
