# syntax=docker/dockerfile:1

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public origin of the site (canonical URLs, social cards, sitemap). Pass with --build-arg.
ARG VITE_SITE_URL=""
ARG VITE_FORM_ENDPOINT=""
ENV VITE_SITE_URL=$VITE_SITE_URL VITE_FORM_ENDPOINT=$VITE_FORM_ENDPOINT
RUN npm run build

# ---- serve ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
