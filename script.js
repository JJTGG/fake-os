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