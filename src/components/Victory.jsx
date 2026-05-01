import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { PLAYER_COLORS } from '../constants'

export default function Victory({ winner, players, rounds, onNewGame, onHallOfFame, onHome }) {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#E8D5FF', '#C8F7DC', '#FFD5C0', '#C0E8FF', '#FFF5C0', '#7C3AED']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const totals = winner?.totals ?? []
  const sorted = [...totals].sort((a, b) => b.total - a.total)

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `${rank + 1}.`
  }

  const winnerColor = winner ? PLAYER_COLORS[winner.colorIndex] : PLAYER_COLORS[0]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 32px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

      {/* Trophée et gagnant */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '80px', marginBottom: '8px' }}>🏆</div>
        <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#9D77CC', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Victoire !
        </p>
        <h1 style={{
          margin: '0 0 8px', fontSize: '40px', fontWeight: 900, fontFamily: 'Nunito, sans-serif',
          color: winnerColor.text,
        }}>
          {winner?.name}
        </h1>
        <div style={{
          display: 'inline-block', backgroundColor: winnerColor.bg,
          border: `2px solid ${winnerColor.border}`, borderRadius: '20px',
          padding: '8px 20px',
        }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: winnerColor.text, fontFamily: 'Nunito, sans-serif' }}>
            {winner?.total} points
          </span>
        </div>
      </div>

      {/* Scores finaux */}
      <div style={{ width: '100%', marginBottom: '32px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: '#9D77CC', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
          Scores finaux — {rounds.length} manches
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sorted.map((p, rank) => {
            const color = PLAYER_COLORS[p.colorIndex]
            const isWinner = p.id === winner?.id
            return (
              <div key={p.id} style={{
                backgroundColor: isWinner ? color.bg : '#fff',
                border: `2px solid ${isWinner ? color.border : '#E8D5FF'}`,
                borderRadius: '14px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: rank < 3 ? '26px' : '16px', minWidth: '32px', textAlign: 'center', fontWeight: 900, color: '#9D77CC', fontFamily: 'Nunito, sans-serif' }}>
                  {getRankIcon(rank)}
                </span>
                <p style={{ flex: 1, margin: 0, fontSize: '16px', fontWeight: 800, color: color.text, fontFamily: 'Nunito, sans-serif' }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: color.text, fontFamily: 'Nunito, sans-serif' }}>{p.total} pts</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <button onClick={onNewGame} style={primaryBtn}>
          Nouvelle partie
        </button>
        <button onClick={onHallOfFame} style={secondaryBtn}>
          🏆 Voir le Hall of Fame
        </button>
        <button onClick={onHome} style={ghostBtn}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}

const primaryBtn = {
  backgroundColor: '#7C3AED', color: '#fff', border: 'none', borderRadius: '16px',
  padding: '16px', fontSize: '17px', fontWeight: 800, fontFamily: 'Nunito, sans-serif',
  cursor: 'pointer', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
}
const secondaryBtn = {
  backgroundColor: '#F5EEFF', color: '#7C3AED', border: '2px solid #C4B5FD',
  borderRadius: '16px', padding: '14px', fontSize: '16px', fontWeight: 800,
  fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
}
const ghostBtn = {
  backgroundColor: 'transparent', color: '#9D77CC', border: 'none',
  padding: '10px', fontSize: '15px', fontWeight: 700, fontFamily: 'Nunito, sans-serif',
  cursor: 'pointer',
}
