import { useState } from 'react'
import FloorMap from './FloorMap'

const AWAY_LIMIT = 20 * 60 * 1000

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function LaptopIcon({ color }) {
  return (
    <svg width="36" height="30" viewBox="0 0 36 30" fill="none">
      <rect x="2" y="2" width="32" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
      <rect x="5" y="5" width="26" height="14" rx="1" fill={color} opacity="0.2"/>
      <path d="M0 24h36" stroke={color} strokeWidth="1.5"/>
      <path d="M12 22h12l1.5 2H10.5L12 22z" fill={color} opacity="0.4"/>
    </svg>
  )
}

const ZONES = [
  { id: 'alpha', label: 'Zone Alpha – Quiet Study',  rows: ['A','B'], color: '#8b5cf6', bg: 'rgba(255,255,255,0.02)' },
  { id: 'beta',  label: 'Zone Beta – Collaboration', rows: ['C','D'], color: '#06b6d4', bg: 'rgba(255,255,255,0.02)' },
  { id: 'gamma', label: 'Zone Gamma – Focus Pods',   rows: ['E'],     color: '#f59e0b', bg: 'rgba(255,255,255,0.02)' },
]

function DeskCard({ desk, mySession, now, onSelect }) {
  const isMyDesk   = mySession?.deskId === desk.id
  const isOccupied = desk.status === 'occupied'
  const isAway     = desk.status === 'away'
  const isFree     = desk.status === 'free'

  const statusColor = isMyDesk   ? '#a78bfa'
    : isOccupied ? '#ef4444'
    : isAway     ? '#f59e0b'
    : '#22c55e'

  const cardBg = isMyDesk   ? 'rgba(167,139,250,0.1)'
    : isOccupied ? 'rgba(239,68,68,0.08)'
    : isAway     ? 'rgba(245,158,11,0.08)'
    : 'rgba(255,255,255,0.03)'

  const glowColor = isMyDesk   ? 'rgba(167,139,250,0.25)'
    : isOccupied ? 'rgba(239,68,68,0.15)'
    : isAway     ? 'rgba(245,158,11,0.15)'
    : 'transparent'

  const initials = desk.studentName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

  let awayCountdown = null
  if (isAway && desk.awayAt) {
    const remaining = AWAY_LIMIT - (now - desk.awayAt)
    awayCountdown = remaining > 0 ? fmt(remaining) : 'EXPIRED'
  }

  let elapsed = null
  if ((isOccupied || isAway) && desk.checkedInAt) {
    elapsed = fmt(now - desk.checkedInAt)
  }

  return (
    <div
      onClick={() => isFree && !mySession && onSelect(desk)}
      style={{
        position: 'relative',
        width: '130px',
        minHeight: '130px',
        background: cardBg,
        border: `1px solid ${isMyDesk ? 'rgba(167,139,250,0.4)' : isOccupied ? 'rgba(239,68,68,0.25)' : isAway ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '10px',
        padding: '12px',
        cursor: isFree && !mySession ? 'pointer' : 'default',
        boxShadow: `0 0 16px ${glowColor}`,
        transition: 'box-shadow 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      {/* Status dot */}
      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />

      <LaptopIcon color={statusColor} />

      <div style={{ fontWeight: 700, fontSize: '13px', color: '#f1f5f9' }}>{desk.id}</div>

      {(isOccupied || isAway) ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isMyDesk ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', margin: '0 auto 2px' }}>
            {initials}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desk.studentName}</div>
          {elapsed && <div style={{ fontSize: '10px', color: statusColor, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{elapsed}</div>}
          {awayCountdown && <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 600 }}>⏱ {awayCountdown}</div>}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>Available</div>
      )}

      {isMyDesk && <div style={{ fontSize: '9px', color: '#a78bfa', fontWeight: 700, letterSpacing: '1px' }}>• YOU</div>}
    </div>
  )
}

export default function DeskMap({ desks, mySession, now, onSelectDesk }) {
  const [mapView, setMapView] = useState(false)
  const border = 'rgba(139,92,246,0.15)'

  return (
    <div>
      {/* Header + toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Library Floor – Zone Map</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Tap any available desk to initiate booking sequence</p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {[['Available','#22c55e'],['Away','#f59e0b'],['Occupied','#ef4444'],['Your Desk','#a78bfa']].map(([label,color]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3px', gap: '2px', flexShrink: 0 }}>
          <button
            onClick={() => setMapView(false)}
            style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: !mapView ? 'rgba(139,92,246,0.3)' : 'transparent', color: !mapView ? '#c4b5fd' : '#64748b' }}
          >
            ≡ List
          </button>
          <button
            onClick={() => setMapView(true)}
            style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: mapView ? 'rgba(139,92,246,0.3)' : 'transparent', color: mapView ? '#c4b5fd' : '#64748b' }}
          >
            ▦ Floor Map
          </button>
        </div>
      </div>

      {/* Conditional view */}
      {mapView ? (
        <FloorMap desks={desks} mySession={mySession} onSelectDesk={onSelectDesk} />
      ) : (
        <div>
          {ZONES.map(zone => {
            const zoneDesks = desks.filter(d => zone.rows.includes(d.row))
            return (
              <div key={zone.id} style={{ marginBottom: '24px', background: zone.bg, border: `1px solid rgba(255,255,255,0.05)`, borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '3px', height: '16px', background: zone.color, borderRadius: '99px', display: 'inline-block' }} />
                    <span style={{ fontWeight: 700, fontSize: '12px', color: zone.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{zone.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{zoneDesks.length} desks</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {zoneDesks.map(d => (
                    <DeskCard key={d.id} desk={d} mySession={mySession} now={now} onSelect={onSelectDesk} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}