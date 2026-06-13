import { useState, useEffect, useRef } from 'react'

const statusConfig = {
  free:     { color: '#0f1117', border: '#1e2535', label: 'Free' },
  occupied: { color: '#7f1d1d', border: '#ef4444', label: 'Occupied' },
  away:     { color: '#78350f', border: '#f59e0b', label: 'Away' },
}

function getElapsed(timestamp) {
  if (!timestamp) return null
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s < 10 ? '0' : ''}${s}s`
}

function getAwayCountdown(awayAt) {
  if (!awayAt) return null
  const elapsed = Math.floor((Date.now() - awayAt) / 1000)
  const remaining = 20 * 60 - elapsed
  if (remaining <= 0) return 'Expired'
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return `${m}m ${s < 10 ? '0' : ''}${s}s left`
}

function Desk({ desk, onClick }) {
  const [isFlashing, setIsFlashing] = useState(false)
  const [, setTick] = useState(0)
  const prevStatus = useRef(desk.status)
  const config = statusConfig[desk.status]

  useEffect(() => {
    if (desk.status === 'free') return
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [desk.status])

  useEffect(() => {
    const wasAway = prevStatus.current === 'away'
    const nowFree = desk.status === 'free'
    if (wasAway && nowFree) {
      setIsFlashing(true)
      setTimeout(() => setIsFlashing(false), 1500)
    }
    prevStatus.current = desk.status
  }, [desk.status])

  const isExpired = desk.status === 'away' &&
    desk.awayAt &&
    Math.floor((Date.now() - desk.awayAt) / 1000) >= 20 * 60

  const elapsed = getElapsed(desk.checkedInAt)
  const countdown = getAwayCountdown(desk.awayAt)

  return (
    <div
      onClick={() => onClick(desk)}
      className={isFlashing ? 'abandoned-flash' : ''}
      style={{
        background: isFlashing ? '#1f2937' : isExpired ? '#1a0a0a' : config.color,
        border: `1.5px solid ${isFlashing ? '#6b7280' : isExpired ? '#7f1d1d' : config.border}`,
        borderRadius: '10px',
        width: '110px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: isFlashing ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease',
        gap: '4px',
        padding: '10px',
      }}
      onMouseEnter={e => {
        if (isFlashing) return
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = `0 0 12px ${config.border}55`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
        {desk.id}
      </span>

      {desk.status === 'free' && !isFlashing && (
        <span style={{ fontSize: '11px', color: '#334155', fontWeight: '500' }}>
          Available
        </span>
      )}

      {isFlashing && (
        <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '500' }}>
          Released
        </span>
      )}

      {desk.status !== 'free' && desk.studentName && !isFlashing && (
        <span style={{
          fontSize: '10px',
          color: '#cbd5e1',
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '90px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {desk.studentName}
        </span>
      )}

      {desk.status === 'occupied' && elapsed && !isFlashing && (
        <span style={{ fontSize: '10px', color: '#ef4444' }}>
          {elapsed}
        </span>
      )}

      {desk.status === 'away' && countdown && !isFlashing && (
        <span style={{
          fontSize: '10px',
          color: isExpired ? '#ef4444' : '#f59e0b',
          fontWeight: '600'
        }}>
          {isExpired ? 'Abandoned' : countdown}
        </span>
      )}
    </div>
  )
}

function DeskMap({ desks, onDeskClick }) {
  const rows = [...new Set(desks.map(d => d.row))]

  return (
    <div style={{
      background: '#131720',
      border: '1px solid #1e2535',
      borderRadius: '14px',
      padding: '28px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '15px', color: '#f8fafc' }}>Floor Map — Section A</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: val.border
              }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rows.map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              color: '#334155',
              width: '20px',
              fontWeight: '600'
            }}>
              {row}
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {desks.filter(d => d.row === row).map(desk => (
                <Desk key={desk.id} desk={desk} onClick={onDeskClick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeskMap