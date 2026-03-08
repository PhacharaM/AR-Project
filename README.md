# AR Hand Gesture Game 🎮🖐️

An Augmented Reality (AR) web game that uses **hand gesture recognition** to interact with 3D objects in real time.  
The application detects the user's hand through the webcam and allows interaction with a 3D environment.

Built with modern web technologies including **Next.js**, **MediaPipe**, and **Three.js**.

---

## 🚀 Features

- Real-time **hand tracking**
- Gesture-based interaction
- **3D AR environment** rendered in browser
- Works directly with a **webcam**
- Built with **React / Next.js**
- Lightweight and browser-based (no installation required)

---

## 🧠 Technologies Used

| Technology | Purpose |
|------------|--------|
| Next.js | React framework for the web app |
| TypeScript | Static typing |
| MediaPipe | Hand detection and tracking |
| Three.js | 3D rendering |
| WebRTC | Access webcam video |
| React Hooks | State and lifecycle management |

---

## 🕹️ How the Game Works

1. The browser asks permission to access the webcam.
2. MediaPipe processes the video feed and detects the user's hand.
3. Hand landmarks are analyzed to identify gestures.
4. Gestures control objects inside the **3D AR scene**.

Example interactions:

- 👌 **Pinch gesture** → Select object  
- ✊ **Fist** → Grab or attack  
- ✋ **Open hand** → Release object  

---

## 📁 Project Structure
