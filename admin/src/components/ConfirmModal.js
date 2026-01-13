import React from 'react'
import './ConfirmModal.css'

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-modal-cancel">
            <i className="fas fa-times"></i>
            Annuler
          </button>
          <button onClick={onConfirm} className="btn-modal-confirm">
            <i className="fas fa-check"></i>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
