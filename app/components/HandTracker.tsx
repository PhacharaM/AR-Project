"use client"

import { useEffect, useRef } from "react"

export default function HandTracker({ onGesture }: any) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let camera: any
    let hands: any

    const loadMediaPipe = async () => {
      const { Hands } = await import("@mediapipe/hands")
      const { Camera } = await import("@mediapipe/camera_utils")

      hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      })

      hands.onResults((results: any) => {
        if (!results.multiHandLandmarks?.length) return

        const landmarks = results.multiHandLandmarks[0]
        const gesture = detectGesture(landmarks)
        onGesture(gesture)
      })

      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current! })
          },
          width: 640,
          height: 480,
        })
        camera.start()
      }
    }

    loadMediaPipe()

    return () => {
      camera?.stop()
    }
  }, [])

  return <video ref={videoRef} className="w-96 h-auto" autoPlay playsInline />
}

function detectGesture(landmarks: any) {
  const isUp = (tip: number, pip: number) =>
    landmarks[tip].y < landmarks[pip].y

  const indexUp = isUp(8, 6)
  const middleUp = isUp(12, 10)
  const ringUp = isUp(16, 14)
  const pinkyUp = isUp(20, 18)

  if (!indexUp && !middleUp && !ringUp && !pinkyUp) return "rock"
  if (indexUp && middleUp && ringUp && pinkyUp) return "paper"
  if (indexUp && middleUp && !ringUp && !pinkyUp) return "scissors"

  return "unknown"
}