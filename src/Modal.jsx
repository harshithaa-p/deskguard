import { useState } from 'react'

export default function Modal({ desk, onCheckIn, onClose }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    onCheckIn(desk, name.trim())
  }

  const border = 'rgba(139,92,246,0.2)'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#101010', border: `1px solid ${border}`, borderRadius: '14px', padding: '28px', width: '340px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Check In</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>✕</button>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Desk {desk.id}</h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Zone {desk.zone === 'alpha' ? 'Alpha – Quiet Study' : desk.zone === 'beta' ? 'Beta – Collaboration' : 'Gamma – Focus Pods'}
          </p>
        </div>

        {/* Info pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[['⏱ 2hr session limit', '#8b5cf6'], ['⏸ 20min away limit', '#f59e0b'], ['📶 WiFi included', '#22c55e']].map(([text, color]) => (
            <span key={text} style={{ fontSize: '11px', color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '99px', padding: '3px 10px', fontWeight: 600 }}>
              {text}
            </span>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
            Your Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="e.g. Rahul Sharma"
            style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? '#ef4444' : border}`, borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
          />
          {error && <div style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.15)', color: '#22c55e', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              ✓ Confirm Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}