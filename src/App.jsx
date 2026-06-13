import { useState, useEffect } from 'react'
import { initialDesks } from './desks'
import DeskMap from './DeskMap'
import Modal from './Modal'
import Toast from './Toast'
import SessionBar from './SessionBar'
import StillHere from './StillHere'
import LibrarianView from './LibrarianView'

function App() {
  const [desks, setDesks] = useState(initialDesks)
  const [selectedDesk, setSelectedDesk] = useState(null)
  const [toast, setToast] = useState(null)
  const [view, setView] = useState('student')
  const [mySession, setMySession] = useState(null)
  const [showStillHere, setShowStillHere] = useState(false)

  const free     = desks.filter(d => d.status === 'free').length
  const occupied = desks.filter(d => d.status === 'occupied').length
  const away     = desks.filter(d => d.status === 'away').length

  useEffect(() => {
    if (!mySession) return
    if (mySession.status !== 'occupied') return

    const interval = setInterval(() => {
      const elapsed = Date.now() - mySession.checkedInAt
      if (elapsed > 2 * 60 * 1000) {
        setShowStillHere(true)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [mySession])

  function showToast(message, type = 'info') {
    setToast({ message, type })
  }

  function handleDeskClick(desk) {
    setSelectedDesk(desk)
  }

  function handleAction(deskId, action, studentName = '') {
    setDesks(prev => prev.map(d => {
      if (d.id !== deskId) return d
      if (action === 'occupy') return {
        ...d,
        status: 'occupied',
        studentName,
        checkedInAt: Date.now(),
        awayAt: null,
      }
      if (action === 'away') return {
        ...d,
        status: 'away',
        awayAt: Date.now()
      }
      if (action === 'release') return {
        ...d,
        status: 'free',
        studentName: null,
        checkedInAt: null,
        awayAt: null
      }
      return d
    }))

    if (action === 'occupy') {
      setMySession({ id: deskId, studentName, checkedInAt: Date.now(), status: 'occupied' })
      showToast(`Desk ${deskId} checked in — ${studentName}`, 'success')
    }
    if (action === 'away') {
      setMySession(prev => prev ? { ...prev, status: 'away', awayAt: Date.now() } : null)
      showToast(`Desk ${deskId} marked as Away`, 'warning')
    }
    if (action === 'release') {
      setMySession(null)
      showToast(`Desk ${deskId} released`, 'info')
    }

    setSelectedDesk(null)
  }

  function handleClose() {
    setSelectedDesk(null)
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 100px' }}>

      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        borderBottom: '1px solid #1e2535',
        paddingBottom: '20px'
      }}>
        {/* Announcements */}
        <div style={{
          background: '#0d1b2a',
          border: '1px solid #1e3a5f',
          borderRadius: '10px',
          padding: '10px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notice</span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Library open 8:00 AM – 10:00 PM · Away limit: 20 min · Sessions auto-expire after 2 hrs of inactivity</span>
        </div>

        <div>
          <h1 style={{ fontSize: '22px', color: '#f8fafc' }}>DeskGuard</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Library Seat Management — MUJ Central Library
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#131720',
            border: '1px solid #1e2535',
            borderRadius: '8px',
            display: 'flex',
            overflow: 'hidden',
          }}>
            {['student', 'librarian'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  background: view === v ? '#1e2535' : 'transparent',
                  color: view === v ? '#f8fafc' : '#475569',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {v === 'student' ? 'Student View' : 'Librarian View'}
              </button>
            ))}
          </div>

          <div style={{
            background: free > 0 ? '#166534' : '#7f1d1d',
            border: `1px solid ${free > 0 ? '#22c55e' : '#ef4444'}`,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#f8fafc',
            fontWeight: '500',
          }}>
            {free === 0 ? 'Library Full' : `${free} desks available`}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Available', value: free,     color: '#22c55e' },
          { label: 'Occupied',  value: occupied, color: '#ef4444' },
          { label: 'Away',      value: away,     color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#131720',
            border: '1px solid #1e2535',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <span style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {stat.label}
            </span>
            <span style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {[
          { icon: '🟢', rule: 'Scan QR to check in', detail: 'Each desk has a unique QR code' },
          { icon: '🟡', rule: '20-min Away limit', detail: 'Desk auto-released if timer expires' },
          { icon: '🔴', rule: '2-hr session cap', detail: '"Still here?" prompt resets your timer' },
        ].map(item => (
          <div key={item.rule} style={{
            background: '#131720',
            border: '1px solid #1e2535',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>{item.rule}</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Main Content */}
      {view === 'student' && (
        <DeskMap desks={desks} onDeskClick={handleDeskClick} />
      )}

      {view === 'librarian' && (
        <LibrarianView
          desks={desks}
          onForceRelease={(deskId) => {
            handleAction(deskId, 'release')
            showToast(`Desk ${deskId} force released by librarian`, 'warning')
          }}
        />
      )}

      <Modal
        desk={selectedDesk}
        onClose={handleClose}
        onAction={handleAction}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showStillHere && mySession && (
        <StillHere
          session={mySession}
          onConfirm={() => {
            setMySession(prev => ({ ...prev, checkedInAt: Date.now() }))
            setShowStillHere(false)
            showToast('Session confirmed — timer reset', 'success')
          }}
          onExpire={() => {
            handleAction(mySession.id, 'release')
            setShowStillHere(false)
            showToast('Desk auto-released due to inactivity', 'warning')
          }}
        />
      )}

      <SessionBar
        session={mySession}
        onAway={() => mySession && handleAction(mySession.id, 'away')}
        onRelease={() => mySession && handleAction(mySession.id, 'release')}
      />

    </div>
  )
}

export default App