# VDO.Ninja NDI Electron App

Aplikasi desktop mandiri berbasis Electron untuk melakukan *broadcasting* (Push) dan *receiving* (View) stream VDO.Ninja yang terintegrasi secara *native* dengan protokol NDI (Network Device Interface).

## Fitur Utama
- **Mode Push & View**: Kirim sinyal NDI ke VDO.Ninja atau terima dari VDO.Ninja dan jadikan *output* NDI.
- **Manajemen Key**: Input key manual atau *generate* key acak.
- **Kontrol Resolusi**: Dukungan hingga 4K.
- **Pengaturan Latency**: Sesuaikan *buffer* secara *real-time* untuk kebutuhan *low-latency* atau stabilitas.

## Prasyarat (*Development*)
1. Node.js (v18 atau terbaru)
2. NDI Tools / NDI SDK (terinstal di OS)
3. Python & C++ Build Tools (untuk kompilasi *native module* Node-NDI)

## Cara Menjalankan Secara Lokal
```bash
npm install
npm run build-native  # Merekompilasi modul NDI untuk Electron
npm start
