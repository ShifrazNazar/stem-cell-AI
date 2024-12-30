#!/bin/bash

# Define directories
directories=("client" "server")

# Iterate over directories
for dir in "${directories[@]}"; do
  if [ -f "$dir/.env.example" ]; then
    cp "$dir/.env.example" "$dir/.env"
    echo "Copied .env.example to .env in $dir"
  elif [ -f "$dir/example.env" ]; then
    cp "$dir/example.env" "$dir/.env"
    echo "Copied example.env to .env in $dir"
  else
    echo "No .env.example or example.env found in $dir"
  fi
done
