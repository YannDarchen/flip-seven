import { useState } from 'react'

export default function HallOfFame({ history, loading, error, onRetry, onBack, onDeleteGame }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  // Calcul des victoires directement depuis l'historique Supabase
  const winsByPlayer = history.reduce((acc, game) => {
    acc[game.winnerName] = (acc[game.winnerName] || 0) + 1
    return acc
  }, {})
  const ranked = Object.entries(winsByPlayer)
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins)

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `${rank + 1}.`
  }

  const handleDelete = (gameId) => {
    onDeleteGame(gameId)
    setConfirmDeleteId(null)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button onClick={onBack} style={iconBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>
          🏆 Hall of Fame
        </h2>
      </div>

      {/* État de chargement */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #E8D5FF', borderTop: '4px solid #7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ margin: 0, fontSize: '15px', color: '#9D77CC', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
            Chargement...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* État d'erreur */}
      {!loading && error && (
        <div style={{ backgroundColor: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '32px' }}>📡</p>
          <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#EF4444', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>{error}</p>
          <button onClick={onRetry} style={{
            backgroundColor: '#7C3AED', color: '#fff', border: 'none', borderRadius: '12px',
            padding: '10px 20px', fontSize: '15px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}>
            Réessayer
          </button>
        </div>
      )}

      {/* Contenu */}
      {!loading && !error && (
        <>
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
                  <div key={player.name} style={{
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

          {/* Historique */}
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
                    backgroundColor: '#fff',
                    border: `2px solid ${confirmDeleteId === game.id ? '#FCA5A5' : '#E8D5FF'}`,
                    borderRadius: '16px', padding: '14px 16px',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🏆</span>
                        <span style={{ fontSize: '17px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif' }}>{game.winnerName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#C4B5FD', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>{game.date}</span>
                        {confirmDeleteId !== game.id && (
                          <button onClick={() => setConfirmDeleteId(game.id)} style={deleteBtn} title="Supprimer">🗑️</button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: confirmDeleteId === game.id ? '12px' : 0 }}>
                      {game.players.map((p, i) => (
                        <span key={i} style={{
                          fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                          color: '#9D77CC', backgroundColor: '#F5EEFF', borderRadius: '8px', padding: '3px 8px',
                        }}>
                          {p.name} {p.score}pts
                        </span>
                      ))}
                    </div>
                    {confirmDeleteId === game.id && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #FFE4E4' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', fontFamily: 'Nunito, sans-serif' }}>
                          Supprimer cette partie ?
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setConfirmDeleteId(null)} style={cancelBtn}>Annuler</button>
                          <button onClick={() => handleDelete(game.id)} style={confirmBtn}>Supprimer</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const iconBtn = {
  background: '#fff', border: '2px solid #C4B5FD', borderRadius: '12px',
  width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const deleteBtn = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', borderRadius: '8px', lineHeight: 1,
}
const cancelBtn = {
  padding: '6px 14px', borderRadius: '8px', border: '2px solid #C4B5FD',
  backgroundColor: '#F5EEFF', color: '#7C3AED', fontSize: '13px',
  fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
}
const confirmBtn = {
  padding: '6px 14px', borderRadius: '8px', border: 'none',
  backgroundColor: '#EF4444', color: '#fff', fontSize: '13px',
  fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
}
const labelStyle = {
  margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: '#9D77CC',
  textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Nunito, sans-serif',
}
