# Déploiement sur Portainer avec Cloudflare Tunnel

Ce guide explique comment déployer mc-news sur Portainer et l'exposer via `news.losenachoschipi.fr`.

## Prérequis

- Portainer installé et accessible via `portainer.losenachoschipi.fr`
- Tunnel Cloudflare déjà configuré
- Accès au dashboard Cloudflare Zero Trust

---

## Étape 1 : Préparer les variables d'environnement

Avant de déployer, génère les valeurs sécurisées :

### Générer le hash du mot de passe admin

Sur ta machine locale (avec Node.js installé) :

```bash
node -e "console.log(require('bcryptjs').hashSync('TON_MOT_DE_PASSE_ICI', 10))"
```

### Générer un JWT_SECRET sécurisé

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Note les valeurs générées, tu en auras besoin à l'étape 3.**

---

## Étape 2 : Déployer sur Portainer

### Option A : Via Git (Recommandé)

1. Connecte-toi à **Portainer** (`portainer.losenachoschipi.fr`)

2. Va dans **Stacks** > **Add stack**

3. Choisis **Repository** comme méthode de déploiement

4. Configure le repository :
   - **Repository URL** : `https://github.com/TON_USERNAME/mc-news`
   - **Repository reference** : `refs/heads/main`
   - **Compose path** : `docker-compose.yml`

5. Active **GitOps updates** si tu veux des mises à jour automatiques

6. Passe à l'étape 3 pour les variables d'environnement

### Option B : Via le Web Editor

1. Va dans **Stacks** > **Add stack**

2. Choisis **Web editor**

3. Colle le contenu du fichier `docker-compose.yml`

4. Passe à l'étape 3

---

## Étape 3 : Configurer les variables d'environnement

Dans Portainer, section **Environment variables**, ajoute :

| Variable | Valeur |
|----------|--------|
| `ADMIN_USERNAME` | `admin` (ou ton username) |
| `ADMIN_PASSWORD_HASH` | Le hash généré à l'étape 1 |
| `JWT_SECRET` | Le secret généré à l'étape 1 |

**Important** : Ne mets PAS les valeurs entre guillemets dans Portainer.

Clique sur **Deploy the stack**.

---

## Étape 4 : Configurer Cloudflare Tunnel

1. Va sur **Cloudflare Zero Trust** : https://one.dash.cloudflare.com/

2. Dans le menu, va dans **Networks** > **Tunnels**

3. Clique sur ton tunnel existant (celui qui gère `portainer.losenachoschipi.fr`)

4. Va dans l'onglet **Public Hostname** > **Add a public hostname**

5. Configure le nouvel hostname :

   | Champ | Valeur |
   |-------|--------|
   | **Subdomain** | `news` |
   | **Domain** | `losenachoschipi.fr` |
   | **Type** | `HTTP` |
   | **URL** | `mc-news:3000` ou `IP_DU_SERVEUR:3001` |

   **Note** : Si ton container est sur le même réseau Docker que cloudflared, utilise `mc-news:3000`. Sinon, utilise l'IP de ta machine Docker + le port externe `3001`.

6. Clique sur **Save hostname**

---

## Étape 5 : Vérifier le déploiement

1. Attends quelques minutes que le DNS se propage

2. Teste l'accès :
   - **API Health** : `https://news.losenachoschipi.fr/api/health`
   - **Interface admin** : `https://news.losenachoschipi.fr`

3. Connecte-toi avec tes identifiants admin

---

## Configuration réseau (Si cloudflared est dans Docker)

Si ton tunnel Cloudflare tourne aussi dans Docker, tu dois connecter les deux containers au même réseau.

### Option 1 : Ajouter mc-news au réseau de cloudflared

Modifie le `docker-compose.yml` :

```yaml
networks:
  mc-news-network:
    name: mc-news-network
  cloudflared-network:
    external: true
    name: NOM_DU_RESEAU_CLOUDFLARED  # Remplace par le vrai nom

services:
  mc-news:
    # ... reste de la config ...
    networks:
      - mc-news-network
      - cloudflared-network
```

### Option 2 : Via Portainer

1. Va dans **Containers** > **mc-news**
2. Dans **Network**, connecte le container au réseau de cloudflared

---

## Mise à jour du service

### Si déployé via Git Repository

1. Push tes changements sur GitHub
2. Dans Portainer, va dans ta stack
3. Clique sur **Pull and redeploy**

### Si déployé manuellement

1. Dans Portainer, va dans ta stack
2. Modifie si nécessaire
3. Clique sur **Update the stack** avec **Re-pull image** coché

---

## Dépannage

### Le container ne démarre pas

Vérifie les logs dans Portainer : **Containers** > **mc-news** > **Logs**

### Erreur "Cannot connect to database"

Le volume de données n'est peut-être pas correctement monté. Vérifie les permissions.

### Cloudflare affiche "502 Bad Gateway"

- Vérifie que le container est bien en cours d'exécution
- Vérifie que l'URL dans le tunnel pointe vers la bonne adresse
- Teste localement : `curl http://localhost:3001/api/health`

### Les images uploadées disparaissent

Vérifie que le volume `mc-news-uploads` est bien persisté.

---

## Architecture finale

```
Internet
    │
    ▼
Cloudflare (news.losenachoschipi.fr)
    │
    ▼ (Tunnel chiffré)
    │
cloudflared (sur ton serveur)
    │
    ▼
mc-news container (port 3000)
    │
    ├── API Express (Node.js)
    ├── Interface Admin (React)
    ├── Base de données (SQLite)
    └── Uploads (images/vidéos)
```

---

## Sécurité

- Le mot de passe admin est hashé avec bcrypt
- Les JWT expirent automatiquement
- Le tunnel Cloudflare chiffre tout le trafic
- Le container tourne avec un utilisateur non-root
