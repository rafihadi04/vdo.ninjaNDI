const { app, BrowserWindow, ipcMain, BrowserView } = require('electron');
const path = require('path');
let grandiose;
try {
  grandiose = require('grandiose');
} catch (e) {
  console.warn("Could not load grandiose, NDI functionality may be limited. Ensure native modules are built.");
}

let mainWindow;
let view;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Setup BrowserView for VDO.Ninja
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Handle resize dynamically
  mainWindow.on('resize', () => {
    if (view && mainWindow.getBrowserViews().includes(view)) {
      const b = mainWindow.getBounds();
      const sw = Math.floor(b.width / 3);
      view.setBounds({ x: sw, y: 0, width: b.width - sw, height: b.height });
    }
  });

  // Initially do not attach or display the view until Start Stream is clicked
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-ndi-sources', async () => {
  if (!grandiose) return [];
  try {
    const sources = await grandiose.find();
    return sources;
  } catch (err) {
    console.error("Error finding NDI sources", err);
    return [];
  }
});

ipcMain.on('start-stream', (event, config) => {
  if (!mainWindow || !view) return;

  // Compute Layout for BrowserView (right 2/3 of the window)
  const bounds = mainWindow.getBounds();
  const sidebarWidth = Math.floor(bounds.width / 3);

  mainWindow.setBrowserView(view);
  view.setBounds({ x: sidebarWidth, y: 0, width: bounds.width - sidebarWidth, height: bounds.height });

  // Construct URL
  let vdoUrl = `https://vdo.ninja/`;

  if (config.mode === 'push') {
    // push mode params
    vdoUrl += `?push=${config.key}`;
    const [w, h] = config.resolution.split(',');
    vdoUrl += `&res=${w},${h}`;
    // Add additional NDI logic hooks here later...
  } else if (config.mode === 'view') {
    // view mode params
    vdoUrl += `?view=${config.key}`;
    if (config.buffer && config.buffer !== '0') {
      vdoUrl += `&buffer=${config.buffer}`;
    }
  }

  vdoUrl += `&autostart`; // Helper param for vdo.ninja

  console.log("Loading VDO.Ninja URL:", vdoUrl);
  view.webContents.loadURL(vdoUrl);
});

ipcMain.on('stop-stream', (event) => {
  if (mainWindow && view) {
    mainWindow.removeBrowserView(view);
    view.webContents.loadURL('about:blank');
  }
});
