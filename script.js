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

const calcWindow = document.getElementById('calculator-window');
const calcLink = document.querySelector('[data-app="calculator"]');
const calcDisplay = document.getElementById('calc-display');

calcLink.addEventListener('click', () => {
  calcWindow.classList.remove('hidden');
  startMenu.classList.add('hidden');
});

calcWindow.querySelector('.close-btn').addEventListener('click', () => {
  calcWindow.classList.add('hidden');
});

document.querySelectorAll('#calc-buttons button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.id === 'calc-equals') {
      try {
        calcDisplay.value = eval(calcDisplay.value);
      } catch {
        calcDisplay.value = 'Error';
      }
    } else {
      calcDisplay.value += btn.dataset.val;
    }
  });
});

document.getElementById('calc-clear').addEventListener('click', () => {
  calcDisplay.value = '';
});

makeDraggable(calcWindow);

const filesWindow = document.getElementById('files-window');
const filesLink = document.querySelector('[data-app="files"]');
const filesList = document.getElementById('files-list');
const filesBack = document.getElementById('files-back');

const fileSystem = {
  name: 'root',
  children: [
    { name: 'Documents', children: [
      { name: 'resume.txt' },
      { name: 'notes.txt' }
    ]},
    { name: 'Pictures', children: [
      { name: 'photo1.png' },
      { name: 'photo2.png' }
    ]},
    { name: 'readme.md' }
  ]
};

let currentPath = [fileSystem];

function renderFiles() {
  const current = currentPath[currentPath.length - 1];
  filesList.innerHTML = '';
  current.children.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.children ? `📁 ${item.name}` : `📄 ${item.name}`;
    if (item.children) {
      li.addEventListener('click', () => {
        currentPath.push(item);
        renderFiles();
      });
    }
    filesList.appendChild(li);
  });
  filesBack.classList.toggle('hidden', currentPath.length === 1);
}

filesLink.addEventListener('click', () => {
  filesWindow.classList.remove('hidden');
  startMenu.classList.add('hidden');
  currentPath = [fileSystem];
  renderFiles();
});

filesWindow.querySelector('.close-btn').addEventListener('click', () => {
  filesWindow.classList.add('hidden');
});

filesBack.addEventListener('click', () => {
  currentPath.pop();
  renderFiles();
});

makeDraggable(filesWindow);