import { useState } from 'react'
import { PLAYER_COLORS } from '../constants'

let nextId = Date.now()

export default function Setup({ savedPlayers, onStart, onBack }) {
  const [selected, setSelected] = useState([])
  const [newName, setNewName] = useState('')

  const toggleSaved = (player) => {
    if (selected.find((s) => s.id === player.id)) {
      setSelected(selected.filter((s) => s.id !== player.id))
    } else {
      setSelected([...selected, { id: player.id, name: player.name }])
    }
  }

  const addNew = () => {
    const name = newName.trim()
    if (!name) return
    const id = `new_${nextId++}`
    setSelected([...selected, { id, name }])
    setNewName('')
  }

  const removeSelected = (id) => setSelected(selected.filter((s) => s.id !== id))

  const canStart = selected.length >= 2

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button onClick={onBack} style={iconBtn}>←</button>
        <h2 style={titleStyle}>Qui joue ce soir ?</h2>
      </div>

      {/* Joueurs sélectionnés */}
      {selected.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={labelStyle}>Joueurs sélectionnés ({selected.length})</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selected.map((p, i) => {
              const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  backgroundColor: color.bg, border: `2px solid ${color.border}`,
                  borderRadius: '20px', padding: '6px 12px',
                }}>
                  <span style={{ color: color.text, fontWeight: 700, fontSize: '15px', fontFamily: 'Nunito, sans-serif' }}>{p.name}</span>
                  <button onClick={() => removeSelected(p.id)} style={{ background: 'none', border: 'none', color: color.text, cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1, fontWeight: 800 }}>×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Joueurs connus */}
      {savedPlayers.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={labelStyle}>Joueurs connus</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {savedPlayers.map((player) => {
              const isSelected = !!selected.find((s) => s.id === player.id)
              return (
                <button key={player.id} onClick={() => toggleSaved(player)} style={{
                  backgroundColor: isSelected ? '#7C3AED' : '#fff',
                  color: isSelected ? '#fff' : '#5B21B6',
                  border: `2px solid ${isSelected ? '#7C3AED' : '#C4B5FD'}`,
                  borderRadius: '20px', padding: '8px 16px',
                  fontSize: '15px', fontWeight: 700, fontFamily: 'Nunito, sans-serif',
                  cursor: 'pointer',
                }}>
                  {isSelected ? '✓ ' : ''}{player.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Ajouter un nouveau joueur */}
      <div style={{ marginBottom: '32px' }}>
        <p style={labelStyle}>Ajouter un joueur</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNew()}
            placeholder="Prénom..."
            maxLength={20}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '12px',
              border: '2px solid #C4B5FD', fontSize: '16px', fontFamily: 'Nunito, sans-serif',
              fontWeight: 600, outline: 'none', backgroundColor: '#fff', color: '#3D1A78',
            }}
          />
          <button onClick={addNew} disabled={!newName.trim()} style={{
            backgroundColor: newName.trim() ? '#7C3AED' : '#E8D5FF',
            color: newName.trim() ? '#fff' : '#C4B5FD',
            border: 'none', borderRadius: '12px', padding: '12px 18px',
            fontSize: '22px', cursor: newName.trim() ? 'pointer' : 'default',
          }}>
            +
          </button>
        </div>
      </div>

      {/* Bouton lancer */}
      <button onClick={() => canStart && onStart(selected)} style={{
        backgroundColor: canStart ? '#7C3AED' : '#E8D5FF',
        color: canStart ? '#fff' : '#C4B5FD',
        border: 'none', borderRadius: '16px', padding: '18px',
        fontSize: '18px', fontWeight: 800, fontFamily: 'Nunito, sans-serif',
        cursor: canStart ? 'pointer' : 'default',
        boxShadow: canStart ? '0 4px 16px rgba(124, 58, 237, 0.3)' : 'none',
      }}>
        {canStart ? `Lancer la partie (${selected.length} joueurs)` : 'Sélectionner au moins 2 joueurs'}
      </button>
    </div>
  )
}

const iconBtn = {
  background: '#fff', border: '2px solid #C4B5FD', borderRadius: '12px',
  width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const titleStyle = {
  margin: 0, fontSize: '24px', fontWeight: 900, color: '#5B21B6', fontFamily: 'Nunito, sans-serif',
}

const labelStyle = {
  margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#9D77CC',
  textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Nunito, sans-serif',
}
