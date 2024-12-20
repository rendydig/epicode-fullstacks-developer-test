FROM oven/bun:1.0.20

WORKDIR /app

COPY package.json .
COPY bun.lockb* .

# Create entrypoint script
COPY <<EOF /entrypoint.sh
#!/bin/sh
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  bun install
fi
bun run dev --host
EOF

RUN chmod +x /entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]
