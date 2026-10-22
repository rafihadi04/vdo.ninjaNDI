document.addEventListener('DOMContentLoaded', () => {
  const modeSelect = document.getElementById('modeSelect');
  const streamKeyInput = document.getElementById('streamKey');
  const genKeyBtn = document.getElementById('genKeyBtn');
  const ndiSourceContainer = document.getElementById('ndiSourceContainer');
  const ndiSourceSelect = document.getElementById('ndiSourceSelect');
  const refreshNdiBtn = document.getElementById('refreshNdiBtn');
  const resSelect = document.getElementById('resSelect');
  const bufferSlider = document.getElementById('bufferSlider');
  const bufferValue = document.getElementById('bufferValue');
  const startBtn = document.getElementById('startBtn');

  // Generate random key
  genKeyBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    streamKeyInput.value = key;
  });

  // Toggle NDI Source visibility based on mode
  modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'push') {
      ndiSourceContainer.style.display = 'block';
    } else {
      ndiSourceContainer.style.display = 'none';
    }
  });

  // Update buffer label
  bufferSlider.addEventListener('input', () => {
    bufferValue.textContent = bufferSlider.value;
  });

  // Start Stream logic
  let isStreaming = false;

  startBtn.addEventListener('click', () => {
    if (isStreaming) {
      // Stop logic
      isStreaming = false;
      startBtn.textContent = 'Start Stream';
      startBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
      startBtn.classList.add('bg-green-600', 'hover:bg-green-700');
      if (window.electronAPI) window.electronAPI.stopStream();
    } else {
      // Start logic
      const key = streamKeyInput.value.trim();
      if (!key) {
        alert("Please enter a stream key.");
        return;
      }

      const config = {
        mode: modeSelect.value,
        key: key,
        resolution: resSelect.value,
        buffer: bufferSlider.value,
        ndiSource: ndiSourceSelect.value
      };

      if (window.electronAPI) {
        window.electronAPI.startStream(config);
      } else {
        console.log("Start Stream (Mock): ", config);
      }

      isStreaming = true;
      startBtn.textContent = 'Stop Stream';
      startBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
      startBtn.classList.add('bg-red-600', 'hover:bg-red-700');
    }
  });

  // NDI Source fetching
  refreshNdiBtn.addEventListener('click', async () => {
    if (window.electronAPI) {
      ndiSourceSelect.innerHTML = '<option value="">Scanning...</option>';
      try {
        const sources = await window.electronAPI.getNdiSources();
        ndiSourceSelect.innerHTML = '';
        if (sources.length === 0) {
          ndiSourceSelect.innerHTML = '<option value="">No sources found</option>';
        } else {
          sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source.name;
            option.textContent = source.name;
            ndiSourceSelect.appendChild(option);
          });
        }
      } catch (err) {
        console.error("Error fetching NDI sources:", err);
        ndiSourceSelect.innerHTML = '<option value="">Error fetching sources</option>';
      }
    } else {
      // Mock for browser testing
      ndiSourceSelect.innerHTML = '<option value="MOCK-NDI-1">Mock Source 1</option><option value="MOCK-NDI-2">Mock Source 2</option>';
    }
  });

  // Initial load
  if (window.electronAPI) refreshNdiBtn.click();
});
