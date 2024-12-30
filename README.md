# Stem Cell Therapy

## Overview

This project consists of a client-side application and a server-side application designed to work together to deliver the Stem Cell Therapy platform.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (LTS version recommended)
- Yarn (Package Manager)
- Bash (for running shell scripts)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ShifrazNazar/stem-cell-therapy.git
   cd stem-cell-therapy
   ```

2. Create the necessary environment:
   ```bash
   chmod +x create-env.sh
   ./create-env.sh
   ```

### Client Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the server:
   ```bash
   yarn dev
   ```

## Running the Application

1. Ensure both the client and server are running.
2. Access the client application in your browser at the specified local development URL (e.g., `http://localhost:3000`).

## Folder Structure

```
root
├── client       # Frontend codebase
├── server       # Backend codebase
└── create-env.sh  # Script to set up environment variables
```

## Troubleshooting

- Ensure all dependencies are installed using `yarn install`.
- Verify that your environment variables are correctly configured.
- Check logs for errors when running `yarn dev` in the server directory.
