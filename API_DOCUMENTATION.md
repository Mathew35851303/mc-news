# 📡 Documentation API - Serveur d'Actualités

Documentation complète de l'API REST pour gérer les actualités du launcher.

**Base URL** : `https://storage.losnachoschipies.fr` (ou votre domaine)

---

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification des routes protégées.

### Login (Connexion Admin)

**Endpoint** : `POST /api/auth/login`

**Description** : Authentifie l'administrateur et retourne un token JWT.

**Corps de la requête** :
```json
{
  "username": "admin",
  "password": "votre_mot_de_passe"
}
```

**Réponse (Succès - 200)** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Réponse (Erreur - 401)** :
```json
{
  "error": "Invalid credentials"
}
```

**Exemple cURL** :
```bash
curl -X POST https://storage.losnachoschipies.fr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"votre_mot_de_passe"}'
```

**Exemple JavaScript** :
```javascript
const response = await fetch('https://storage.losnachoschipies.fr/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'votre_mot_de_passe'
  })
})

const data = await response.json()
const token = data.token
```

---

## 📰 Actualités (News)

### 1. Récupérer toutes les actualités

**Endpoint** : `GET /api/news`

**Description** : Récupère la liste de toutes les actualités (publique, pas besoin d'authentification).

**Paramètres** : Aucun

**Réponse (Succès - 200)** :
```json
[
  {
    "id": 1,
    "title": "Mise à jour 1.20.4",
    "description": "Nouveaux mods et optimisations",
    "fullDescription": "<p>Salut à tous !</p><h3>Nouveautés</h3><ul><li>Mod Create ajouté</li><li>Optimisations</li></ul>",
    "type": "update",
    "isNew": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Événement PvP",
    "description": "Tournoi ce weekend !",
    "fullDescription": "<p>Venez participer au tournoi PvP !</p>",
    "type": "event",
    "isNew": false,
    "createdAt": "2024-01-10T14:00:00.000Z",
    "updatedAt": "2024-01-10T14:00:00.000Z"
  }
]
```

**Types disponibles** :
- `update` - Mise à jour
- `event` - Événement
- `reset` - Reset
- `maintenance` - Maintenance
- `info` - Information

**Exemple cURL** :
```bash
curl https://storage.losnachoschipies.fr/api/news
```

**Exemple JavaScript** :
```javascript
const response = await fetch('https://storage.losnachoschipies.fr/api/news')
const news = await response.json()

// Afficher les actualités
news.forEach(item => {
  console.log(`${item.title} - ${item.description}`)
})
```

**Exemple pour site web** :
```html
<div id="news-container"></div>

<script>
async function loadNews() {
  const response = await fetch('https://storage.losnachoschipies.fr/api/news')
  const news = await response.json()

  const container = document.getElementById('news-container')

  news.forEach(item => {
    const newsCard = `
      <div class="news-card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="type">${item.type}</span>
        ${item.isNew ? '<span class="badge-new">NEW</span>' : ''}
      </div>
    `
    container.innerHTML += newsCard
  })
}

loadNews()
</script>
```

---

### 2. Récupérer une actualité spécifique

**Endpoint** : `GET /api/news/:id`

**Description** : Récupère les détails d'une actualité par son ID.

**Paramètres** :
- `id` (obligatoire) - ID de l'actualité

**Réponse (Succès - 200)** :
```json
{
  "id": 1,
  "title": "Mise à jour 1.20.4",
  "description": "Nouveaux mods et optimisations",
  "fullDescription": "<p>Contenu HTML complet...</p>",
  "type": "update",
  "isNew": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Réponse (Erreur - 404)** :
```json
{
  "error": "News not found"
}
```

**Exemple cURL** :
```bash
curl https://storage.losnachoschipies.fr/api/news/1
```

**Exemple JavaScript** :
```javascript
const newsId = 1
const response = await fetch(`https://storage.losnachoschipies.fr/api/news/${newsId}`)
const news = await response.json()
```

---

### 3. Créer une actualité (Authentification requise)

**Endpoint** : `POST /api/news`

**Description** : Crée une nouvelle actualité (nécessite un token JWT).

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Corps de la requête** :
```json
{
  "title": "Nouvelle mise à jour !",
  "description": "Description courte",
  "fullDescription": "<p>Contenu HTML complet...</p>",
  "type": "update",
  "isNew": true
}
```

**Champs obligatoires** :
- `title` (string, max 100 caractères)
- `description` (string, max 150 caractères)
- `fullDescription` (string, HTML)
- `type` (string: `update`, `event`, `reset`, `maintenance`, `info`)
- `isNew` (boolean)

**Réponse (Succès - 201)** :
```json
{
  "id": 3,
  "title": "Nouvelle mise à jour !",
  "description": "Description courte",
  "fullDescription": "<p>Contenu HTML complet...</p>",
  "type": "update",
  "isNew": true,
  "createdAt": "2024-01-20T12:00:00.000Z",
  "updatedAt": "2024-01-20T12:00:00.000Z"
}
```

**Réponse (Erreur - 401)** :
```json
{
  "error": "Unauthorized"
}
```

**Exemple cURL** :
```bash
curl -X POST https://storage.losnachoschipies.fr/api/news \
  -H "Authorization: Bearer votre_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle actualité",
    "description": "Description",
    "fullDescription": "<p>Contenu...</p>",
    "type": "info",
    "isNew": true
  }'
```

**Exemple JavaScript** :
```javascript
const token = localStorage.getItem('adminToken')

const response = await fetch('https://storage.losnachoschipies.fr/api/news', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Nouvelle actualité',
    description: 'Description courte',
    fullDescription: '<p>Contenu complet...</p>',
    type: 'update',
    isNew: true
  })
})

const newNews = await response.json()
```

---

### 4. Mettre à jour une actualité (Authentification requise)

**Endpoint** : `PUT /api/news/:id`

**Description** : Met à jour une actualité existante.

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Paramètres** :
- `id` (obligatoire) - ID de l'actualité à modifier

**Corps de la requête** :
```json
{
  "title": "Titre modifié",
  "description": "Nouvelle description",
  "fullDescription": "<p>Nouveau contenu...</p>",
  "type": "update",
  "isNew": false
}
```

**Réponse (Succès - 200)** :
```json
{
  "id": 1,
  "title": "Titre modifié",
  "description": "Nouvelle description",
  "fullDescription": "<p>Nouveau contenu...</p>",
  "type": "update",
  "isNew": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T15:00:00.000Z"
}
```

**Réponse (Erreur - 404)** :
```json
{
  "error": "News not found"
}
```

**Exemple cURL** :
```bash
curl -X PUT https://storage.losnachoschipies.fr/api/news/1 \
  -H "Authorization: Bearer votre_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Titre modifié",
    "description": "Description modifiée",
    "fullDescription": "<p>Contenu modifié...</p>",
    "type": "update",
    "isNew": false
  }'
```

**Exemple JavaScript** :
```javascript
const token = localStorage.getItem('adminToken')
const newsId = 1

const response = await fetch(`https://storage.losnachoschipies.fr/api/news/${newsId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Titre modifié',
    description: 'Description modifiée',
    fullDescription: '<p>Contenu modifié...</p>',
    type: 'update',
    isNew: false
  })
})

const updatedNews = await response.json()
```

---

### 5. Supprimer une actualité (Authentification requise)

**Endpoint** : `DELETE /api/news/:id`

**Description** : Supprime une actualité.

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
```

**Paramètres** :
- `id` (obligatoire) - ID de l'actualité à supprimer

**Réponse (Succès - 200)** :
```json
{
  "message": "News deleted successfully"
}
```

**Réponse (Erreur - 404)** :
```json
{
  "error": "News not found"
}
```

**Exemple cURL** :
```bash
curl -X DELETE https://storage.losnachoschipies.fr/api/news/1 \
  -H "Authorization: Bearer votre_token_jwt"
```

**Exemple JavaScript** :
```javascript
const token = localStorage.getItem('adminToken')
const newsId = 1

const response = await fetch(`https://storage.losnachoschipies.fr/api/news/${newsId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const result = await response.json()
console.log(result.message) // "News deleted successfully"
```

---

## 🏥 Health Check

### Vérifier le statut du serveur

**Endpoint** : `GET /api/health`

**Description** : Vérifie que le serveur fonctionne correctement.

**Réponse (Succès - 200)** :
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "uptime": 123456
}
```

**Exemple cURL** :
```bash
curl https://storage.losnachoschipies.fr/api/health
```

---

## 📊 Exemples d'utilisation

### Exemple complet : Site web vitrine

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Actualités - Los Nachos</title>
  <style>
    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .news-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .news-card h3 {
      color: #ff6b35;
      margin-top: 0;
    }

    .badge-new {
      background: gold;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      color: white;
      font-size: 12px;
      margin-top: 10px;
    }

    .type-update { background: #4CAF50; }
    .type-event { background: #2196F3; }
    .type-info { background: #ff6b35; }
  </style>
</head>
<body>
  <h1>Dernières Actualités</h1>
  <div id="news" class="news-grid"></div>

  <script>
    async function loadNews() {
      try {
        const response = await fetch('https://storage.losnachoschipies.fr/api/news')
        const news = await response.json()

        const container = document.getElementById('news')

        news.forEach(item => {
          const card = document.createElement('div')
          card.className = 'news-card'

          card.innerHTML = `
            <h3>
              ${item.title}
              ${item.isNew ? '<span class="badge-new">NEW</span>' : ''}
            </h3>
            <p>${item.description}</p>
            <span class="type-badge type-${item.type}">${item.type}</span>
            <div class="content">${item.fullDescription}</div>
          `

          container.appendChild(card)
        })
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    loadNews()
  </script>
</body>
</html>
```

### Exemple : React Component

```jsx
import React, { useState, useEffect } from 'react'

function NewsList() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://storage.losnachoschipies.fr/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erreur:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Chargement...</div>

  return (
    <div className="news-list">
      {news.map(item => (
        <div key={item.id} className="news-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.isNew && <span className="badge">NEW</span>}
          <div dangerouslySetInnerHTML={{ __html: item.fullDescription }} />
        </div>
      ))}
    </div>
  )
}

export default NewsList
```

---

## 🔒 Sécurité

- **CORS** : Activé pour permettre les requêtes depuis n'importe quel domaine
- **Authentication** : JWT obligatoire pour POST, PUT, DELETE
- **HTTPS** : Toutes les requêtes doivent passer par HTTPS via Cloudflare Tunnel
- **Rate Limiting** : Recommandé d'implémenter un rate limiting côté serveur

---

## 🐛 Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## 📝 Notes importantes

1. **Pas d'authentification pour GET** : Les routes GET sont publiques
2. **Token JWT** : Expire après 24 heures, reconnectez-vous si nécessaire
3. **HTML dans fullDescription** : Le contenu HTML est accepté, assurez-vous de le nettoyer côté client si nécessaire
4. **Dates** : Toutes les dates sont en format ISO 8601 (UTC)
5. **🗑️ Nettoyage automatique** : Les actualités de plus d'1 mois sont automatiquement supprimées tous les jours au démarrage du serveur

---

**URL de base** : `https://storage.losnachoschipies.fr`

**Contact** : Pour toute question, vérifiez les logs du serveur : `pm2 logs news-server`
