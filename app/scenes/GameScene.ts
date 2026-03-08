import Phaser from "phaser"

export default class GameScene extends Phaser.Scene {

  currentRound: number = 1
  maxRounds: number = 3

  playerScore: number = 0
  enemyScore: number = 0

  gameOver: boolean = false

  player!: Phaser.GameObjects.Rectangle
  enemy!: Phaser.GameObjects.Rectangle

  roundText!: Phaser.GameObjects.Text
  playerScoreText!: Phaser.GameObjects.Text
  enemyScoreText!: Phaser.GameObjects.Text
  messageText!: Phaser.GameObjects.Text

  constructor() {
    super("GameScene")
  }

  create() {

    // Reset game state
    this.currentRound = 1
    this.playerScore = 0
    this.enemyScore = 0
    this.gameOver = false

    // Player
    this.player = this.add.rectangle(200, 300, 50, 50, 0x00ff00)

    // Enemy
    this.enemy = this.add.rectangle(600, 300, 50, 50, 0xff0000)

    // UI
    this.roundText = this.add.text(20, 20, "", { fontSize: "24px", color: "#ffffff" })
    this.playerScoreText = this.add.text(20, 60, "", { fontSize: "20px", color: "#00ff00" })
    this.enemyScoreText = this.add.text(20, 90, "", { fontSize: "20px", color: "#ff0000" })

    this.messageText = this.add.text(400, 200, "", {
      fontSize: "32px",
      color: "#ffff00"
    }).setOrigin(0.5)

    this.updateUI()

    this.startRound()

    // Debug keys for testing
    this.input.keyboard!.on("keydown-Q", () => {
      this.playerWinRound()
    })

    this.input.keyboard!.on("keydown-E", () => {
      this.enemyWinRound()
    })

  }

  updateUI() {
    this.roundText.setText(`Round: ${this.currentRound} / ${this.maxRounds}`)
    this.playerScoreText.setText(`Player Score: ${this.playerScore}`)
    this.enemyScoreText.setText(`Enemy Score: ${this.enemyScore}`)
  }

  startRound() {

    this.messageText.setText(`Round ${this.currentRound}`)

    this.resetCharacters()

    this.updateUI()

    this.time.delayedCall(1000, () => {
      this.messageText.setText("")
    })
  }

  resetCharacters() {
    this.player.setPosition(200, 300)
    this.enemy.setPosition(600, 300)
  }

  playerWinRound() {

    if (this.gameOver) return

    this.playerScore++
    this.endRound("PLAYER")
  }

  enemyWinRound() {

    if (this.gameOver) return

    this.enemyScore++
    this.endRound("ENEMY")
  }

  endRound(winner: string) {

    this.messageText.setText(`${winner} WINS ROUND`)

    this.updateUI()

    if (this.currentRound >= this.maxRounds) {

      this.time.delayedCall(2000, () => {
        this.endGame()
      })

      return
    }

    this.currentRound++

    this.time.delayedCall(2000, () => {
      this.startRound()
    })
  }

  endGame() {

    this.gameOver = true

    let result = ""

    if (this.playerScore > this.enemyScore) {
      result = "PLAYER WINS THE GAME!"
    }
    else if (this.enemyScore > this.playerScore) {
      result = "ENEMY WINS THE GAME!"
    }
    else {
      result = "DRAW!"
    }

    this.messageText.setText(result)

    console.log("Game Over")
    console.log("Player:", this.playerScore)
    console.log("Enemy:", this.enemyScore)

    // Optional: go to GameOverScene
    // this.scene.start("GameOverScene", { playerScore: this.playerScore, enemyScore: this.enemyScore })

  }

}