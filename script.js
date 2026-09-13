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