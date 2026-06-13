import { useState, useEffect, useRef } from 'react'
import DeskMap from './DeskMap'
import Modal from './Modal'
import Toast from './Toast'
import StillHere from './StillHere'
import LibrarianView from './LibrarianView'
import RightPanel from './SessionBar'
import { initialDesks } from './desks'

const SESSION_LIMIT = 2 * 60 * 60 * 1000  // back to 2 hours
const AWAY_LIMIT    = 20 * 60 * 1000       // 20 min

// SVG icons for sidebar
const IconHome     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
const IconMap      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
const IconSession  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IconUser     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function App() {
  const [desks, setDesks]           = useState(initialDesks)
  const [mySession, setMySession]   = useState(null)
  const [selectedDesk, setSelected] = useState(null)
  const [view, setView]             = useState('student')
  const [showStillHere, setShowSH]  = useState(false)
  const [toast, setToast]           = useState(null)
  const [now, setNow]               = useState(Date.now())
  const [activeNav, setActiveNav]   = useState('map')
  const stillHereTimer              = useRef(null)

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-release abandoned desks (away > 20 min)
  useEffect(() => {
    setDesks(prev => prev.map(d => {
      if (d.status === 'away' && d.awayAt && (now - d.awayAt) >= AWAY_LIMIT) {
        if (mySession?.deskId === d.id) {
          setMySession(null)
          showToast('Your session was auto-released — away too long', 'warning')
        }
        return { ...d, status: 'free', studentName: null, checkedInAt: null, awayAt: null }
      }
      return d
    }))
  }, [now])

  // Still-here prompt 5 min before expiry
  useEffect(() => {
    if (!mySession) return
    const remaining = SESSION_LIMIT - (now - mySession.checkedInAt)
    if (remaining <= 5 * 60 * 1000 && remaining > 0 && !showStillHere) {
      setShowSH(true)
    }
  }, [now, mySession])

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  function handleCheckIn(desk, name) {
    const session = { deskId: desk.id, studentName: name, checkedInAt: Date.now(), status: 'occupied' }
    setMySession(session)
    setDesks(prev => prev.map(d =>
      d.id === desk.id ? { ...d, status: 'occupied', studentName: name, checkedInAt: session.checkedInAt } : d
    ))
    setSelected(null)
    showToast(`Checked in at ${desk.id}`, 'success')
  }

  function handleStepAway() {
    if (!mySession) return
    const awayAt = Date.now()
    setMySession(s => ({ ...s, status: 'away', awayAt }))
    setDesks(prev => prev.map(d =>
      d.id === mySession.deskId ? { ...d, status: 'away', awayAt } : d
    ))
    showToast('Marked as Away — come back within 20 min', 'warning')
  }

  function handleStillHere() {
    if (!mySession) return
    setMySession(s => ({ ...s, status: 'occupied', awayAt: null }))
    setDesks(prev => prev.map(d =>
      d.id === mySession.deskId ? { ...d, status: 'occupied', awayAt: null } : d
    ))
    setShowSH(false)
    showToast('Session confirmed! Timer reset.', 'success')
  }

  function handleRelease() {
    if (!mySession) return
    setDesks(prev => prev.map(d =>
      d.id === mySession.deskId
        ? { ...d, status: 'free', studentName: null, checkedInAt: null, awayAt: null }
        : d
    ))
    setMySession(null)
    showToast('Desk released. See you next time!', 'info')
  }

  function handleForceRelease(deskId) {
    setDesks(prev => prev.map(d =>
      d.id === deskId ? { ...d, status: 'free', studentName: null, checkedInAt: null, awayAt: null } : d
    ))
    if (mySession?.deskId === deskId) setMySession(null)
    showToast(`Desk ${deskId} force-released`, 'warning')
  }

  const bg     = '#080808'
  const panel  = '#101010'
  const border = 'rgba(139,92,246,0.15)'
  const purple = '#8b5cf6'

  const available = desks.filter(d => d.status === 'free').length
  const occupied  = desks.filter(d => d.status === 'occupied').length
  const away      = desks.filter(d => d.status === 'away').length

  const sessionElapsed = mySession ? now - mySession.checkedInAt : 0

  const navItems = [
    { id: 'home',     icon: <IconHome /> },
    { id: 'map',      icon: <IconMap /> },
    { id: 'sessions', icon: <IconSession /> },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: bg, color: '#f1f5f9', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>

      {/* ── Left sidebar ── */}
      <aside style={{ width: '48px', background: panel, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px', paddingBottom: '16px', gap: '4px', flexShrink: 0 }}>
        {/* Logo mark */}
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>

        {navItems.map(n => (
          <button key={n.id} onClick={() => setActiveNav(n.id)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeNav === n.id ? 'rgba(139,92,246,0.2)' : 'transparent', color: activeNav === n.id ? purple : '#64748b', transition: 'all 0.15s' }}>
            {n.icon}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#64748b' }}>
          <IconUser />
        </button>
        <button style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#64748b' }}>
          <IconSettings />
        </button>
      </aside>

      {/* ── Main area ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ height: '56px', background: panel, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>DeskGuard</span>
            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
              ✦ {available} Available
            </span>
          </div>

          {/* Center — active session timer */}
          {mySession ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#94a3b8', textTransform: 'uppercase' }}>Active Session</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e', letterSpacing: '-1px', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                {fmt(sessionElapsed)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Desk {mySession.deskId}</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#334155' }}>
              <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>No Active Session</div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>--:--</div>
            </div>
          )}

          {/* Right — view toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
            {['student', 'librarian'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: view === v ? 'rgba(139,92,246,0.3)' : 'transparent', color: view === v ? '#c4b5fd' : '#64748b', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                {v}
              </button>
            ))}
          </div>
        </header>

        {/* Broadcast strip */}
        <div style={{ padding: '8px 24px', background: '#0d0d0d', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#94a3b8', flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <strong style={{ color: '#f1f5f9' }}>LIBRARY BROADCAST</strong>
          </span>
          <span>⏰ Open Mon–Fri 08:00–22:00 · Sat–Sun 10:00–20:00</span>
          <span>⚠️ Max session: 2 hours · Away limit: 20 min</span>
          <span>📶 High-speed WiFi active · All zones</span>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {view === 'student'
            ? <DeskMap desks={desks} mySession={mySession} now={now} onSelectDesk={setSelected} />
            : <LibrarianView desks={desks} now={now} onForceRelease={handleForceRelease} />
          }
        </div>
      </main>

      {/* ── Right panel ── */}
      <RightPanel
        mySession={mySession}
        desks={desks}
        now={now}
        available={available}
        occupied={occupied}
        away={away}
        onStillHere={handleStillHere}
        onStepAway={handleStepAway}
        onRelease={handleRelease}
      />

      {/* Modals / overlays */}
      {selectedDesk && !mySession && (
        <Modal desk={selectedDesk} onCheckIn={handleCheckIn} onClose={() => setSelected(null)} />
      )}
      {showStillHere && (
        <StillHere onConfirm={handleStillHere} onRelease={() => { setShowSH(false); handleRelease() }} sessionElapsed={sessionElapsed} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}