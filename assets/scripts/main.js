// * Update the timer

const timer = {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakIntervals: 4,
};

let interval;

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleModel);

function startTimer() {
        let { total } = timer.remainingTime;
        const endTime = Date.parse(new Date()) + total * 1000;

        interval = setInterval(() => {
                timer.remainingTime = getRemainingTime(endTime);
                updateClock();

                total = timer.remainingTime.total;
                if (total <= 0) {
                        clearInterval(interval);
                }
        }, 1000);
}

function updateClock() {
        const { remainingTime } = timer;
        const minutes = `${remainingTime.minutes}`.padStart(2, '0');
        const seconds = `${remainingTime.seconds}`.padStart(2, '0');

        const min = document.getElementById('js-minutes');
        const sec = document.getElementById('js-seconds');
        min.textContent = minutes;
        sec.textContent = seconds;
}

function switchMode(mode) {
        timer.mode = mode;
        timer.remainingTime = {
                total: timer[mode] * 60,
                minutes: timer[mode],
                seconds: 0,
        };

        document.querySelectorAll('button[data-mode]').forEach((e) => e.classList.remove('active'));
        document.querySelector(`[data-mode=${mode}]`).classList.add('active');
        // document.body.style.backgroundColor = `var(--${mode})`;
        updateClock();
}

function handleModel(event) {
        const { mode } = event.target.dataset;

        if (!mode) return;
        switchMode(mode);
}
