# Étape 1: Builder l'interface admin React
FROM node:18-alpine AS admin-builder

WORKDIR /app/admin

# Copier les fichiers de dépendances de l'admin
COPY admin/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source de l'admin
COPY admin/ ./

# Builder l'application React
RUN npm run build

# Étape 2: Image de production
FROM node:18-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier les fichiers de dépendances du serveur
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Copier le code source du serveur
COPY server.js ./
COPY database.js ./
COPY middleware/ ./middleware/
COPY routes/ ./routes/

# Copier le build React depuis l'étape précédente
COPY --from=admin-builder /app/admin/build ./admin/build

# Créer le dossier uploads et la base de données avec les bonnes permissions
RUN mkdir -p uploads data && \
    chown -R nodejs:nodejs /app

# Utiliser l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV PORT=3000
ENV NODE_ENV=production

# Commande de démarrage
CMD ["node", "server.js"]
