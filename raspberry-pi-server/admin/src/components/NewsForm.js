import React, { useState, useEffect, useRef } from 'react'
import './NewsForm.css'

function NewsForm({ newsData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'info',
    isNew: true,
    fullDescription: ''
  })
  const editorRef = useRef(null)

  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title || '',
        description: newsData.description || '',
        type: newsData.type || 'info',
        isNew: newsData.isNew !== undefined ? newsData.isNew : true,
        fullDescription: newsData.fullDescription || ''
      })
      // Mettre à jour l'éditeur UNIQUEMENT lors du chargement initial
      if (editorRef.current && newsData.fullDescription) {
        editorRef.current.innerHTML = newsData.fullDescription
      }
    }
  }, [newsData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditorInput = (e) => {
    setFormData(prev => ({
      ...prev,
      fullDescription: e.target.innerHTML
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current.focus()
  }

  const insertHTMLTemplate = () => {
    const template = `<p>Votre contenu ici...</p>

<h3>Section 1</h3>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
  <li>Point 3</li>
</ul>

<h3>Section 2</h3>
<p><strong>Texte en gras</strong> et texte normal.</p>`

    setFormData(prev => ({
      ...prev,
      fullDescription: template
    }))
    if (editorRef.current) {
      editorRef.current.innerHTML = template
    }
  }

  return (
    <div className="news-form-container">
      <div className="form-header">
        <h2>
          <i className={`fas ${newsData ? 'fa-edit' : 'fa-plus'}`}></i>
          {newsData ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
        </h2>
        <button onClick={onCancel} className="btn-close" title="Fermer">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              <i className="fas fa-heading"></i>
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Nouvelle mise à jour disponible"
              maxLength={100}
              required
            />
            <small>{formData.title.length}/100 caractères</small>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i>
              Type *
            </label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="update">🔼 Mise à jour</option>
              <option value="event">⭐ Événement</option>
              <option value="reset">🔄 Reset</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="info">🔔 Info</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-align-left"></i>
            Description courte *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Ajout de nouveaux mods et amélioration des performances"
            maxLength={150}
            required
          />
          <small>{formData.description.length}/150 caractères</small>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
            />
            <span>
              <i className="fas fa-star"></i>
              Marquer comme "Nouveau"
            </span>
          </label>
        </div>

        <div className="form-group">
          <div className="label-with-actions">
            <label>
              <i className="fas fa-align-left"></i>
              Contenu complet *
            </label>
            <button
              type="button"
              onClick={insertHTMLTemplate}
              className="btn-template"
              title="Insérer un template"
            >
              <i className="fas fa-file-code"></i>
              Template
            </button>
          </div>

          {/* Barre d'outils de formatage */}
          <div className="editor-toolbar">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="toolbar-btn"
              title="Gras"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="toolbar-btn"
              title="Italique"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="toolbar-btn"
              title="Souligné"
            >
              <i className="fas fa-underline"></i>
            </button>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'h3')}
              className="toolbar-btn"
              title="Titre"
            >
              <i className="fas fa-heading"></i>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'p')}
              className="toolbar-btn"
              title="Paragraphe"
            >
              <i className="fas fa-paragraph"></i>
            </button>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="toolbar-btn"
              title="Liste à puces"
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="toolbar-btn"
              title="Liste numérotée"
            >
              <i className="fas fa-list-ol"></i>
            </button>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              onClick={() => executeCommand('removeFormat')}
              className="toolbar-btn"
              title="Supprimer la mise en forme"
            >
              <i className="fas fa-eraser"></i>
            </button>
          </div>

          {/* Éditeur WYSIWYG */}
          <div
            ref={editorRef}
            contentEditable
            className="wysiwyg-editor"
            onInput={handleEditorInput}
            suppressContentEditableWarning
            data-placeholder="Commencez à écrire votre contenu ici..."
          />

          <small>
            <i className="fas fa-info-circle"></i>
            Utilisez les boutons ci-dessus pour formater votre texte
          </small>
        </div>

        {/* Preview */}
        {formData.fullDescription && (
          <div className="preview-section">
            <h3>
              <i className="fas fa-eye"></i>
              Aperçu
            </h3>
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: formData.fullDescription }} />
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            <i className="fas fa-times"></i>
            Annuler
          </button>
          <button type="submit" className="btn-submit">
            <i className={`fas ${newsData ? 'fa-save' : 'fa-plus'}`}></i>
            {newsData ? 'Mettre à jour' : 'Créer l\'actualité'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewsForm
