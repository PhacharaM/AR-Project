"use client"

import { useState } from "react"
import HandTracker from "./components/HandTracker"
import ARScene from "./components/ARScene"
import { getComputerMove, decideWinner, Move } from "./components/GameLogic"

export default function Home() {

  const MAX_ROUNDS = 3

  const [gameStarted, setGameStarted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const [round, setRound] = useState(1)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)

  const [playerMove, setPlayerMove] = useState<Move | null>(null)
  const [computerMove, setComputerMove] = useState<Move | null>(null)

  const [result, setResult] = useState("")
  const [gameOver, setGameOver] = useState(false)

  const [roundLocked, setRoundLocked] = useState(true)

  // START GAME
  const startGame = () => {

    setGameStarted(true)
    startCountdown()

  }

  // COUNTDOWN SYSTEM
  const startCountdown = () => {

    setCountdown(3)
    setRoundLocked(true)

    setTimeout(() => setCountdown(2), 1000)
    setTimeout(() => setCountdown(1), 2000)

    setTimeout(() => {

      setCountdown(null)
      setRoundLocked(false)

    }, 3000)

  }

  // GESTURE DETECTED
  const handleGesture = (gesture: string) => {

    if (!gameStarted) return
    if (gesture === "unknown") return
    if (roundLocked) return
    if (gameOver) return

    setRoundLocked(true)

    const player = gesture as Move
    const computer = getComputerMove()

    const winner = decideWinner(player, computer)

    setPlayerMove(player)
    setComputerMove(computer)

    if (winner === "player") {

      setResult("You Win 🎉")
      setPlayerScore(prev => prev + 1)

    }
    else if (winner === "computer") {

      setResult("Computer Wins 🤖")
      setComputerScore(prev => prev + 1)

    }
    else {

      setResult("Draw 🤝")

    }

    setTimeout(() => nextRound(), 2000)

  }

  // NEXT ROUND
  const nextRound = () => {

    if (round >= MAX_ROUNDS) {

      setGameOver(true)

      if (playerScore > computerScore)
        setResult("🏆 You Won The Game!")
      else if (computerScore > playerScore)
        setResult("💀 Computer Won The Game")
      else
        setResult("🤝 Game Draw")

      return
    }

    setRound(prev => prev + 1)

    setPlayerMove(null)
    setComputerMove(null)
    setResult("")

    startCountdown()

  }

  // RESTART GAME
  const restartGame = () => {

    setRound(1)
    setPlayerScore(0)
    setComputerScore(0)

    setPlayerMove(null)
    setComputerMove(null)

    setResult("")
    setGameOver(false)

    startCountdown()

  }

  return (

    <div className="relative w-screen h-screen bg-black">

      <HandTracker onGesture={handleGesture} />
      <ARScene gesture={playerMove || ""} />

      <div className="absolute top-5 left-5 text-white z-10 space-y-2">

        <h1 className="text-3xl font-bold">
          Rock Paper Scissors AR
        </h1>

        {!gameStarted && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-white text-black rounded"
          >
            Start Game
          </button>
        )}

        {gameStarted && (
          <>
            <p>Round: {round} / {MAX_ROUNDS}</p>

            <p>Player Score: {playerScore}</p>
            <p>Computer Score: {computerScore}</p>

            {countdown && (
              <p className="text-4xl font-bold">
                {countdown}
              </p>
            )}

            <p>Player Move: {playerMove}</p>
            <p>Computer Move: {computerMove}</p>

            <p className="text-xl">{result}</p>
          </>
        )}

        {gameOver && (
          <button
            onClick={restartGame}
            className="mt-4 px-6 py-3 bg-white text-black rounded"
          >
            Restart Game
          </button>
        )}

      </div>

    </div>
  )
}