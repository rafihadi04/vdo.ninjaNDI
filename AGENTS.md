# Context & Objective
You are an expert Desktop Application Developer specializing in Electron, Node.js, WebRTC, and NDI (Network Device Interface) integrations. 
Your task is to build a standalone Electron application that acts as a dedicated VDO.Ninja client with native NDI input/output capabilities.

# Tech Stack
- Framework: Electron (Node.js backend, Chromium frontend)
- UI: HTML/CSS/JS (Vanilla or lightweight framework like Vue/React/Svelte)
- WebRTC & Streaming: VDO.Ninja (via `iframe` or direct WebRTC implementation)
- NDI Integration: Use a reliable Node.js NDI wrapper (e.g., `grandiose`, `node-ndi`, or `ndi-sdk`)
- Bundler/Builder: `electron-builder`

# Core Features & Requirements

## 1. Operating Modes
The app must support two primary modes, selectable from the UI:
- **Push Mode (Broadcast)**: Sends local NDI video/audio input to a VDO.Ninja stream.
- **View Mode (Receive)**: Receives a VDO.Ninja stream and outputs it locally as an NDI source.

## 2. Stream Key Management
- **Input Custom Key**: Text input for users to enter a specific room or stream key.
- **Generate Custom Key**: A button to automatically generate a secure, random stream key (alphanumeric).

## 3. Video Configuration
- **Resolution Selector**: Dropdown to select video resolution (e.g., 720p, 1080p, 4K). 
  - *Implementation detail*: Append VDO.Ninja URL parameters like `&quality=0` or `&res=1920,1080`.
- **Latency / Buffer Control**: A slider or numeric input to adjust stream latency (buffer).
  - *Implementation detail*: Append `&buffer=[ms]` to the VDO.Ninja URL for View mode.

## 4. NDI Routing Architecture
- **Input (Push Mode)**:
  - Discover and list available NDI sources on the local network.
  - User selects an NDI source -> App receives NDI frames -> Renders to a hidden `<canvas>` -> Captured via `canvas.captureStream()` -> Passed to VDO.Ninja iframe/WebRTC pipeline as a virtual camera/media stream.
- **Output (View Mode)**:
  - App receives WebRTC video from VDO.Ninja.
  - Video is drawn to a `<canvas>` (or extracted via `requestVideoFrameCallback`).
  - Raw frames (RGBA/YUV) are piped to the Node.js NDI sender module to broadcast locally as an NDI source.

## 5. UI/UX layout
- Clean, dark-mode native desktop interface.
- Sidebar or top navbar for settings (Mode, Key, NDI Select, Resolution, Latency).
- Main view: Video preview of what is being sent or received.

# Implementation Steps for the Agent
1. Initialize the Electron project and configure `package.json` with `electron-builder`.
2. Setup the IPC bridge (`preload.js`) for secure communication between the UI and the Node.js NDI modules.
3. Implement the NDI discovery and transmission logic in the main process.
4. Build the UI with the required controls (Mode, Key, NDI dropdown, Res, Latency).
5. Integrate VDO.Ninja using an `iframe` with dynamically constructed URLs based on user UI selections (e.g., `https://vdo.ninja/?push={KEY}&res={RES}`).
6. Bridge the NDI frame data with the WebRTC video elements.

# Constraints
- Ensure native modules (for NDI) are correctly rebuilt for Electron's ABI version using `electron-rebuild`.
- Handle graceful degradation if NDI libraries fail to load.
