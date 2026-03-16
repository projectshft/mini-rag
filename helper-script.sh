#!/usr/bin/env bash

# Source this file to add the project root to PYTHONPATH.
# This lets imports like `app.libs.openai_py.openai` and
# `app.libs.pinecone_py.pinecone` resolve from this repo first.

# Resolve the directory where this script lives.
_HELPER_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# Keep existing PYTHONPATH entries, but prepend this repo root.
if [[ -n "${PYTHONPATH:-}" ]]; then
  export PYTHONPATH="${_HELPER_DIR}:${PYTHONPATH}"
else
  export PYTHONPATH="${_HELPER_DIR}"
fi

unset _HELPER_DIR
