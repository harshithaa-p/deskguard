import { useState } from 'react'

function Modal({ desk, onClose, onAction }) {
  const [name, setName] = useState('')

  if (!desk) return null

  function handleCheckIn() {
    if (!name.trim()) return
    onAction(desk.id, 'occupy', name.trim())
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#131720',
          border: '1px solid #1e2535',
          borderRadius: '16px',
          padding: '32px',
          width: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <p style={{ fontSize: '12px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Desk
          </p>
          <h2 style={{ fontSize: '28px', color: '#f8fafc', fontWeight: '700' }}>
            {desk.id}
          </h2>
          <p style={{
            fontSize: '13px',
            marginTop: '6px',
            fontWeight: '500',
            textTransform: 'capitalize',
            color: desk.status === 'free' ? '#22c55e' : desk.status === 'occupied' ? '#ef4444' : '#f59e0b',
          }}>
            {desk.status}
          </p>
        </div>

        <div style={{ borderTop: '1px solid #1e2535' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {desk.status === 'free' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Your Name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCheckIn()}
                  placeholder="e.g. Harshithaa"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #1e2535',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                {name.trim() === '' && (
                  <p style={{ fontSize: '11px', color: '#475569' }}>Name required to check in</p>
                )}
              </div>

              <button
                onClick={handleCheckIn}
                disabled={!name.trim()}
                style={{
                  background: name.trim() ? '#166534' : '#1a2a1a',
                  border: `1px solid ${name.trim() ? '#22c55e' : '#2a3a2a'}`,
                  color: name.trim() ? '#f8fafc' : '#4a5a4a',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Check In
              </button>
            </>
          )}

          {desk.status === 'occupied' && (
            <>
              <div style={{
                background: '#0f1117',
                border: '1px solid #1e2535',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                color: '#94a3b8',
              }}>
                Occupied by <span style={{ color: '#f8fafc', fontWeight: '600' }}>{desk.studentName}</span>
              </div>

              <button
                onClick={() => onAction(desk.id, 'away')}
                style={{
                  background: '#78350f',
                  border: '1px solid #f59e0b',
                  color: '#f8fafc',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Mark Away
              </button>

              <button
                onClick={() => onAction(desk.id, 'release')}
                style={{
                  background: '#1e2535',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Release Desk
              </button>
            </>
          )}

          {desk.status === 'away' && (
            <>
              <div style={{
                background: '#0f1117',
                border: '1px solid #1e2535',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                color: '#94a3b8',
              }}>
                <span style={{ color: '#f8fafc', fontWeight: '600' }}>{desk.studentName}</span> is away
              </div>

              <button
                onClick={() => onAction(desk.id, 'release')}
                style={{
                  background: '#1e2535',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Release Desk
              </button>
            </>
          )}

        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#475569',
            fontSize: '13px',
            marginTop: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

      </div>
    </div>
  )
}

export default Modal