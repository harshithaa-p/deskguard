import { QRCodeSVG } from 'qrcode.react'

function QRModal({ desk, onClose }) {
  if (!desk) return null

  const url = `${window.location.origin}/checkin?desk=${desk.id}`

  return (
    <div
      onClick={onClose}
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
            Desk
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>
            {desk.id}
          </h2>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
        }}>
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#0f1117"
            level="H"
          />
        </div>

        <div style={{
          background: '#0f1117',
          border: '1px solid #1e2535',
          borderRadius: '8px',
          padding: '10px 16px',
          width: '100%',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
            Scan to check in
          </p>
          <p style={{
            fontSize: '11px',
            color: '#334155',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
          }}>
            {url}
          </p>
        </div>

        <button
          onClick={onClose}
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
  )
}

export default QRModal