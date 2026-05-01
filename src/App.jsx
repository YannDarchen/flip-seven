import { useState, useEffect } from 'react'
import Home from './components/Home'
import Setup from './components/Setup'
import Game from './components/Game'
import Victory from './components/Victory'
import HallOfFame from './components/HallOfFame'
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
  const [hallOfFame, setHallOfFame] = useState(() =>
    loadFromStorage(STORAGE_KEYS.HALL_OF_FAME, [])
  )
  const [gamePlayers, setGamePlayers] = useState([])
  const [rounds, setRounds] = useState([])
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_PLAYERS, JSON.stringify(savedPlayers))
  }, [savedPlayers])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HALL_OF_FAME, JSON.stringify(hallOfFame))
  }, [hallOfFame])

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
      .map((p) => ({ id: p.id, name: p.name, wins: 0 }))
    if (newPlayers.length > 0) {
      setSavedPlayers((prev) => [...prev, ...newPlayers])
    }
    setScreen('game')
  }

  const submitRound = (roundScores) => {
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
      setWinner({ ...w, totals })

      setSavedPlayers((prev) =>
        prev.map((p) => (p.id === w.id ? { ...p, wins: (p.wins || 0) + 1 } : p))
      )
      setHallOfFame((prev) => [
        {
          id: Date.now(),
          winnerName: w.name,
          date: new Date().toLocaleDateString('fr-FR'),
          players: totals
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((p) => ({ name: p.name, score: p.total })),
        },
        ...prev,
      ])
      setScreen('victory')
    }
  }

  const goHome = () => setScreen('home')

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5EEFF' }}>
      {screen === 'home' && (
        <Home onPlay={() => setScreen('setup')} onHallOfFame={() => setScreen('hallOfFame')} />
      )}
      {screen === 'setup' && (
        <Setup savedPlayers={savedPlayers} onStart={startGame} onBack={goHome} />
      )}
      {screen === 'game' && (
        <Game players={gamePlayers} rounds={rounds} onSubmitRound={submitRound} onBack={goHome} />
      )}
      {screen === 'victory' && (
        <Victory
          winner={winner}
          players={gamePlayers}
          rounds={rounds}
          onNewGame={() => setScreen('setup')}
          onHallOfFame={() => setScreen('hallOfFame')}
          onHome={goHome}
        />
      )}
      {screen === 'hallOfFame' && (
        <HallOfFame savedPlayers={savedPlayers} history={hallOfFame} onBack={goHome} />
      )}
    </div>
  )
}
