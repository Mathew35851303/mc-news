const express = require('express')
const router = express.Router()
const { dbHelpers } = require('../database')
const { verifyToken } = require('../middleware/auth')

// GET /api/news - Récupérer toutes les actualités (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const news = await dbHelpers.getAllNews()
    console.log(`[API] GET /api/news - ${news.length} actualités retournées`)
    res.json(news)
  } catch (error) {
    console.error('[API] Erreur GET /api/news:', error.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/news/:id - Récupérer une actualité par ID (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const news = await dbHelpers.getNewsById(req.params.id)

    if (!news) {
      return res.status(404).json({ error: 'Actualité non trouvée' })
    }

    console.log(`[API] GET /api/news/${req.params.id} - Actualité trouvée`)
    res.json(news)
  } catch (error) {
    console.error('[API] Erreur GET /api/news/:id:', error.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/news - Créer une actualité (PROTÉGÉ)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, type, fullDescription, isNew, headerImage } = req.body

    // Validation
    if (!title || !description || !type || !fullDescription) {
      return res.status(400).json({
        error: 'Champs manquants',
        required: ['title', 'description', 'type', 'fullDescription']
      })
    }

    // Types valides
    const validTypes = ['update', 'event', 'reset', 'maintenance', 'info']
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Type invalide',
        validTypes
      })
    }

    // Créer l'actualité avec date actuelle
    const newsData = {
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      title,
      description,
      type,
      isNew: isNew !== undefined ? isNew : true,
      fullDescription,
      headerImage: headerImage || null
    }

    const created = await dbHelpers.createNews(newsData)
    console.log(`[API] POST /api/news - Actualité créée (ID: ${created.id})`)
    res.status(201).json(created)

  } catch (error) {
    console.error('[API] Erreur POST /api/news:', error.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/news/:id - Mettre à jour une actualité (PROTÉGÉ)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, type, fullDescription, isNew, date, headerImage } = req.body

    // Validation
    if (!title || !description || !type || !fullDescription) {
      return res.status(400).json({
        error: 'Champs manquants',
        required: ['title', 'description', 'type', 'fullDescription']
      })
    }

    // Types valides
    const validTypes = ['update', 'event', 'reset', 'maintenance', 'info']
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Type invalide',
        validTypes
      })
    }

    const newsData = {
      date: date || new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      title,
      description,
      type,
      isNew: isNew !== undefined ? isNew : true,
      fullDescription,
      headerImage: headerImage || null
    }

    const updated = await dbHelpers.updateNews(req.params.id, newsData)
    console.log(`[API] PUT /api/news/${req.params.id} - Actualité mise à jour`)
    res.json(updated)

  } catch (error) {
    console.error('[API] Erreur PUT /api/news/:id:', error.message)

    if (error.message === 'Actualité non trouvée') {
      return res.status(404).json({ error: error.message })
    }

    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/news/:id - Supprimer une actualité (PROTÉGÉ)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await dbHelpers.deleteNews(req.params.id)
    console.log(`[API] DELETE /api/news/${req.params.id} - Actualité supprimée`)
    res.status(204).send()

  } catch (error) {
    console.error('[API] Erreur DELETE /api/news/:id:', error.message)

    if (error.message === 'Actualité non trouvée') {
      return res.status(404).json({ error: error.message })
    }

    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router
