function detectGesture(landmarks: any) {
  const isFingerUp = (tip: number, pip: number) =>
    landmarks[tip].y < landmarks[pip].y

  const indexUp = isFingerUp(8, 6)
  const middleUp = isFingerUp(12, 10)
  const ringUp = isFingerUp(16, 14)
  const pinkyUp = isFingerUp(20, 18)

  if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "rock"
  }

  if (indexUp && middleUp && ringUp && pinkyUp) {
    return "paper"
  }

  if (indexUp && middleUp && !ringUp && !pinkyUp) {
    return "scissors"
  }

  return "unknown"
}