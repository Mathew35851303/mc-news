require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcryptjs')
const { generateToken } = require('./middleware/auth')
const newsRoutes = require('./routes/news')
const uploadRoutes = require('./routes/upload')
const { dbHelpers } = require('./database')

const app = express()
const PORT = process.env.PORT || 3000

// Mot de passe admin (à changer dans .env)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10)

// Middleware
app.use(cors()) // Autoriser toutes les origines (à restreindre en production si besoin)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'admin', 'build'))) // Servir l'interface React
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // Servir les images uploadées

// Logger basique
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Routes API
app.use('/api/news', newsRoutes)
app.use('/api/upload', uploadRoutes)

// Route de login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' })
    }

    // Vérifier les credentials
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    // Générer le token
    const token = generateToken(username)

    console.log(`[AUTH] Login réussi pour ${username}`)
    res.json({
      token,
      username,
      message: 'Connexion réussie'
    })

  } catch (error) {
    console.error('[AUTH] Erreur login:', error.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour vérifier si le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Serveur d\'actualités opérationnel',
    timestamp: new Date().toISOString()
  })
})

// Servir l'interface React pour toutes les autres routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'build', 'index.html'))
})

// Fonction pour nettoyer les vieilles actualités
async function cleanupOldNews() {
  try {
    const result = await dbHelpers.deleteOldNews()
    if (result.deleted > 0) {
      console.log(`[CLEANUP] ${result.deleted} actualité(s) de plus d'1 mois supprimée(s)`)
    }
  } catch (error) {
    console.error('[CLEANUP] Erreur lors du nettoyage des actualités:', error.message)
  }
}

// Exécuter le nettoyage toutes les 24 heures
setInterval(cleanupOldNews, 24 * 60 * 60 * 1000)

// Exécuter le nettoyage au démarrage
cleanupOldNews()

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Serveur d'actualités démarré !    ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                           ║
║   URL: http://localhost:${PORT}          ║
║   API: http://localhost:${PORT}/api      ║
╚════════════════════════════════════════╝

📝 Routes disponibles:
  GET    /api/health        - Statut du serveur
  POST   /api/login         - Connexion admin
  GET    /api/news          - Liste des actualités
  POST   /api/news          - Créer une actualité (protégé)
  PUT    /api/news/:id      - Modifier une actualité (protégé)
  DELETE /api/news/:id      - Supprimer une actualité (protégé)
  POST   /api/upload        - Upload d'image (protégé)
  DELETE /api/upload/:id    - Supprimer une image (protégé)

🔐 Credentials par défaut:
  Username: ${ADMIN_USERNAME}
  Password: admin123
  ⚠️  CHANGEZ LE MOT DE PASSE EN PRODUCTION !

🗑️  Nettoyage automatique: Actualités > 1 mois supprimées tous les jours
`)
})
