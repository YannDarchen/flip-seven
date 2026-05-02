import { useState, useEffect } from 'react'
import Home from './components/Home'
import Setup from './components/Setup'
import Game from './components/Game'
import Victory from './components/Victory'
import HallOfFame from './components/HallOfFame'
import { supabase } from './lib/supabase'
import { STORAGE_KEYS, WIN_SCORE, PLAYER_COLORS } from './constants'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [savedPlayers, setSavedPlayers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SAVED_PLAYERS, [])
  )
  const [hallOfFame, setHallOfFame] = useState([])
  const [hofLoading, setHofLoading] = useState(false)
  const [hofError, setHofError] = useState(null)
  const [gamePlayers, setGamePlayers] = useState([])
  const [rounds, setRounds] = useState([])
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_PLAYERS, JSON.stringify(savedPlayers))
  }, [savedPlayers])

  const fetchHallOfFame = async () => {
    setHofLoading(true)
    setHofError(null)
    try {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setHallOfFame(
        data.map((g) => ({
          id: g.id,
          winnerName: g.winner_name,
          date: g.date,
          players: g.players,
        }))
      )
    } catch (err) {
      setHofError("Impossible de charger le Hall of Fame. Vérifie ta connexion.")
    } finally {
      setHofLoading(false)
    }
  }

  const insertGame = async (game) => {
    const { error } = await supabase.from('hall_of_fame').insert([{
      id: game.id,
      winner_name: game.winnerName,
      date: game.date,
      players: game.players,
    }])
    if (error) throw error
  }

  const startGame = (players) => {
    const playersWithColors = players.map((p, i) => ({
      ...p,
      colorIndex: i % PLAYER_COLORS.length,
    }))
    setGamePlayers(playersWithColors)
    setRounds([])
    setWinner(null)

    const existingIds = savedPlayers.map((s) => s.id)
    const newPlayers = players
      .filter((p) => !existingIds.includes(p.id))
      .map((p) => ({ id: p.id, name: p.name }))
    if (newPlayers.length > 0) {
      setSavedPlayers((prev) => [...prev, ...newPlayers])
    }
    setScreen('game')
  }

  const submitRound = async (roundScores) => {
    const newRounds = [...rounds, roundScores]
    setRounds(newRounds)

    const totals = gamePlayers.map((p) => ({
      ...p,
      total: newRounds.reduce((sum, round) => {
        const entry = round.find((r) => r.playerId === p.id)
        return sum + (entry ? entry.score : 0)
      }, 0),
    }))

    const gameOver = totals.some((p) => p.total >= WIN_SCORE)
    if (gameOver) {
      const w = totals.reduce((best, p) => (p.total > best.total ? p : best), totals[0])
      const gameRecord = {
        id: Date.now(),
        winnerName: w.name,
        date: new Date().toLocaleDateString('fr-FR'),
        players: totals
          .slice()
          .sort((a, b) => b.total - a.total)
          .map((p) => ({ name: p.name, score: p.total })),
      }
      try {
        await insertGame(gameRecord)
      } catch {
        // La partie continue même si la sauvegarde échoue
        console.error('Erreur lors de la sauvegarde de la partie')
      }
      setWinner({ ...w, totals })
      setScreen('victory')
    }
  }

  const removePlayer = (playerId) => {
    setGamePlayers((prev) => prev.filter((p) => p.id !== playerId))
  }

  const editLastRound = (newScores) => {
    setRounds((prev) => [...prev.slice(0, -1), newScores])
  }

  const deleteGame = async (gameId) => {
    setHallOfFame((prev) => prev.filter((g) => g.id !== gameId))
    const { error } = await supabase.from('hall_of_fame').delete().eq('id', gameId)
    if (error) {
      console.error('Erreur suppression:', error)
      fetchHallOfFame()
    }
  }

  const goHome = () => setScreen('home')

  const goToHallOfFame = () => {
    setScreen('hallOfFame')
    fetchHallOfFame()
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5EEFF' }}>
      {screen === 'home' && (
        <Home onPlay={() => setScreen('setup')} onHallOfFame={goToHallOfFame} />
      )}
      {screen === 'setup' && (
        <Setup savedPlayers={savedPlayers} onStart={startGame} onBack={goHome} />
      )}
      {screen === 'game' && (
        <Game players={gamePlayers} rounds={rounds} onSubmitRound={submitRound} onEditLastRound={editLastRound} onRemovePlayer={removePlayer} onBack={goHome} />
      )}
      {screen === 'victory' && (
        <Victory
          winner={winner}
          players={gamePlayers}
          rounds={rounds}
          onNewGame={() => setScreen('setup')}
          onHallOfFame={goToHallOfFame}
          onHome={goHome}
        />
      )}
      {screen === 'hallOfFame' && (
        <HallOfFame
          history={hallOfFame}
          loading={hofLoading}
          error={hofError}
          onRetry={fetchHallOfFame}
          onBack={goHome}
          onDeleteGame={deleteGame}
        />
      )}
    </div>
  )
}
