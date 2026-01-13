# 📰 Serveur d'Actualités pour Launcher Minecraft

Serveur backend Node.js + Interface admin React pour gérer les actualités d'un launcher Minecraft.
Optimisé pour fonctionner sur **Raspberry Pi 3B**.

---

## 🚀 Fonctionnalités

### Backend (API REST)
- ✅ API REST complète avec Express.js
- ✅ Base de données SQLite (légère, parfaite pour le Pi)
- ✅ Authentification JWT pour l'admin
- ✅ Routes publiques pour le launcher
- ✅ Routes protégées pour l'admin
- ✅ CORS activé
- ✅ Gestion automatique des dates

### Interface Admin React
- ✅ Page de connexion sécurisée
- ✅ Dashboard avec liste des actualités
- ✅ Formulaire de création/modification
- ✅ Preview HTML en temps réel
- ✅ 5 types d'actualités (update, event, reset, maintenance, info)
- ✅ Design moderne et responsive
- ✅ Indicateurs visuels (nouveau, type, date)

---

## 📋 Prérequis

- Node.js 18+ (20.x recommandé)
- npm ou yarn
- Raspberry Pi 3B (ou n'importe quel serveur Linux)

---

## 🏗️ Structure du projet

```
raspberry-pi-server/
├── server.js                 # Serveur Express principal
├── database.js               # Configuration SQLite + helpers
├── package.json              # Dépendances backend
├── .env.example              # Variables d'environnement (exemple)
├── .env                      # Variables d'environnement (à créer)
├── routes/
│   └── news.js               # Routes API pour les actualités
├── middleware/
│   └── auth.js               # Middleware d'authentification JWT
├── database/
│   └── news.db               # Base SQLite (créée automatiquement)
└── admin/                    # Interface React
    ├── package.json          # Dépendances React
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── pages/
        │   ├── Login.js
        │   └── Dashboard.js
        └── components/
            ├── NewsList.js
            └── NewsForm.js
```

---

## 🚀 Installation rapide (en local pour tester)

### 1. Installer les dépendances backend

```bash
cd raspberry-pi-server
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

Modifiez les valeurs :
```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...  # Voir ci-dessous
JWT_SECRET=changez-moi-svp
```

Pour générer un hash de mot de passe :
```bash
node -e "console.log(require('bcryptjs').hashSync('votre_mot_de_passe', 10))"
```

### 3. Démarrer le serveur backend

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 4. Construire l'interface admin

**Dans un autre terminal** :

```bash
cd admin
npm install
npm run build
```

L'interface sera disponible sur `http://localhost:3000` (servie par Express).

---

## 📡 API Endpoints

### Public (accessible par le launcher)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/health` | Statut du serveur |
| `GET` | `/api/news` | Liste toutes les actualités |
| `GET` | `/api/news/:id` | Récupère une actualité par ID |

### Protégé (nécessite authentification)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/login` | Connexion admin | ❌ |
| `POST` | `/api/news` | Créer une actualité | ✅ |
| `PUT` | `/api/news/:id` | Modifier une actualité | ✅ |
| `DELETE` | `/api/news/:id` | Supprimer une actualité | ✅ |

### Authentification

Pour les routes protégées, ajoutez le token dans le header :
```
Authorization: Bearer <TOKEN>
```

---

## 📊 Format des données

### Structure d'une actualité

```json
{
  "id": 1,
  "date": "15 Nov 2024",
  "title": "Nouvelle mise à jour",
  "description": "Description courte",
  "type": "update",
  "isNew": true,
  "fullDescription": "<p>Contenu HTML complet</p>",
  "createdAt": "2024-11-15T10:30:00.000Z"
}
```

### Types disponibles

- `update` : Mise à jour
- `event` : Événement
- `reset` : Reset de map
- `maintenance` : Maintenance serveur
- `info` : Information générale

---

## 🥧 Déploiement sur Raspberry Pi

**Suivez le guide complet** : [RASPBERRY_PI_INSTALLATION.md](./RASPBERRY_PI_INSTALLATION.md)

Le guide couvre :
- Installation de Raspberry Pi OS
- Configuration SSH
- Installation Node.js
- Déploiement du serveur
- Configuration PM2 (démarrage automatique)
- Exposition sur Internet avec Cloudflare Tunnel
- Configuration du sous-domaine

---

## 🔐 Sécurité

### Mots de passe

- ✅ Les mots de passe sont hashés avec bcrypt
- ✅ Jamais stockés en clair
- ✅ Hash avec 10 rounds de salage

### JWT

- ✅ Tokens JWT avec expiration (7 jours)
- ✅ Secret configurable via `.env`
- ⚠️ **CHANGEZ le JWT_SECRET en production !**

### CORS

- Par défaut, CORS autorise toutes les origines
- En production, restreignez avec :

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com'
}))
```

---

## 🛠️ Développement

### Mode développement backend

```bash
npm run dev  # Utilise nodemon pour auto-reload
```

### Mode développement React

```bash
cd admin
npm start  # Lance le serveur de dev sur port 3000
```

**Note** : En dev, configurez le proxy dans `admin/package.json` :
```json
{
  "proxy": "http://localhost:3000"
}
```

---

## 📝 Commandes utiles

### Backend

```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement
npm run init-db    # Initialiser la base de données
```

### Admin React

```bash
npm start          # Mode développement
npm run build      # Construire pour production
npm test           # Lancer les tests
```

### PM2 (production)

```bash
pm2 start server.js --name news-server
pm2 save
pm2 startup
pm2 status
pm2 logs news-server
pm2 restart news-server
pm2 stop news-server
```

---

## 🎨 Personnalisation

### Changer les couleurs de l'interface

Modifiez `admin/src/index.css` :

```css
:root {
  --primary: #667eea;       /* Couleur principale */
  --primary-dark: #5568d3;  /* Variante foncée */
  --success: #4CAF50;        /* Vert */
  --danger: #f44336;         /* Rouge */
}
```

### Ajouter un nouveau type d'actualité

1. **Backend** : Ajoutez le type dans `routes/news.js` :
```javascript
const validTypes = ['update', 'event', 'reset', 'maintenance', 'info', 'nouveau-type']
```

2. **Frontend** : Ajoutez dans `components/NewsList.js` :
```javascript
const types = {
  'nouveau-type': { label: 'Nouveau', icon: 'fa-icon', color: '#color' }
}
```

3. **Formulaire** : Ajoutez dans `components/NewsForm.js` :
```jsx
<option value="nouveau-type">🎉 Nouveau Type</option>
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Vérifier les logs
pm2 logs news-server

# Vérifier le port
netstat -tuln | grep 3000

# Tester manuellement
cd ~/raspberry-pi-server
node server.js
```

### La base de données ne se crée pas

```bash
# Vérifier les permissions
ls -la database/

# Créer manuellement
mkdir -p database
node database.js
```

### L'interface admin est blanche

```bash
# Vérifier que le build existe
ls admin/build/

# Reconstruire
cd admin
rm -rf build node_modules
npm install
npm run build
```

---

## 📚 Ressources

- [Documentation Express.js](https://expressjs.com/)
- [Documentation React](https://react.dev/)
- [Documentation SQLite](https://www.sqlite.org/docs.html)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## 📄 Licence

MIT

---

## 🤝 Support

Besoin d'aide ? Vérifiez :
1. Le guide d'installation : [RASPBERRY_PI_INSTALLATION.md](./RASPBERRY_PI_INSTALLATION.md)
2. Les logs : `pm2 logs news-server`
3. Le statut : `pm2 status`

---

**Développé avec ❤️ pour les launchers Minecraft**
