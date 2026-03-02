"use client"

import { useState, useEffect } from "react"
import HandTracker from "./components/HandTracker"
import ARScene from "./components/ARScene"

type Move = "rock" | "paper" | "scissors" | ""

export default function Home() {
  const [playerMove, setPlayerMove] = useState<Move>("")
  const [computerMove, setComputerMove] = useState<Move>("")
  const [result, setResult] = useState("")

  const getComputerMove = (): Move => {
    const moves: Move[] = ["rock", "paper", "scissors"]
    return moves[Math.floor(Math.random() * 3)]
  }

  const decideWinner = (player: Move, computer: Move) => {
    if (player === computer) return "Draw"

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "You Win 🎉"
    }

    return "Computer Wins 🤖"
  }

  const handleGesture = (gesture: Move) => {
    if (gesture === "unknown") return

    const computer = getComputerMove()

    setPlayerMove(gesture)
    setComputerMove(computer)
    setResult(decideWinner(gesture, computer))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">

      {/* Camera Hand Tracker */}
      <HandTracker onGesture={handleGesture} />

      {/* 3D AR Scene */}
      <ARScene gesture={playerMove} />

      {/* UI Overlay */}
      <div className="absolute top-5 left-5 text-white z-10">
        <h1 className="text-3xl font-bold mb-2">
          Rock Paper Scissors AR
        </h1>

        <p className="text-xl">Your Move: {playerMove}</p>
        <p className="text-xl">Computer: {computerMove}</p>
        <p className="text-2xl mt-2">{result}</p>

        <p className="mt-4 text-sm opacity-70">
          Show your hand to play
        </p>
      </div>
    </div>
  )
}