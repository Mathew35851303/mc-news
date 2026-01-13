import React, { useEffect } from 'react'
import './Notification.css'

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000) // Fermer après 4 secondes

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle'
      case 'error':
        return 'fa-exclamation-circle'
      case 'warning':
        return 'fa-exclamation-triangle'
      default:
        return 'fa-info-circle'
    }
  }

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <i className={`fas ${getIcon()}`}></i>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="notification-close">
        <i className="fas fa-times"></i>
      </button>
    </div>
  )
}

export default Notification
