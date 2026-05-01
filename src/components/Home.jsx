export default function Home({ onPlay, onHallOfFame }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: '40px' }}>

      {/* Logo / Titre */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '8px' }}>🃏</div>
        <h1 style={{ margin: 0, fontSize: '48px', fontWeight: 900, color: '#5B21B6', letterSpacing: '-1px', fontFamily: 'Nunito, sans-serif' }}>
          Flip Seven
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '16px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
          Compteur de scores
        </p>
      </div>

      {/* Carte décorative */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {['#E8D5FF', '#C8F7DC', '#FFD5C0', '#C0E8FF', '#FFF5C0'].map((color, i) => (
          <div key={i} style={{
            width: '36px', height: '52px', borderRadius: '8px', backgroundColor: color,
            border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transform: `rotate(${(i - 2) * 8}deg)`,
          }} />
        ))}
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
        <button onClick={onPlay} style={btnStyle('#7C3AED', '#fff')}>
          Nouvelle partie
        </button>
        <button onClick={onHallOfFame} style={btnStyle('#F5EEFF', '#7C3AED', '#C4B5FD')}>
          🏆 Hall of Fame
        </button>
      </div>
    </div>
  )
}

function btnStyle(bg, color, border) {
  return {
    backgroundColor: bg,
    color,
    border: border ? `2px solid ${border}` : 'none',
    borderRadius: '16px',
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: 800,
    fontFamily: 'Nunito, sans-serif',
    cursor: 'pointer',
    width: '100%',
    boxShadow: border ? 'none' : '0 4px 16px rgba(124, 58, 237, 0.3)',
    transition: 'transform 0.1s, box-shadow 0.1s',
  }
}
