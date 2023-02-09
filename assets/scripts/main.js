// * Update the timer 01
const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
  const { action } = mainButton.dataset;
  if (action === 'start') {
    startTimer();
  } else {
    stopTimer();
  }
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleModel);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  // eslint-disable-next-line no-plusplus
  if (timer.mode === 'pomodoro') timer.sessions++;

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  interval = setInterval(() => {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();
    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case 'pomodoro':
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode('longBreak');
          } else {
            switchMode('shortBreak');
          }
          break;
        default:
          switchMode('pomodoro');
      }
      if (Notification.permission === 'granted') {
        const text = timer.mode === 'pomodoro' ? 'Get back to work' : 'Take a break';
        new Notification(text);
      }
      document.querySelector(`[data-sound="${timer.mode}"]`);
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  min.textContent = minutes;
  sec.textContent = seconds;

  const text = timer.mode === 'pomodoro' ? 'Get back to work' : 'Take a break';
  document.title = `${minutes}:${seconds} - ${text}`;

  const progress = document.getElementById('js-progress');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

// ? The switchMode function adds two new properties to the timer object at the top.

function switchMode(mode) {
  // ? mode property set to the current mode from the three mode buttons(pomodoro, shortBreak,longBreak)
  timer.mode = mode;

  // ? remainingTime property set on the timer object, this is an object with three properties of its own.
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  // ! need a fix on this.
  document.querySelectorAll('button[data-mode]').forEach((e) => e.classList.remove('active'));
  document.querySelector(`[data-mode=${mode}]`).classList.add('active');
  document.getElementById('js-progress').setAttribute('max', timer.remainingTime.total);
  updateClock();
}

// ? event delegation to detect a click on any of the mode buttons.

function handleModel(event) {
  const { mode } = event.target.dataset;

  // ? switchMode function is applied here with a value of the data-mode attribute as its only argument.

  if (!mode) return;
  switchMode(mode);
  stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  // Let's check if the browser supports notifications
  if ('Notification' in window) {
    // if notification permission have never been granted or denied
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      // ask the user for permission
      Notification.requestPermission().then((permission) => {
        // if permission is granted
        if (permission === 'granted') {
          // create new notification
          new Notification('Awesome! You will be notified at the start of each session');
        }
      });
    }
  }
  switchMode('pomodoro');
});
