# API Documentation - MC News

Documentation complète de l'API REST pour le système de news.

**Base URL** : `https://news.losnachoschipies.fr`

---

## Table des matières

- [Authentification](#authentification)
- [Endpoints publics](#endpoints-publics)
  - [Health Check](#health-check)
  - [Liste des news](#liste-des-news)
  - [Détail d'une news](#détail-dune-news)
- [Endpoints protégés](#endpoints-protégés)
  - [Login](#login)
  - [Créer une news](#créer-une-news)
  - [Modifier une news](#modifier-une-news)
  - [Supprimer une news](#supprimer-une-news)
  - [Upload d'image](#upload-dimage)
  - [Supprimer une image](#supprimer-une-image)
- [Modèles de données](#modèles-de-données)
- [Codes d'erreur](#codes-derreur)
- [Exemples d'intégration](#exemples-dintégration)

---

## Authentification

Les endpoints protégés nécessitent un token JWT dans le header `Authorization`.

```
Authorization: Bearer <votre_token>
```

Pour obtenir un token, utilisez l'endpoint [Login](#login).

---

## Endpoints publics

### Health Check

Vérifie que le serveur est opérationnel.

```
GET /api/health
```

**Réponse** `200 OK`

```json
{
  "status": "ok",
  "message": "Serveur d'actualités opérationnel",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Liste des news

Récupère toutes les actualités, triées par date de création (plus récentes en premier).

```
GET /api/news
```

**Réponse** `200 OK`

```json
[
  {
    "id": 1,
    "date": "15 janv. 2024",
    "title": "Mise à jour 1.2.0",
    "description": "Nouvelle version disponible",
    "type": "update",
    "isNew": true,
    "fullDescription": "<p>Contenu HTML complet...</p>",
    "headerImage": "/uploads/news-images/news-123456789.jpg",
    "galleryImages": [
      "/uploads/news-images/news-111111111.jpg",
      "/uploads/news-images/news-222222222.jpg"
    ],
    "videoUrl": "https://youtube.com/watch?v=xxxxx",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Détail d'une news

Récupère une actualité par son ID.

```
GET /api/news/:id
```

**Paramètres URL**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | integer | ID de la news |

**Réponse** `200 OK`

```json
{
  "id": 1,
  "date": "15 janv. 2024",
  "title": "Mise à jour 1.2.0",
  "description": "Nouvelle version disponible",
  "type": "update",
  "isNew": true,
  "fullDescription": "<p>Contenu HTML complet...</p>",
  "headerImage": "/uploads/news-images/news-123456789.jpg",
  "galleryImages": [],
  "videoUrl": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Réponse** `404 Not Found`

```json
{
  "error": "Actualité non trouvée"
}
```

---

## Endpoints protégés

### Login

Authentifie un administrateur et retourne un token JWT.

```
POST /api/login
```

**Body** `application/json`

```json
{
  "username": "admin",
  "password": "votre_mot_de_passe"
}
```

**Réponse** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "message": "Connexion réussie"
}
```

**Réponse** `401 Unauthorized`

```json
{
  "error": "Identifiants incorrects"
}
```

---

### Créer une news

Crée une nouvelle actualité.

```
POST /api/news
```

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**

```json
{
  "title": "Titre de la news",
  "description": "Description courte (aperçu)",
  "type": "update",
  "fullDescription": "<p>Contenu HTML complet de la news...</p>",
  "isNew": true,
  "headerImage": "/uploads/news-images/news-123456789.jpg",
  "galleryImages": [
    "/uploads/news-images/news-111111111.jpg"
  ],
  "videoUrl": "https://youtube.com/watch?v=xxxxx"
}
```

**Champs obligatoires**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | string | Titre de la news |
| `description` | string | Description courte (aperçu) |
| `type` | string | Type de news (voir types valides) |
| `fullDescription` | string | Contenu complet (HTML autorisé) |

**Champs optionnels**

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `isNew` | boolean | `true` | Badge "Nouveau" affiché |
| `headerImage` | string | `null` | URL de l'image d'en-tête |
| `galleryImages` | array | `[]` | URLs des images de galerie |
| `videoUrl` | string | `null` | URL de vidéo YouTube |

**Types valides**

| Type | Description |
|------|-------------|
| `update` | Mise à jour |
| `event` | Événement |
| `reset` | Reset/Wipe |
| `maintenance` | Maintenance |
| `info` | Information |

**Réponse** `201 Created`

```json
{
  "id": 5,
  "date": "15 janv. 2024",
  "title": "Titre de la news",
  "description": "Description courte",
  "type": "update",
  "isNew": true,
  "fullDescription": "<p>Contenu HTML...</p>",
  "headerImage": null,
  "galleryImages": [],
  "videoUrl": null
}
```

---

### Modifier une news

Met à jour une actualité existante.

```
PUT /api/news/:id
```

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body** (mêmes champs que la création)

```json
{
  "title": "Titre modifié",
  "description": "Description modifiée",
  "type": "event",
  "fullDescription": "<p>Nouveau contenu...</p>",
  "isNew": false,
  "date": "20 janv. 2024"
}
```

**Réponse** `200 OK`

```json
{
  "id": 5,
  "date": "20 janv. 2024",
  "title": "Titre modifié",
  ...
}
```

---

### Supprimer une news

Supprime une actualité et ses images associées.

```
DELETE /api/news/:id
```

**Headers**

```
Authorization: Bearer <token>
```

**Réponse** `204 No Content`

(Pas de body)

---

### Upload d'image

Upload une image pour l'utiliser dans une news.

```
POST /api/upload
```

**Headers**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** `multipart/form-data`

| Champ | Type | Description |
|-------|------|-------------|
| `image` | file | Fichier image (JPG, PNG, GIF, WebP) |

**Limites**
- Taille max : 5 MB
- Formats : JPEG, PNG, GIF, WebP

**Réponse** `200 OK`

```json
{
  "success": true,
  "url": "/uploads/news-images/news-1705312200000-123456789.jpg",
  "filename": "news-1705312200000-123456789.jpg"
}
```

---

### Supprimer une image

Supprime une image uploadée.

```
DELETE /api/upload/:filename
```

**Headers**

```
Authorization: Bearer <token>
```

**Paramètres URL**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `filename` | string | Nom du fichier (ex: `news-123456789.jpg`) |

**Réponse** `200 OK`

```json
{
  "success": true,
  "message": "Image supprimée avec succès"
}
```

---

## Modèles de données

### News

```typescript
interface News {
  id: number;              // ID unique
  date: string;            // Date formatée (ex: "15 janv. 2024")
  title: string;           // Titre
  description: string;     // Description courte
  type: NewsType;          // Type de news
  isNew: boolean;          // Afficher badge "Nouveau"
  fullDescription: string; // Contenu HTML complet
  headerImage: string | null;    // URL image d'en-tête
  galleryImages: string[];       // URLs images galerie
  videoUrl: string | null;       // URL vidéo YouTube
  createdAt: string;       // Date ISO de création
}

type NewsType = 'update' | 'event' | 'reset' | 'maintenance' | 'info';
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Ressource créée |
| `204` | Suppression réussie (pas de contenu) |
| `400` | Requête invalide (champs manquants, type invalide) |
| `401` | Non authentifié ou token invalide |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur |

**Format d'erreur**

```json
{
  "error": "Message d'erreur",
  "required": ["field1", "field2"]  // optionnel
}
```

---

## Exemples d'intégration

### JavaScript (Fetch)

```javascript
// Récupérer toutes les news
const response = await fetch('https://news.losnachoschipies.fr/api/news');
const news = await response.json();

// Afficher les news
news.forEach(item => {
  console.log(`${item.title} - ${item.date}`);
});
```

### JavaScript avec authentification

```javascript
// Login
const loginResponse = await fetch('https://news.losnachoschipies.fr/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'votre_mot_de_passe'
  })
});
const { token } = await loginResponse.json();

// Créer une news
const createResponse = await fetch('https://news.losnachoschipies.fr/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Nouvelle actualité',
    description: 'Une super news',
    type: 'info',
    fullDescription: '<p>Contenu de la news...</p>'
  })
});
const newNews = await createResponse.json();
```

### React (exemple de hook)

```javascript
import { useState, useEffect } from 'react';

function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://news.losnachoschipies.fr/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { news, loading, error };
}

// Utilisation
function NewsList() {
  const { news, loading, error } = useNews();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <ul>
      {news.map(item => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span>{item.date}</span>
        </li>
      ))}
    </ul>
  );
}
```

### cURL

```bash
# Health check
curl https://news.losnachoschipies.fr/api/health

# Liste des news
curl https://news.losnachoschipies.fr/api/news

# Login
curl -X POST https://news.losnachoschipies.fr/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"votre_mot_de_passe"}'

# Créer une news (avec token)
curl -X POST https://news.losnachoschipies.fr/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "title": "Test",
    "description": "Description",
    "type": "info",
    "fullDescription": "<p>Contenu</p>"
  }'

# Upload image
curl -X POST https://news.losnachoschipies.fr/api/upload \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -F "image=@/chemin/vers/image.jpg"
```

---

## Notes

- Les news de plus d'1 mois sont automatiquement supprimées
- Les images sont servies depuis `/uploads/news-images/`
- Le token JWT expire après un certain temps (reconnexion nécessaire)
- CORS est activé pour toutes les origines
