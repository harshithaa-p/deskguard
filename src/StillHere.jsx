import { useState, useEffect } from 'react'

function StillHere({ session, onConfirm, onExpire }) {
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (countdown <= 0) {
      onExpire()
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  if (!session) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#131720',
        border: '1px solid #1e2535',
        borderRadius: '16px',
        padding: '36px',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'center',
      }}>

        <div>
          <p style={{
            fontSize: '11px',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            Desk {session.id}
          </p>
          <h2 style={{ fontSize: '22px', color: '#f8fafc', fontWeight: '700' }}>
            Still here?
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            You've been at this desk for a while. Confirm you're still using it.
          </p>
        </div>

        <div style={{
          background: '#0f1117',
          border: '1px solid #1e2535',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <p style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
            Auto-releasing in
          </p>
          <p style={{
            fontSize: '36px',
            fontWeight: '700',
            color: countdown <= 10 ? '#ef4444' : '#f59e0b',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {countdown}s
          </p>
        </div>

        <button
          onClick={onConfirm}
          style={{
            background: '#166534',
            border: '1px solid #22c55e',
            color: '#f8fafc',
            padding: '14px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Yes, I'm here
        </button>

        <p style={{ fontSize: '12px', color: '#334155' }}>
          No response will automatically free your desk
        </p>

      </div>
    </div>
  )
}

export default StillHere