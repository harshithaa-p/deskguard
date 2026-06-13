import { useEffect } from 'react'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!message) return null

  const colors = {
    success: { bg: '#166534', border: '#22c55e' },
    warning: { bg: '#78350f', border: '#f59e0b' },
    info:    { bg: '#1e3a5f', border: '#3b82f6' },
  }

  const c = colors[type] || colors.info

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '10px',
      padding: '14px 20px',
      fontSize: '13px',
      color: '#f8fafc',
      fontWeight: '500',
      zIndex: 999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.2s ease',
    }}>
      {message}
    </div>
  )
}

export default Toast