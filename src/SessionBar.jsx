import { useState, useEffect } from 'react'

function getElapsed(timestamp) {
  if (!timestamp) return '0m 0s'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s < 10 ? '0' : ''}${s}s`
}

function SessionBar({ session, onAway, onRelease }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!session) return
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [session])

  if (!session) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#131720',
      borderTop: '1px solid #1e2535',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>

      {/* Left — session info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Your Desk
          </p>
          <p style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', lineHeight: 1.2 }}>
            {session.id}
          </p>
        </div>

        <div style={{ width: '1px', height: '32px', background: '#1e2535' }} />

        <div>
          <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Checked in as
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>
            {session.studentName}
          </p>
        </div>

        <div style={{ width: '1px', height: '32px', background: '#1e2535' }} />

        <div>
          <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Time at desk
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e', fontVariantNumeric: 'tabular-nums' }}>
            {getElapsed(session.checkedInAt)}
          </p>
        </div>

        {session.status === 'away' && (
          <>
            <div style={{ width: '1px', height: '32px', background: '#1e2535' }} />
            <div>
              <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Away status
              </p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>
                You are marked away
              </p>
            </div>
          </>
        )}
      </div>

      {/* Right — actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {session.status === 'occupied' && (
          <button
            onClick={onAway}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #f59e0b',
              background: '#78350f',
              color: '#f8fafc',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Step Away
          </button>
        )}

        <button
          onClick={onRelease}
          style={{
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: '#1e2535',
            color: '#94a3b8',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Release Desk
        </button>
      </div>

    </div>
  )
}

export default SessionBar