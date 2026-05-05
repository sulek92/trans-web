FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/

# Install dependencies for the whole workspace (or just api)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Run in dev mode with watch
CMD ["npm", "run", "dev", "--workspace=api"]
