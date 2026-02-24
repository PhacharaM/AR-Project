"use client";

import { useEffect, useRef } from "react";

type HandsType = any;
type CameraType = any;

export default function HandAR(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let hands: HandsType | null = null;
    let camera: CameraType | null = null;

    const init = async (): Promise<void> => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 640;
      canvas.height = 480;

      const handsModule = await import("@mediapipe/hands");
      const cameraModule = await import("@mediapipe/camera_utils");
      const drawingUtils = await import("@mediapipe/drawing_utils");

      const Hands = handsModule.Hands;
      const Camera = cameraModule.Camera;

      hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: any) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            drawingUtils.drawConnectors(
              ctx,
              landmarks,
              Hands.HAND_CONNECTIONS,
              { color: "#00FFAA", lineWidth: 4 }
            );

            drawingUtils.drawLandmarks(ctx, landmarks, {
              color: "#FF2D55",
              lineWidth: 2,
            });

            // AR point on index finger tip
            const tip = landmarks[8];
            const x = tip.x * canvas.width;
            const y = tip.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,255,255,0.8)";
            ctx.fill();
          }
        }
      });

      camera = new Camera(video, {
        onFrame: async () => {
          if (!hands) return;
          await hands.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    init();

    return () => {
      if (camera && typeof camera.stop === "function") camera.stop();
      if (hands && typeof hands.close === "function") hands.close();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 20, backgroundColor: "grey" }}>
      <h2>✋ Hand AR Test Naja (Next.js + MediaPipe + TSX)</h2>

      <div
        style={{
          position: "relative",
          width: 640,
          height: 480,
          margin: "0 auto",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
          autoPlay
          playsInline
          muted
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}