#!/bin/bash

# Script de mise à jour du serveur depuis GitHub
# Usage: ./update-from-github.sh

echo "╔════════════════════════════════════════╗"
echo "║   🔄 Mise à jour depuis GitHub         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "server.js" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier raspberry-pi-server"
    exit 1
fi

echo "📥 Récupération des modifications depuis GitHub..."
git fetch origin

# Vérifier s'il y a des modifications locales
if ! git diff-index --quiet HEAD --; then
    echo ""
    echo "⚠️  Attention: Vous avez des modifications locales non commitées"
    echo "   Ces modifications seront écrasées si vous continuez."
    echo ""
    read -p "   Continuer quand même ? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Annulé"
        exit 1
    fi
    echo ""
    echo "🔄 Réinitialisation forcée..."
    git reset --hard origin/main
else
    echo "✅ Pas de modifications locales"
    echo ""
    echo "🔄 Mise à jour..."
    git pull origin main
fi

# Vérifier s'il y a eu des changements
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la récupération depuis GitHub"
    exit 1
fi

echo ""
echo "📦 Mise à jour des dépendances backend..."
npm install

echo ""
echo "🎨 Reconstruction de l'interface admin..."
cd admin

echo "   📦 Mise à jour des dépendances React..."
npm install

echo "   🔨 Build de l'interface..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build de l'interface admin"
    exit 1
fi

cd ..

echo ""
echo "🔄 Redémarrage du serveur..."
pm2 restart news-server

echo ""
echo "✅ Statut du serveur:"
pm2 status news-server

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✅ Mise à jour terminée !            ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📋 Logs récents:"
pm2 logs news-server --lines 10 --nostream

echo ""
echo "💡 Commandes utiles:"
echo "   pm2 logs news-server    # Voir les logs en temps réel"
echo "   pm2 status              # Voir le statut"
echo ""
