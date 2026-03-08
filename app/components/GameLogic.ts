export type Move = "rock" | "paper" | "scissors"

export function getComputerMove(): Move {
  const moves: Move[] = ["rock", "paper", "scissors"]
  return moves[Math.floor(Math.random() * moves.length)]
}

export function decideWinner(player: Move, computer: Move): "player" | "computer" | "draw" {
  if (player === computer) return "draw"

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "player"
  }

  return "computer"
}