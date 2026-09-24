#!/bin/sh

set -eu

echo "==> Testing v1..."
v1_response="$(curl -fsS http://localhost:3001/)"
echo "$v1_response" | grep -q "Hello from v1 (Blue)!"
echo "✓ v1 OK"

echo "==> Testing v2..."
v2_response="$(curl -fsS http://localhost:3002/)"
echo "$v2_response" | grep -q "Hello from v2 (Green/Canary)!"
echo "✓ v2 OK"

echo "==> Testing Nginx..."
nginx_response="$(curl -fsS http://localhost:8080/)"
echo "$nginx_response" | grep -Eq "Hello from v1 \(Blue\)!|Hello from v2 \(Green/Canary\)!"
echo "✓ Nginx OK"

echo "==> Testing Nginx canary distribution..."
for i in $(seq 1 100); do
  curl -fsS http://localhost:8080/ >/dev/null
done
echo "✓ Nginx handled 100 requests"

echo ""
echo "All tests passed!"
