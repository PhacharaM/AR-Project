"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ARScene({ gesture }: { gesture: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const objectRef = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    mountRef.current?.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambient)

    const animate = () => {
      requestAnimationFrame(animate)

      if (objectRef.current && gesture === "scissors") {
        objectRef.current.rotation.z += 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      renderer.dispose()
    }
  }, [])

  // 🔥 THIS PART WAS MISSING
  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current

    // remove old object
    if (objectRef.current) {
      scene.remove(objectRef.current)
      objectRef.current = null
    }

    let object: THREE.Object3D | null = null

    if (gesture === "rock") {
      const geometry = new THREE.DodecahedronGeometry(1)
      const material = new THREE.MeshStandardMaterial({ color: 0x888888 })
      object = new THREE.Mesh(geometry, material)
    }

    if (gesture === "paper") {
      const geometry = new THREE.BoxGeometry(2, 1.5, 0.1)
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
      object = new THREE.Mesh(geometry, material)
    }

    if (gesture === "scissors") {
      const group = new THREE.Group()

      const blade1 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
      )

      const blade2 = blade1.clone()
      blade2.rotation.z = Math.PI / 2

      group.add(blade1)
      group.add(blade2)
      object = group
    }

    if (object) {
      object.position.set(0, 0, 0)
      object.scale.set(1.5, 1.5, 1.5)
      scene.add(object)
      objectRef.current = object
    }
  }, [gesture])

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  )
}