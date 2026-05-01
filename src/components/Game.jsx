import { useState } from 'react'
import { PLAYER_COLORS, WIN_SCORE } from '../constants'

export default function Game({ players, rounds, onSubmitRound, onBack }) {
  const [tab, setTab] = useState('scores')
  const [inputs, setInputs] = useState({})
  const [showBackConfirm, setShowBackConfirm] = useState(false)

  const roundNumber = rounds.length + 1

  const totals = players.map((p) => ({
    ...p,
    total: rounds.reduce((sum, round) => {
      const entry = round.find((r) => r.playerId === p.id)
      return sum + (entry ? entry.score : 0)
    }, 0),
    lastRound: rounds.length > 0 ? (rounds[rounds.length - 1].find((r) => r.playerId === p.id)?.score ?? 0) : null,
  }))

  const sorted = [...totals].sort((a, b) => b.total - a.total)

  const handleInput = (playerId, value) => {
    setInputs((prev) => ({ ...prev, [playerId]: value }))
  }

  const allFilled = players.every((p) => inputs[p.id] !== undefined && inputs[p.id] !== '')

  const handleSubmit = () => {
    if (!allFilled) return
    const roundScores = players.map((p) => ({
      playerId: p.id,
      score: parseInt(inputs[p.id], 10) || 0,
    }))
    setInputs({})
    onSubmitRound(roundScores)
  }

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `${rank + 1}.`
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setShowBackConfirm(true)} style={iconBtn}>←</button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#9D77CC', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manche</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>{roundNumber}</p>
        </div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Barre de progression */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ height: '8px', backgroundColor: '#E8D5FF', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', backgroundColor: '#7C3AED', borderRadius: '8px',
            width: `${Math.min((Math.max(...sorted.map(p => p.total)) / WIN_SCORE) * 100, 100)}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600, textAlign: 'right' }}>
          {Math.max(...sorted.map(p => p.total))} / {WIN_SCORE} pts
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', margin: '16px 20px 0', backgroundColor: '#E8D5FF', borderRadius: '12px', padding: '4px', gap: '4px' }}>
        {[['scores', '📝 Saisie'], ['leaderboard', '🏅 Classement']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            backgroundColor: tab === key ? '#7C3AED' : 'transparent',
            color: tab === key ? '#fff' : '#9D77CC',
            fontSize: '14px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, padding: '16px 20px 24px', overflowY: 'auto' }}>

        {/* Tab Saisie */}
        {tab === 'scores' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {players.map((p) => {
              const color = PLAYER_COLORS[p.colorIndex]
              const playerTotal = totals.find((t) => t.id === p.id)?.total ?? 0
              return (
                <div key={p.id} style={{
                  backgroundColor: color.light, border: `2px solid ${color.border}`,
                  borderRadius: '16px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: color.text, fontFamily: 'Nunito, sans-serif' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: color.text, opacity: 0.7, fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>Total : {playerTotal} pts</p>
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={inputs[p.id] ?? ''}
                    onChange={(e) => handleInput(p.id, e.target.value)}
                    placeholder="0"
                    style={{
                      width: '80px', padding: '10px 12px', textAlign: 'center',
                      borderRadius: '12px', border: `2px solid ${color.border}`,
                      fontSize: '20px', fontWeight: 900, fontFamily: 'Nunito, sans-serif',
                      color: color.text, backgroundColor: '#fff', outline: 'none',
                    }}
                  />
                </div>
              )
            })}

            <button onClick={handleSubmit} disabled={!allFilled} style={{
              marginTop: '8px',
              backgroundColor: allFilled ? '#7C3AED' : '#E8D5FF',
              color: allFilled ? '#fff' : '#C4B5FD',
              border: 'none', borderRadius: '16px', padding: '18px',
              fontSize: '18px', fontWeight: 800, fontFamily: 'Nunito, sans-serif',
              cursor: allFilled ? 'pointer' : 'default',
              boxShadow: allFilled ? '0 4px 16px rgba(124, 58, 237, 0.3)' : 'none',
            }}>
              Valider la manche
            </button>
          </div>
        )}

        {/* Tab Classement */}
        {tab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sorted.map((p, rank) => {
              const color = PLAYER_COLORS[p.colorIndex]
              return (
                <div key={p.id} style={{
                  backgroundColor: rank === 0 ? color.bg : '#fff',
                  border: `2px solid ${rank === 0 ? color.border : '#E8D5FF'}`,
                  borderRadius: '16px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: rank < 3 ? '28px' : '18px', minWidth: '36px', textAlign: 'center', fontWeight: 900, color: '#9D77CC', fontFamily: 'Nunito, sans-serif' }}>
                    {getRankIcon(rank)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: color.text, fontFamily: 'Nunito, sans-serif' }}>{p.name}</p>
                    {p.lastRound !== null && (
                      <p style={{ margin: 0, fontSize: '13px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
                        Dernière manche : +{p.lastRound} pts
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: color.text, fontFamily: 'Nunito, sans-serif' }}>{p.total}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>pts</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modale confirmation quitter */}
      {showBackConfirm && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(91, 33, 182, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100,
        }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>⚠️</p>
            <p style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>Quitter la partie ?</p>
            <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>Les scores de cette partie seront perdus.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowBackConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #C4B5FD', backgroundColor: '#F5EEFF', color: '#7C3AED', fontSize: '16px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
                Annuler
              </button>
              <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#7C3AED', color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const iconBtn = {
  background: '#fff', border: '2px solid #C4B5FD', borderRadius: '12px',
  width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
