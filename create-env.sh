#!/bin/bash

# Define directories
directories=("client" "server")

# Iterate over directories
for dir in "${directories[@]}"; do
  if [ -f "$dir/.env.example" ]; then
    cp "$dir/.env.example" "$dir/.env"
    echo "Copied .env.example to .env in $dir"
  else
    echo "No .env.example found in $dir"
  fi
done
