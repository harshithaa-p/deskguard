const DESK_W = 70
const DESK_H = 52
const GAP_X  = 14
const GAP_Y  = 18

const STATUS_COLOR = {
  free:     '#22c55e',
  occupied: '#ef4444',
  away:     '#f59e0b',
}

const ZONE_CONFIGS = [
  { id: 'alpha', label: 'Zone Alpha – Quiet Study',  color: '#8b5cf6', rows: ['A','B'], x: 140, y: 80  },
  { id: 'beta',  label: 'Zone Beta – Collaboration', color: '#06b6d4', rows: ['C','D'], x: 140, y: 260 },
  { id: 'gamma', label: 'Zone Gamma – Focus Pods',   color: '#f59e0b', rows: ['E'],     x: 140, y: 430 },
]

function DeskRect({ desk, x, y, mySession, onSelect }) {
  const isMyDesk  = mySession?.deskId === desk.id
  const isFree    = desk.status === 'free'
  const color     = isMyDesk ? '#a78bfa' : STATUS_COLOR[desk.status] || '#22c55e'
  const initials  = desk.studentName?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || ''

  return (
    <g
      style={{ cursor: isFree && !mySession ? 'pointer' : 'default' }}
      onClick={() => isFree && !mySession && onSelect(desk)}
    >
      {/* Glow */}
      <rect x={x-2} y={y-2} width={DESK_W+4} height={DESK_H+4} rx="8" fill={color} opacity="0.12" />

      {/* Desk body */}
      <rect x={x} y={y} width={DESK_W} height={DESK_H} rx="6"
        fill="#101010"
        stroke={color}
        strokeWidth={isMyDesk ? 2 : 1.2}
        opacity="1"
      />

      {/* Laptop icon */}
      <rect x={x+14} y={y+8} width={42} height={26} rx="2" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
      <rect x={x+17} y={y+11} width={36} height={20} rx="1" fill={color} opacity="0.1"/>
      <line x1={x+10} y1={y+36} x2={x+60} y2={y+36} stroke={color} strokeWidth="1.2" opacity="0.5"/>

      {/* Desk ID */}
      <text x={x + DESK_W/2} y={y + DESK_H - 8} textAnchor="middle"
        fill={color} fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.5">
        {desk.id}
      </text>

      {/* Avatar circle for occupied/away */}
      {initials && (
        <circle cx={x + DESK_W/2} cy={y + 14} r="9" fill={color} opacity="0.25"/>
      )}
      {initials && (
        <text x={x + DESK_W/2} y={y + 18} textAnchor="middle"
          fill={color} fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">
          {initials}
        </text>
      )}

      {/* Status dot top-right */}
      <circle cx={x + DESK_W - 7} cy={y + 7} r="4" fill={color} />
      <circle cx={x + DESK_W - 7} cy={y + 7} r="4" fill={color} opacity="0.4">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  )
}

export default function FloorMap({ desks, mySession, onSelectDesk }) {
  const W = 780
  const H = 580

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ fontFamily: 'Inter,sans-serif', display: 'block', margin: '0 auto' }}>

        {/* Floor background */}
        <rect width={W} height={H} rx="14" fill="#0a0a0a" stroke="rgba(139,92,246,0.15)" strokeWidth="1"/>

        {/* Entrance */}
        <rect x={330} y={H-18} width={120} height={20} rx="4" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
        <text x={390} y={H-5} textAnchor="middle" fill="#8b5cf6" fontSize="9" fontWeight="700" letterSpacing="2">ENTRANCE</text>

        {/* Windows on sides */}
        {[60, 160, 260, 360, 460].map(wy => (
          <g key={wy}>
            <rect x={8} y={wy} width={8} height={40} rx="2" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.25)" strokeWidth="1"/>
            <rect x={W-16} y={wy} width={8} height={40} rx="2" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.25)" strokeWidth="1"/>
          </g>
        ))}

        {/* Legend */}
        {[['Free','#22c55e'], ['Occupied','#ef4444'], ['Away','#f59e0b'], ['Your Desk','#a78bfa']].map(([label, color], i) => (
          <g key={label} transform={`translate(${24 + i * 110}, 28)`}>
            <circle cx="6" cy="6" r="5" fill={color} opacity="0.8"/>
            <text x="16" y="10" fill="#94a3b8" fontSize="11" fontFamily="Inter,sans-serif">{label}</text>
          </g>
        ))}

        {/* Zones */}
        {ZONE_CONFIGS.map(zone => {
          const zoneDesks = desks.filter(d => zone.rows.includes(d.row))
          const rowHeight  = DESK_H + GAP_Y
          const zoneH      = zone.rows.length * rowHeight + 28

          return (
            <g key={zone.id}>
              {/* Zone background */}
              <rect
                x={zone.x - 20} y={zone.y - 30}
                width={5 * (DESK_W + GAP_X) - GAP_X + 40}
                height={zoneH}
                rx="10"
                fill={zone.color}
                opacity="0.04"
                stroke={zone.color}
                strokeWidth="1"
                strokeOpacity="0.15"
              />

              {/* Zone label */}
              <rect x={zone.x - 20} y={zone.y - 30} width={6} height={zoneH} rx="3" fill={zone.color} opacity="0.6"/>
              <text x={zone.x - 8} y={zone.y - 12} fill={zone.color} fontSize="10" fontWeight="800" letterSpacing="1.5" fontFamily="Inter,sans-serif">
                {zone.label.toUpperCase()}
              </text>

              {/* Desks */}
              {zone.rows.map((row, rowIdx) => {
                const rowDesks = zoneDesks.filter(d => d.row === row)
                return rowDesks.map((desk, colIdx) => (
                  <DeskRect
                    key={desk.id}
                    desk={desk}
                    x={zone.x + colIdx * (DESK_W + GAP_X)}
                    y={zone.y + rowIdx * (DESK_H + GAP_Y)}
                    mySession={mySession}
                    onSelect={onSelectDesk}
                  />
                ))
              })}
            </g>
          )
        })}

        {/* Aisle labels */}
        <text x={100} y={180} textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="28" fontWeight="900" fontFamily="Inter,sans-serif" transform="rotate(-90, 100, 180)">AISLE</text>
        <text x={100} y={350} textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="28" fontWeight="900" fontFamily="Inter,sans-serif" transform="rotate(-90, 100, 350)">AISLE</text>
      </svg>
    </div>
  )
}