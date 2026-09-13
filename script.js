function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', () => {
  startMenu.classList.toggle('hidden');
});

const notesWindow = document.getElementById('notes-window');
const notesLink = document.querySelector('[data-app="notes"]');

notesLink.addEventListener('click', () => {
  notesWindow.classList.remove('hidden');
  startMenu.classList.add('hidden');
});

notesWindow.querySelector('.close-btn').addEventListener('click', () => {
  notesWindow.classList.add('hidden');
});

function makeDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function startDrag(x, y) {
    isDragging = true;
    const rect = windowEl.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
  }

  function moveDrag(x, y) {
    if (!isDragging) return;
    windowEl.style.left = `${x - offsetX}px`;
    windowEl.style.top = `${y - offsetY}px`;
  }

  function endDrag() {
    isDragging = false;
  }

  header.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
  document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', endDrag);

  header.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  });
  document.addEventListener('touchend', endDrag);
}

makeDraggable(notesWindow);