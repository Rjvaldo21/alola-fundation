FROM nginx:stable-alpine3.17

# Salin output build Vue ke direktori nginx
COPY dist /usr/share/nginx/html

# Salin konfigurasi Nginx (jika ada penyesuaian)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]