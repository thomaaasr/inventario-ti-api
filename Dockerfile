# Etapa 1: instala todas as dependências e compila o TypeScript.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: imagem final, só com o JavaScript compilado e as dependências de produção.
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# Roda com um usuário comum, não como administrador (root) do container.
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
