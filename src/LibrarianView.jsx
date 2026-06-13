function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const STATUS_PILL = {
  occupied: { label: 'Occupied', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  away:     { label: 'Away',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  free:     { label: 'Available',color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
}

const ZONE_META = {
  alpha: { label: 'Alpha', color: '#8b5cf6' },
  beta:  { label: 'Beta',  color: '#06b6d4' },
  gamma: { label: 'Gamma', color: '#f59e0b' },
}

function Avatar({ name }) {
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colors = [
    'linear-gradient(135deg,#7c3aed,#4f46e5)',
    'linear-gradient(135deg,#0891b2,#0e7490)',
    'linear-gradient(135deg,#b45309,#92400e)',
    'linear-gradient(135deg,#be185d,#9d174d)',
    'linear-gradient(135deg,#047857,#065f46)',
  ]
  const idx = name?.charCodeAt(0) % colors.length || 0
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function LibrarianView({ desks, now, onForceRelease }) {
  const border  = 'rgba(139,92,246,0.15)'
  const surface = 'rgba(255,255,255,0.03)'

  const available = desks.filter(d => d.status === 'free').length
  const occupied  = desks.filter(d => d.status === 'occupied').length
  const away      = desks.filter(d => d.status === 'away').length
  const abandoned = desks.filter(d => d.status === 'away' && d.awayAt && (now - d.awayAt) > 18 * 60 * 1000).length

  const activeSessions = desks.filter(d => d.status !== 'free')

  const stats = [
    { label: 'Available', value: available, color: '#22c55e', icon: '✓' },
    { label: 'Occupied',  value: occupied,  color: '#ef4444', icon: '⊗' },
    { label: 'Away',      value: away,      color: '#f59e0b', icon: '⏸' },
    { label: '⚠ Abandoned', value: abandoned, color: '#f87171', icon: '!' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Librarian Dashboard</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Real-time overview · All zones · {desks.length} total desks</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color, opacity: 0.6, borderRadius: '10px 10px 0 0' }} />
            <div style={{ fontSize: '32px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active sessions table */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Active Sessions</span>
          <span style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '99px' }}>{activeSessions.length} sessions</span>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px', gap: '12px', padding: '10px 20px', borderBottom: `1px solid ${border}`, fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          <span>Student</span>
          <span>Desk</span>
          <span>Zone</span>
          <span>Status</span>
          <span>Duration</span>
          <span>Action</span>
        </div>

        {activeSessions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
            No active sessions right now
          </div>
        ) : (
          activeSessions.map(desk => {
            const pill    = STATUS_PILL[desk.status] || STATUS_PILL.free
            const zone    = ZONE_META[desk.zone]
            const duration = desk.checkedInAt ? fmt(now - desk.checkedInAt) : '--'
            const isAbandoned = desk.status === 'away' && desk.awayAt && (now - desk.awayAt) > 18 * 60 * 1000

            return (
              <div key={desk.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px', gap: '12px', padding: '14px 20px', borderBottom: `1px solid ${border}`, alignItems: 'center', background: isAbandoned ? 'rgba(239,68,68,0.04)' : 'transparent', transition: 'background 0.2s' }}>
                {/* Student */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar name={desk.studentName} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{desk.studentName}</div>
                    {isAbandoned && <div style={{ fontSize: '10px', color: '#f87171', fontWeight: 700 }}>⚠ Possibly abandoned</div>}
                  </div>
                </div>

                {/* Desk */}
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#f1f5f9' }}>{desk.id}</div>

                {/* Zone */}
                <div>
                  <span style={{ color: zone?.color, fontSize: '12px', fontWeight: 600 }}>{zone?.label || desk.zone}</span>
                </div>

                {/* Status */}
                <div>
                  <span style={{ background: pill.bg, color: pill.color, border: `1px solid ${pill.border}`, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
                    {pill.label}
                  </span>
                </div>

                {/* Duration */}
                <div style={{ fontSize: '13px', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{duration}</div>

                {/* Force release */}
                <button
                  onClick={() => onForceRelease(desk.id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.18)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.08)'}
                >
                  Force Release
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}