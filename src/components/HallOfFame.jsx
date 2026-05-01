export default function HallOfFame({ savedPlayers, history, onBack }) {
  const ranked = [...savedPlayers]
    .filter((p) => p.wins > 0)
    .sort((a, b) => b.wins - a.wins)

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `${rank + 1}.`
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button onClick={onBack} style={iconBtn}>←</button>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>🏆 Hall of Fame</h2>
        </div>
      </div>

      {/* Palmarès */}
      <div style={{ marginBottom: '28px' }}>
        <p style={labelStyle}>Palmarès — victoires totales</p>
        {ranked.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '2px solid #E8D5FF', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '32px' }}>🃏</p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
              Aucune victoire enregistrée pour l'instant
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ranked.map((player, rank) => (
              <div key={player.id} style={{
                backgroundColor: rank === 0 ? '#EDE4FF' : '#fff',
                border: `2px solid ${rank === 0 ? '#C4B5FD' : '#E8D5FF'}`,
                borderRadius: '16px', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: rank < 3 ? '28px' : '18px', minWidth: '36px', textAlign: 'center', fontWeight: 900, color: '#9D77CC', fontFamily: 'Nunito, sans-serif' }}>
                  {getRankIcon(rank)}
                </span>
                <p style={{ flex: 1, margin: 0, fontSize: '18px', fontWeight: 800, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>{player.name}</p>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#7C3AED', fontFamily: 'Nunito, sans-serif' }}>{player.wins}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>{player.wins > 1 ? 'victoires' : 'victoire'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historique des parties */}
      <div>
        <p style={labelStyle}>Historique des parties</p>
        {history.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '2px solid #E8D5FF', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
              Aucune partie terminée
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((game) => (
              <div key={game.id} style={{
                backgroundColor: '#fff', border: '2px solid #E8D5FF',
                borderRadius: '16px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🏆</span>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>{game.winnerName}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#C4B5FD', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>{game.date}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {game.players.map((p, i) => (
                    <span key={i} style={{
                      fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                      color: '#9D77CC', backgroundColor: '#F5EEFF', borderRadius: '8px',
                      padding: '3px 8px',
                    }}>
                      {p.name} {p.score}pts
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const iconBtn = {
  background: '#fff', border: '2px solid #C4B5FD', borderRadius: '12px',
  width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const labelStyle = {
  margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: '#9D77CC',
  textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Nunito, sans-serif',
}
