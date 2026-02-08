#!/bin/bash

# Check if an input string was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <your_passphrase>"
    exit 1
fi

# Generate a SHA-256 hex key from the input string
# We use printf to ensure no trailing newline character is added to the hash
key=$(printf "%s" "$1" | openssl dgst -sha256 | sed 's/^.*= //')

echo "--------------------------------------"
echo "Passphrase: $1"
echo "HMAC Key:   $key"
echo "--------------------------------------"