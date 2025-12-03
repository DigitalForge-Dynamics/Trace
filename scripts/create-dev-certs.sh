#!/usr/bin/env bash
set -eu

echo "=== Development TLS Certificate Generator (ECDSA secp384r1) ==="

# Script lives in /scripts → project root is parent directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$PROJECT_ROOT/.env.development"
CERT_DIR="$PROJECT_ROOT/.certs"
DOMAIN="localhost"

# Ensure .env.development exists
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found!"
    echo "Create it with: KEYCLOAK_TLS_PASSWORD=yourpassword"
    exit 1
fi

# Load KEYCLOAK_TLS_PASSWORD
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

if [ -z "${KEYCLOAK_TLS_PASSWORD:-}" ]; then
    echo "ERROR: KEYCLOAK_TLS_PASSWORD missing in $ENV_FILE"
    exit 1
fi

# Create .certs directory
mkdir -p "$CERT_DIR"

echo "Using domain: $DOMAIN"
echo "Generating ECDSA private key (secp384r1)..."
openssl ecparam -name secp384r1 -genkey -noout -out "$CERT_DIR/tls.key"

echo "Generating CSR..."
# NOTE: Double leading slashes avoid Git Bash path translation (/C= → C:\)
openssl req -new \
  -key "$CERT_DIR/tls.key" \
  -out "$CERT_DIR/tls.csr" \
  -subj "//C=US/ST=Local/L=Local/O=Dev/OU=Dev/CN=$DOMAIN"

# SAN file (required because Windows Git Bash breaks process substitution)
SAN_FILE="$CERT_DIR/san.txt"
echo "subjectAltName=DNS:$DOMAIN" > "$SAN_FILE"

echo "Generating self-signed certificate..."
openssl x509 -req -days 365 \
  -in "$CERT_DIR/tls.csr" \
  -signkey "$CERT_DIR/tls.key" \
  -out "$CERT_DIR/tls.crt" \
  -extfile "$SAN_FILE"

echo "Generating PKCS12 keystore (password from .env.development)..."
openssl pkcs12 -export \
  -in "$CERT_DIR/tls.crt" \
  -inkey "$CERT_DIR/tls.key" \
  -out "$CERT_DIR/keycloak.p12" \
  -name keycloak \
  -passout pass:"$KEYCLOAK_TLS_PASSWORD"

# Cleanup
rm "$CERT_DIR/tls.csr" "$SAN_FILE"

echo ""
echo "=== Done! ==="
echo "Certificates written to: $CERT_DIR"
echo "- tls.key      (ECDSA secp384r1)"
echo "- tls.crt      (self-signed for localhost)"
echo "- keycloak.p12 (password from .env.development)"
echo ""
