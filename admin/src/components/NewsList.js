import React from 'react'
import './NewsList.css'

function NewsList({ news, onEdit, onDelete }) {
  const getTypeInfo = (type) => {
    const types = {
      update: { label: 'Mise à jour', icon: 'fa-arrow-up', color: '#4CAF50' },
      event: { label: 'Événement', icon: 'fa-star', color: '#FFD700' },
      reset: { label: 'Reset', icon: 'fa-sync-alt', color: '#FF5722' },
      maintenance: { label: 'Maintenance', icon: 'fa-wrench', color: '#2196F3' },
      info: { label: 'Info', icon: 'fa-bell', color: '#9E9E9E' }
    }
    return types[type] || types.info
  }

  if (news.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-inbox"></i>
        <h3>Aucune actualité</h3>
        <p>Cliquez sur "Nouvelle actualité" pour en créer une</p>
      </div>
    )
  }

  return (
    <div className="news-list">
      {news.map((item) => {
        const typeInfo = getTypeInfo(item.type)

        return (
          <div key={item.id} className="news-card">
            <div className="news-card-header">
              <div className="news-type-badge" style={{ backgroundColor: typeInfo.color }}>
                <i className={`fas ${typeInfo.icon}`}></i>
                {typeInfo.label}
              </div>
              <div className="news-date">
                <i className="fas fa-calendar"></i>
                {item.date}
              </div>
              {item.isNew && (
                <div className="news-new-badge">
                  <i className="fas fa-star"></i>
                  Nouveau
                </div>
              )}
            </div>

            <h3 className="news-title">{item.title}</h3>
            <p className="news-description">{item.description}</p>

            <div className="news-preview">
              <div dangerouslySetInnerHTML={{ __html: item.fullDescription }} />
            </div>

            <div className="news-card-footer">
              <div className="news-meta">
                <span>
                  <i className="fas fa-clock"></i>
                  Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <span>ID: {item.id}</span>
              </div>
              <div className="news-actions">
                <button
                  onClick={() => onEdit(item)}
                  className="btn-edit"
                  title="Modifier"
                >
                  <i className="fas fa-edit"></i>
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="btn-delete"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NewsList
