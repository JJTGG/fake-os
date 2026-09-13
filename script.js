let use24Hour = false;
let dragEnabled = true;
let highestZ = 10;

const taskbarApps = document.getElementById('taskbar-apps');

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('toggle-dark').checked = true;
}

if (localStorage.getItem('use24Hour') === 'true') {
  use24Hour = true;
  document.getElementById('toggle-24h').checked = true;
}

if (localStorage.getItem('dragEnabled') === 'false') {
  dragEnabled = false;
  document.getElementById('toggle-drag').checked = false;
}

function bringToFront(windowEl) {
  highestZ++;
  windowEl.style.zIndex = highestZ;
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');

  if (!use24Hour) {
    hours = hours % 12 || 12;
  }
  document.getElementById('clock').textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', () => {
  startMenu.classList.toggle('hidden');
});

function makeDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function startDrag(x, y) {
    if (!dragEnabled) return;
    isDragging = true;
    const rect = windowEl.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
  }

  function moveDrag(x, y) {
  if (!isDragging) return;

  const windowWidth = windowEl.offsetWidth;
  const windowHeight = windowEl.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const taskbarHeight = 48;

  let newLeft = x - offsetX;
  let newTop = y - offsetY;

  newLeft = Math.max(-(windowWidth - 40), Math.min(newLeft, viewportWidth - 40));
  newTop = Math.max(0, Math.min(newTop, viewportHeight - taskbarHeight - 40));

  windowEl.style.left = `${newLeft}px`;
  windowEl.style.top = `${newTop}px`;
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

// Handles open/close/minimize/focus/taskbar for one app window.
// Used by all four apps, so it earns being a shared function.
function setupWindow(windowEl, appLink, appName) {
  const closeBtn = windowEl.querySelector('.close-btn');
  const minimizeBtn = windowEl.querySelector('.minimize-btn');
  let taskbarBtn = null;

  function addTaskbarBtn() {
    if (taskbarBtn) return;
    taskbarBtn = document.createElement('button');
    taskbarBtn.textContent = appName;
    taskbarBtn.classList.add('taskbar-item');
    taskbarBtn.addEventListener('click', () => {
      windowEl.classList.remove('hidden');
      bringToFront(windowEl);
      removeTaskbarBtn();
    });
    taskbarApps.appendChild(taskbarBtn);
  }

  function removeTaskbarBtn() {
    if (taskbarBtn) {
      taskbarBtn.remove();
      taskbarBtn = null;
    }
  }

  appLink.addEventListener('click', () => {
    if (windowEl.classList.contains('hidden')) {
      windowEl.classList.remove('hidden');
    }
    bringToFront(windowEl);
    removeTaskbarBtn();
    startMenu.classList.add('hidden');
  });

  windowEl.addEventListener('mousedown', () => bringToFront(windowEl));
  windowEl.addEventListener('touchstart', () => bringToFront(windowEl));

  closeBtn.addEventListener('click', () => {
    windowEl.classList.add('hidden');
    removeTaskbarBtn();
  });

  minimizeBtn.addEventListener('click', () => {
    windowEl.classList.add('hidden');
    addTaskbarBtn();
  });
}

const notesWindow = document.getElementById('notes-window');
const notesLink = document.querySelector('[data-app="notes"]');
const notesTextarea = document.getElementById('notes-textarea');

notesTextarea.value = localStorage.getItem('notes') || '';

notesTextarea.addEventListener('input', () => {
  localStorage.setItem('notes', notesTextarea.value);
});

setupWindow(notesWindow, notesLink, 'Notes');
makeDraggable(notesWindow);

const calcWindow = document.getElementById('calculator-window');
const calcLink = document.querySelector('[data-app="calculator"]');
const calcDisplay = document.getElementById('calc-display');

let calcValues = [];
let calcCurrentNumber = '';

function calculate(values) {
  // First pass: handle × and ÷ (higher precedence)
  let step1 = [values[0]];
  for (let i = 1; i < values.length; i += 2) {
    const op = values[i];
    const num = values[i + 1];
    if (op === '*' || op === '/') {
      const prev = step1.pop();
      step1.push(op === '*' ? prev * num : prev / num);
    } else {
      step1.push(op, num);
    }
  }

  // Second pass: handle + and -
  let result = step1[0];
  for (let i = 1; i < step1.length; i += 2) {
    const op = step1[i];
    const num = step1[i + 1];
    result = op === '+' ? result + num : result - num;
  }

  return result;
}

document.querySelectorAll('#calc-buttons button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.val;

    if (btn.id === 'calc-equals') {
      calcValues.push(parseFloat(calcCurrentNumber));
      try {
        const result = calculate(calcValues);
        calcDisplay.value = result;
      } catch {
        calcDisplay.value = 'Error';
      }
      calcValues = [];
      calcCurrentNumber = '';
      return;
    }

    if (['+', '-', '*', '/'].includes(val)) {
      calcValues.push(parseFloat(calcCurrentNumber), val);
      calcCurrentNumber = '';
      calcDisplay.value += val;
    } else {
      calcCurrentNumber += val;
      calcDisplay.value += val;
    }
  });
});

document.getElementById('calc-clear').addEventListener('click', () => {
  calcDisplay.value = '';
  calcValues = [];
  calcCurrentNumber = '';
});

setupWindow(calcWindow, calcLink, 'Calculator');
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
  currentPath = [fileSystem];
  renderFiles();
});

filesBack.addEventListener('click', () => {
  currentPath.pop();
  renderFiles();
});

setupWindow(filesWindow, filesLink, 'Files');
makeDraggable(filesWindow);

const settingsWindow = document.getElementById('settings-window');
const settingsLink = document.querySelector('[data-app="settings"]');

document.getElementById('toggle-dark').addEventListener('change', (e) => {
  document.body.classList.toggle('dark-mode', e.target.checked);
  localStorage.setItem('darkMode', e.target.checked);
});

document.getElementById('toggle-24h').addEventListener('change', (e) => {
  use24Hour = e.target.checked;
  localStorage.setItem('use24Hour', e.target.checked);
});

document.getElementById('toggle-drag').addEventListener('change', (e) => {
  dragEnabled = e.target.checked;
  localStorage.setItem('dragEnabled', e.target.checked);
});

setupWindow(settingsWindow, settingsLink, 'Settings');
makeDraggable(settingsWindow);