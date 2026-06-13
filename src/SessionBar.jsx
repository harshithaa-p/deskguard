import { QRCodeSVG } from 'qrcode.react'
const SESSION_LIMIT = 2 * 60 * 60 * 1000


function fmt(ms) {
  const s = Math.floor(Math.abs(ms) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}



function QRCode({ deskId }) {
  const url = `${window.location.origin}/checkin?desk=${deskId}`
  return (
    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
      <QRCodeSVG value={url} size={100} bgColor="#ffffff" fgColor="#080808" level="H" />
    </div>
  )
}

export default function RightPanel({ mySession, desks, now, available, occupied, away, onStillHere, onStepAway, onRelease }) {
  const border = 'rgba(139,92,246,0.15)'
  const panel  = '#101010'

  const elapsed   = mySession ? now - mySession.checkedInAt : 0
  const remaining = SESSION_LIMIT - elapsed
  const healthPct = Math.min(100, (elapsed / SESSION_LIMIT) * 100)
  const healthColor = healthPct < 60 ? '#22c55e' : healthPct < 85 ? '#f59e0b' : '#ef4444'

  const myDesk = mySession ? desks.find(d => d.id === mySession.deskId) : null
  const zoneLabel = myDesk?.zone === 'alpha' ? 'Alpha – Quiet Study'
    : myDesk?.zone === 'beta'  ? 'Beta – Collaboration'
    : myDesk?.zone === 'gamma' ? 'Gamma – Focus Pods' : ''

  const initials = mySession?.studentName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || '?'

  return (
    
    <aside style={{ width: '280px', background: panel, borderLeft: `1px solid ${border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>

      {/* Active session header */}
      <div style={{ padding: '16px', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: mySession ? '#22c55e' : '#334155', display: 'inline-block', boxShadow: mySession ? '0 0 6px #22c55e' : 'none' }} />
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Session</span>
          </div>
          {mySession && (
            <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>LIVE</span>
          )}
        </div>

        {mySession ? (
          <>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {fmt(elapsed)}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Session elapsed · Desk {mySession.deskId}</div>

            {/* Student info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${border}` }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{mySession.studentName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Student · #{Math.abs(mySession.checkedInAt % 1000000).toString().slice(0,8)}</div>
              </div>
            </div>

            {/* Session details */}
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              {[
                ['Zone', zoneLabel],
                ['Check-in', new Date(mySession.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
                ['Limit', '2h 00m'],
                ['Remaining', remaining > 0 ? fmt(remaining) : 'Expired'],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: `1px solid ${border}` }}>
                  <div style={{ color: '#64748b', marginBottom: '2px' }}>{label}</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Health bar */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                <span style={{ color: '#94a3b8' }}>Session Health</span>
                <span style={{ color: healthColor, fontWeight: 600 }}>{Math.round(100 - healthPct)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${100 - healthPct}%`, background: healthColor, borderRadius: '99px', transition: 'width 1s linear, background 0.5s' }} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: '#334155', fontSize: '13px', marginTop: '8px' }}>No active session. Tap a desk to check in.</div>
        )}
      </div>

      {/* Session controls */}
      {mySession && (
        <div style={{ padding: '16px', borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Session Controls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={onStillHere} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ✓ Still Here
            </button>
            <button onClick={onStepAway} disabled={mySession.status === 'away'} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, background: 'rgba(255,255,255,0.05)', color: mySession.status === 'away' ? '#475569' : '#f1f5f9', fontWeight: 600, cursor: mySession.status === 'away' ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ⏸ Step Away {mySession.status === 'away' ? '(Active)' : ''}
            </button>
            <button onClick={onRelease} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 600, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ✕ Release Desk
            </button>
          </div>
        </div>
      )}

      {/* QR code */}
      {mySession && (
        <div style={{ padding: '16px', borderBottom: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, alignSelf: 'flex-start' }}>Desk QR Code · {mySession.deskId}</div>
          <QRCode deskId={mySession.deskId} />
        </div>
      )}

      {/* Floor diagnostics */}
      <div style={{ padding: '16px', marginTop: 'auto' }}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Floor Diagnostics</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Available', value: available, color: '#22c55e' },
            { label: 'Occupied',  value: occupied,  color: '#ef4444' },
            { label: 'Away',      value: away,       color: '#f59e0b' },
            { label: 'Total',     value: desks.length, color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: `1px solid ${border}`, textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}