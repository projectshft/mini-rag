#!/usr/bin/env bash
# Run this ON the student-todo-exercises branch after any sync from main.
# Fails if any LMS/curriculum path slipped in — students must never see
# the course site code, the curriculum source, or the LMS deps.
set -euo pipefail

FORBIDDEN=(
  "curriculum"
  "app/learn"
  "app/admin"
  "components/lms"
  "lib/lms"
  "prisma/lms"
  "middleware.ts"
  "docs/LMS-SETUP.md"
)

fail=0
for path in "${FORBIDDEN[@]}"; do
  if [ -e "$path" ]; then
    echo "✗ FORBIDDEN PATH PRESENT: $path"
    fail=1
  fi
done

if grep -q '"@clerk/nextjs"' package.json 2>/dev/null; then
  echo '✗ FORBIDDEN DEP PRESENT: @clerk/nextjs in package.json'
  fail=1
fi
if grep -q '"lms:push"' package.json 2>/dev/null; then
  echo '✗ FORBIDDEN SCRIPT PRESENT: lms:* in package.json'
  fail=1
fi

if [ "$fail" -eq 1 ]; then
  echo ""
  echo "Student branch is DIRTY — remove the paths above before pushing."
  exit 1
fi

echo "✓ Student branch is clean."
