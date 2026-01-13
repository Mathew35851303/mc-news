import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsForm from '../components/NewsForm'
import NewsList from '../components/NewsList'
import Notification from '../components/Notification'
import ConfirmModal from '../components/ConfirmModal'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [notification, setNotification] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  // Charger les actualités au montage
  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/news')
      setNews(response.data)
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement des actualités')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const handleCreateNews = async (newsData) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.post('/api/news', newsData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      await loadNews()
      setShowForm(false)
      showNotification('✅ Actualité créée avec succès !', 'success')
    } catch (err) {
      showNotification('❌ Erreur lors de la création: ' + (err.response?.data?.error || err.message), 'error')
    }
  }

  const handleUpdateNews = async (newsData) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(`/api/news/${editingNews.id}`, newsData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      await loadNews()
      setEditingNews(null)
      setShowForm(false)
      showNotification('✅ Actualité mise à jour avec succès !', 'success')
    } catch (err) {
      showNotification('❌ Erreur lors de la mise à jour: ' + (err.response?.data?.error || err.message), 'error')
    }
  }

  const handleDeleteNews = (id) => {
    setDeleteModal(id)
  }

  const confirmDelete = async () => {
    const id = deleteModal
    setDeleteModal(null)

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      await loadNews()
      showNotification('✅ Actualité supprimée avec succès !', 'success')
    } catch (err) {
      showNotification('❌ Erreur lors de la suppression: ' + (err.response?.data?.error || err.message), 'error')
    }
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingNews(null)
  }

  const handleNewNews = () => {
    setEditingNews(null)
    setShowForm(true)
  }

  return (
    <div className="dashboard">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModal && (
        <ConfirmModal
          title="Supprimer l'actualité"
          message="Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <i className="fas fa-newspaper"></i>
          <h1>Gestion des Actualités</h1>
        </div>
        <div className="header-right">
          <button onClick={loadNews} className="btn-refresh" title="Actualiser">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button onClick={onLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="dashboard-content">
        {error && (
          <div className="error-banner">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {!showForm ? (
          <>
            {/* Stats */}
            <div className="stats-bar">
              <div className="stat-item">
                <i className="fas fa-newspaper"></i>
                <div>
                  <span className="stat-value">{news.length}</span>
                  <span className="stat-label">Actualités</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-star"></i>
                <div>
                  <span className="stat-value">{news.filter(n => n.isNew).length}</span>
                  <span className="stat-label">Nouvelles</span>
                </div>
              </div>
              <button onClick={handleNewNews} className="btn-new-news">
                <i className="fas fa-plus"></i>
                Nouvelle actualité
              </button>
            </div>

            {/* Liste des actualités */}
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Chargement...</p>
              </div>
            ) : (
              <NewsList
                news={news}
                onEdit={handleEdit}
                onDelete={handleDeleteNews}
              />
            )}
          </>
        ) : (
          <NewsForm
            newsData={editingNews}
            onSubmit={editingNews ? handleUpdateNews : handleCreateNews}
            onCancel={handleCancelForm}
            onNotification={showNotification}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
