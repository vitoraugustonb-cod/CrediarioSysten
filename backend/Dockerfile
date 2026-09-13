# Stage 1: Build (Compilação do TypeScript e Prisma Client)
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência e schema
COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências para build
RUN npm install

# Gera o cliente Prisma para PostgreSQL
RUN npx prisma generate

# Copia arquivos de configuração e código fonte
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY src ./src/

# Compila o TypeScript para dist
RUN npm run build

# Stage 2: Runtime Otimizado e Seguro
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3300

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm install --omit=dev

# Copia os artefatos compilados do estágio anterior
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3300

CMD ["node", "dist/server.js"]
