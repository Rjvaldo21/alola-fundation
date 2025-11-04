# Gunakan image resmi Node.js sebagai base image
FROM node:20.11.1-slim AS builder

# Set working directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh project
COPY . .

# Build Vue.js app (pastikan menggunakan Vite atau Vue CLI)
RUN npm run build

# --- Stage 2: Gunakan nginx untuk serving file statis ---
FROM nginx:alpine AS production

# Hapus konfigurasi default nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Salin konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin file hasil build Vue ke nginx public folder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 untuk akses
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
