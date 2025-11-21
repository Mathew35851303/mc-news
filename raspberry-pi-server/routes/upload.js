const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '..', 'uploads', 'news-images')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour l'image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, 'news-' + uniqueSuffix + ext)
  }
})

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.'), false)
  }
}

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
})

// Route d'upload (protégée par authentification)
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' })
    }

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/news-images/${req.file.filename}`

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Erreur upload:', error)
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' })
  }
})

// Route pour supprimer une image (protégée par authentification)
router.delete('/:filename', verifyToken, (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(uploadsDir, filename)

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' })
    }

    // Supprimer le fichier
    fs.unlinkSync(filePath)

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    })
  } catch (error) {
    console.error('Erreur suppression:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' })
  }
})

module.exports = router
