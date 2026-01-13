# 🎨 Interface Admin - Panel Web d'Actualités

Interface d'administration React pour gérer les actualités du launcher Minecraft.

---

## 📋 Fonctionnalités

- ✅ Connexion sécurisée avec JWT
- ✅ Création/modification/suppression d'actualités
- ✅ **Éditeur WYSIWYG** (pas besoin de connaître le HTML !)
- ✅ Aperçu en temps réel
- ✅ Interface responsive (mobile-friendly)
- ✅ Design moderne avec animations

---

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm start
```

L'interface sera accessible sur http://localhost:3001

**Note** : Le backend doit être démarré sur le port 3000.

### Build pour production

```bash
npm run build
```

Le build sera dans le dossier `build/` et sera servi automatiquement par le serveur Express.

---

## 📝 Guide d'utilisation de l'éditeur

**Pour créer des actualités sans connaître le HTML**, consultez le guide complet :

👉 **[Guide de l'éditeur WYSIWYG](./WYSIWYG_EDITOR_GUIDE.md)**

Ce guide explique :
- Comment utiliser les boutons de formatage
- Comment créer des listes, titres, textes en gras, etc.
- Exemples d'actualités bien formatées
- Bonnes pratiques

---

## 🔐 Authentification

### Connexion

- **URL** : `https://votre-domaine.fr` (racine du site)
- **Username** : `admin` (configurable dans `.env`)
- **Password** : Celui que vous avez configuré

### Changer le mot de passe

Sur le Raspberry Pi :

```bash
cd ~/raspberry-pi-server

# Générer un nouveau hash
node -e "console.log(require('bcryptjs').hashSync('NOUVEAU_MOT_DE_PASSE', 10))"

# Modifier le fichier .env
nano .env
# Remplacez ADMIN_PASSWORD_HASH par le nouveau hash

# Redémarrer le serveur
pm2 restart news-server
```

---

## 🎨 Structure de l'interface

```
admin/
├── public/          # Fichiers statiques
├── src/
│   ├── components/  # Composants React
│   │   ├── NewsList.js      # Liste des actualités
│   │   ├── NewsForm.js      # Formulaire avec éditeur WYSIWYG
│   │   ├── NewsForm.css     # Styles de l'éditeur
│   ├── pages/       # Pages principales
│   │   ├── Login.js         # Page de connexion
│   │   ├── Dashboard.js     # Tableau de bord
│   ├── App.js       # Composant principal
│   ├── index.js     # Point d'entrée
├── WYSIWYG_EDITOR_GUIDE.md  # Guide d'utilisation
└── package.json
```

---

## 🛠️ Technologies utilisées

- **React 18** - Framework UI
- **React Router** - Navigation
- **Font Awesome** - Icônes
- **contentEditable API** - Éditeur WYSIWYG natif
- **JWT** - Authentification sécurisée

---

## 📱 Interface responsive

L'interface s'adapte automatiquement :
- 💻 **Desktop** : Vue complète avec sidebar
- 📱 **Mobile** : Vue optimisée avec menu responsive

---

## 🔄 Mise à jour de l'interface

Après avoir modifié le code React :

```bash
# Sur votre PC
git add .
git commit -m "Update admin interface"
git push origin main

# Sur le Raspberry Pi
cd ~/raspberry-pi-server
./update-from-github.sh
```

Le script automatique va rebuild l'interface et redémarrer le serveur.

---

## 🎯 Fonctionnalités de l'éditeur WYSIWYG

### Boutons de formatage disponibles

| Bouton | Fonction |
|--------|----------|
| **B** | Gras |
| *I* | Italique |
| <u>U</u> | Souligné |
| **H** | Titre (h3) |
| ¶ | Paragraphe |
| • | Liste à puces |
| 1. | Liste numérotée |
| 🧹 | Supprimer formatage |
| 📄 | Insérer un template |

### Raccourcis clavier

- `Ctrl + B` : Gras
- `Ctrl + I` : Italique
- `Ctrl + U` : Souligné

---

## 🐛 Dépannage

### L'éditeur ne fonctionne pas

Vérifiez que vous utilisez un navigateur moderne :
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Les actualités ne se sauvegardent pas

1. Vérifiez que vous êtes connecté (JWT valide)
2. Regardez la console du navigateur (F12)
3. Vérifiez les logs du serveur : `pm2 logs news-server`

### Le build échoue

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Ressources

- [Guide de l'éditeur WYSIWYG](./WYSIWYG_EDITOR_GUIDE.md)
- [Guide d'installation Raspberry Pi](../RASPBERRY_PI_INSTALLATION.md)
- [Documentation React](https://react.dev)

---

**💡 Astuce** : Consultez le [guide de l'éditeur WYSIWYG](./WYSIWYG_EDITOR_GUIDE.md) pour créer de belles actualités facilement !
