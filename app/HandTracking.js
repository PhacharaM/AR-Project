"use client";

import React, { useEffect, useRef } from "react";

// load mediapipe modules at runtime; they attach globals instead of exporting


const HandTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let Hands, Camera, drawConnectors, drawLandmarks, HAND_CONNECTIONS;

    const init = async () => {
      await import("@mediapipe/hands");
      await import("@mediapipe/camera_utils");
      await import("@mediapipe/drawing_utils");

      Hands = window.Hands;
      Camera = window.Camera;
      drawConnectors = window.drawConnectors;
      drawLandmarks = window.drawLandmarks;
      HAND_CONNECTIONS = window.HAND_CONNECTIONS;

      const canvasCtx = canvasRef.current.getContext("2d");

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 4,
            });
            drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }
        canvasCtx.restore();
      });

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };

    init();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hand Detection with Mediapipe (Next.js)</h1>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
};

export default HandTracking;