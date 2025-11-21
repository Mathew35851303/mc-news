const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Chemin de la base de données
const DB_PATH = path.join(__dirname, 'database', 'news.db')

// Créer ou ouvrir la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message)
  } else {
    console.log('✅ Connecté à la base de données SQLite')
  }
})

// Créer la table news si elle n'existe pas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      isNew INTEGER DEFAULT 1,
      fullDescription TEXT NOT NULL,
      headerImage TEXT,
      galleryImages TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur lors de la création de la table:', err.message)
    } else {
      console.log('✅ Table news créée ou déjà existante')
      // Ajouter la colonne headerImage si elle n'existe pas (migration)
      db.run(`ALTER TABLE news ADD COLUMN headerImage TEXT`, (alterErr) => {
        if (alterErr && !alterErr.message.includes('duplicate column')) {
          console.error('❌ Erreur lors de l\'ajout de la colonne headerImage:', alterErr.message)
        }
      })
      // Ajouter la colonne galleryImages si elle n'existe pas (migration)
      db.run(`ALTER TABLE news ADD COLUMN galleryImages TEXT`, (alterErr) => {
        if (alterErr && !alterErr.message.includes('duplicate column')) {
          console.error('❌ Erreur lors de l\'ajout de la colonne galleryImages:', alterErr.message)
        }
      })
    }
  })
})

// Fonctions helper pour les requêtes
const dbHelpers = {
  // Récupérer toutes les actualités
  getAllNews: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM news ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) reject(err)
        else {
          // Convertir isNew de 0/1 à boolean et galleryImages de JSON à tableau
          const news = rows.map(row => ({
            ...row,
            isNew: row.isNew === 1,
            galleryImages: row.galleryImages ? JSON.parse(row.galleryImages) : []
          }))
          resolve(news)
        }
      })
    })
  },

  // Récupérer une actualité par ID
  getNewsById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        else if (row) {
          resolve({
            ...row,
            isNew: row.isNew === 1,
            galleryImages: row.galleryImages ? JSON.parse(row.galleryImages) : []
          })
        } else {
          resolve(null)
        }
      })
    })
  },

  // Créer une nouvelle actualité
  createNews: (newsData) => {
    return new Promise((resolve, reject) => {
      const { date, title, description, type, isNew, fullDescription, headerImage, galleryImages } = newsData

      db.run(
        `INSERT INTO news (date, title, description, type, isNew, fullDescription, headerImage, galleryImages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [date, title, description, type, isNew ? 1 : 0, fullDescription, headerImage || null, galleryImages ? JSON.stringify(galleryImages) : null],
        function(err) {
          if (err) reject(err)
          else resolve({ id: this.lastID, ...newsData })
        }
      )
    })
  },

  // Mettre à jour une actualité
  updateNews: (id, newsData) => {
    return new Promise((resolve, reject) => {
      const { date, title, description, type, isNew, fullDescription, headerImage, galleryImages } = newsData

      db.run(
        `UPDATE news
         SET date = ?, title = ?, description = ?, type = ?, isNew = ?, fullDescription = ?, headerImage = ?, galleryImages = ?
         WHERE id = ?`,
        [date, title, description, type, isNew ? 1 : 0, fullDescription, headerImage || null, galleryImages ? JSON.stringify(galleryImages) : null, id],
        function(err) {
          if (err) reject(err)
          else if (this.changes === 0) reject(new Error('Actualité non trouvée'))
          else resolve({ id, ...newsData })
        }
      )
    })
  },

  // Supprimer une actualité
  deleteNews: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
        if (err) reject(err)
        else if (this.changes === 0) reject(new Error('Actualité non trouvée'))
        else resolve({ deleted: true, id })
      })
    })
  },

  // Supprimer les actualités de plus d'1 mois
  deleteOldNews: () => {
    return new Promise((resolve, reject) => {
      // Calculer la date d'il y a 1 mois
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      db.run(
        'DELETE FROM news WHERE createdAt < ?',
        [oneMonthAgo.toISOString()],
        function(err) {
          if (err) reject(err)
          else resolve({ deleted: this.changes })
        }
      )
    })
  }
}

module.exports = { db, dbHelpers }
