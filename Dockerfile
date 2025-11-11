FROM node:20-alpine AS builder

ENV NODE_ENV=production

# Instalas pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copias los archivos de pnpm
COPY package.json pnpm-lock.yaml ./

# Instalas dependencias con pnpm
RUN pnpm install --frozen-lockfile 

# Copias el resto del código
COPY . .

# Construyes el proyecto
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT 3000

# Creas el usuario no-root para seguridad
RUN addgroup -S nodejs
RUN adduser -S node -G nodejs

# Copias SOLO lo necesario desde la etapa 'builder'
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Asignas permisos al usuario
RUN chown -R node:nodejs /app

# Usas el usuario no-root
USER node

EXPOSE 3000

# Comando final para ejecutar la app
CMD ["node", "server.js"]