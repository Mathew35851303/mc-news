import React, { useState, useEffect, useRef } from 'react'
import './NewsForm.css'

function NewsForm({ newsData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'info',
    isNew: true,
    fullDescription: '',
    headerImage: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title || '',
        description: newsData.description || '',
        type: newsData.type || 'info',
        isNew: newsData.isNew !== undefined ? newsData.isNew : true,
        fullDescription: newsData.fullDescription || '',
        headerImage: newsData.headerImage || ''
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

  const uploadImage = async (file) => {
    if (!file) return

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.')
      return
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop volumineux. Taille maximale : 5MB')
      return
    }

    setUploadingImage(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload')
      }

      const result = await response.json()

      // Construire l'URL complète de l'image
      const imageUrl = `${window.location.origin}${result.url}`

      // Mettre à jour l'URL de l'image
      setFormData(prev => ({
        ...prev,
        headerImage: imageUrl
      }))

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0])
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      headerImage: ''
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

        <div className="form-group">
          <label>
            <i className="fas fa-image"></i>
            Image d'en-tête
          </label>

          {!formData.headerImage ? (
            <div
              className={`image-upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              {uploadingImage ? (
                <div className="upload-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Upload en cours...</p>
                </div>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Glissez une image ici ou cliquez pour sélectionner</p>
                  <small>JPG, PNG, GIF ou WebP - Max 5MB</small>
                </>
              )}
            </div>
          ) : (
            <div className="image-preview">
              <img src={formData.headerImage} alt="Aperçu" onError={(e) => e.target.style.display = 'none'} />
              <button
                type="button"
                className="btn-remove-image"
                onClick={removeImage}
                title="Supprimer l'image"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <small>
            <i className="fas fa-info-circle"></i>
            Optionnel - Une image sera affichée en haut de l'actualité
          </small>
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
