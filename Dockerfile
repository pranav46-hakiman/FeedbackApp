# ---------- FRONTEND (React) BUILD STAGE ----------
FROM node:18 as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# ---------- BACKEND (Node.js) BUILD STAGE ----------
FROM node:18 as backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./

# ---------- FINAL PRODUCTION IMAGE ----------
FROM node:18
WORKDIR /app

# Copy frontend build from first stage
COPY --from=frontend-build /app/build /app/frontend-build

# Copy backend from second stage
COPY --from=backend /app /app

# Expose the API port
EXPOSE 3000

# Start the backend server
CMD ["node", "index.js"]
