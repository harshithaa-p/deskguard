import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function getElapsed(timestamp) {
  if (!timestamp) return '—'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function getAwayCountdown(awayAt) {
  if (!awayAt) return '—'
  const remaining = 20 * 60 - Math.floor((Date.now() - awayAt) / 1000)
  if (remaining <= 0) return 'Expired'
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return `${m}m ${s < 10 ? '0' : ''}${s}s`
}

function LibrarianView({ desks, onForceRelease }) {
  const [, setTick] = useState(0)
  const [sortBy, setSortBy] = useState('status')
  const [qrDesk, setQrDesk] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const activeSessions = desks
    .filter(d => d.status !== 'free')
    .sort((a, b) => {
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      if (sortBy === 'desk') return a.id.localeCompare(b.id)
      if (sortBy === 'duration') return (a.checkedInAt || 0) - (b.checkedInAt || 0)
      return 0
    })

  const total    = desks.length
  const occupied = desks.filter(d => d.status === 'occupied').length
  const away     = desks.filter(d => d.status === 'away').length
  const free     = desks.filter(d => d.status === 'free').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {[
          { label: 'Total Desks', value: total,    color: '#94a3b8' },
          { label: 'Occupied',    value: occupied,  color: '#ef4444' },
          { label: 'Away',        value: away,      color: '#f59e0b' },
          { label: 'Free',        value: free,      color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#131720',
            border: '1px solid #1e2535',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {s.label}
            </span>
            <span style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#131720',
        border: '1px solid #1e2535',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>

        {/* Table Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #1e2535',
        }}>
          <h2 style={{ fontSize: '15px', color: '#f8fafc' }}>Active Sessions</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['desk', 'status', 'duration'].map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #1e2535',
                  background: sortBy === s ? '#1e2535' : 'transparent',
                  color: sortBy === s ? '#f8fafc' : '#475569',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Column Labels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 1fr 1fr 160px',
          padding: '10px 24px',
          borderBottom: '1px solid #1e2535',
          background: '#0f1117',
        }}>
          {['Desk', 'Student', 'Duration', 'Away Timer', 'Action'].map(col => (
            <span key={col} style={{
              fontSize: '11px',
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}>
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {activeSessions.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#334155',
            fontSize: '14px',
          }}>
            No active sessions — all desks are free
          </div>
        ) : (
          activeSessions.map((desk, i) => (
            <div
              key={desk.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr 1fr 160px',
                padding: '16px 24px',
                borderBottom: i < activeSessions.length - 1 ? '1px solid #1a2030' : 'none',
                alignItems: 'center',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a2030'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
                {desk.id}
              </span>

              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {desk.studentName || '—'}
              </span>

              <span style={{ fontSize: '13px', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                {getElapsed(desk.checkedInAt)}
              </span>

              <span style={{
                fontSize: '13px',
                color: desk.status === 'away'
                  ? getAwayCountdown(desk.awayAt) === 'Expired' ? '#ef4444' : '#f59e0b'
                  : '#334155',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {desk.status === 'away' ? getAwayCountdown(desk.awayAt) : '—'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  background: desk.status === 'occupied' ? '#7f1d1d' : '#78350f',
                  color: desk.status === 'occupied' ? '#ef4444' : '#f59e0b',
                  border: `1px solid ${desk.status === 'occupied' ? '#ef4444' : '#f59e0b'}`,
                }}>
                  {desk.status}
                </span>

                <button
                  onClick={() => onForceRelease(desk.id)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    background: 'transparent',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ef4444'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#334155'
                    e.currentTarget.style.color = '#64748b'
                  }}
                >
                  Release
                </button>

                <button
                  onClick={() => setQrDesk(desk.id)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    background: 'transparent',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                    e.currentTarget.style.color = '#3b82f6'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#334155'
                    e.currentTarget.style.color = '#64748b'
                  }}
                >
                  QR
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* QR Popup */}
      {qrDesk && (
        <div
          onClick={() => setQrDesk(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
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
              padding: '36px',
              width: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '11px',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>
                Desk QR Code
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>
                {qrDesk}
              </h2>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '12px',
            }}>
              <QRCodeSVG
                value={`${window.location.origin}/checkin?desk=${qrDesk}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#0f1117"
                level="H"
              />
            </div>

            <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center' }}>
              Place this QR code on the physical desk
            </p>

            <button
              onClick={() => setQrDesk(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#475569',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default LibrarianView