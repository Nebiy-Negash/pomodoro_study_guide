// variables

const workTittle = document.getElementById('work');
const breakTittle = document.getElementById('break');

const workTime = 1;
const breakTime = 1;

let seconds = '00';

// display
window.onload = () => {
        document.getElementById('minutes').innerHTML = workTime;
        document.getElementById('seconds').innerHTML = seconds;

        workTittle.classList.add('active');
};

// start timer

function start() {
        // change the button

        document.getElementById('start').style.display = 'none';
        document.getElementById('reset').style.display = 'block';

        // change the time
        seconds = 5;

        let workMinutes = workTime - 1;
        const breakMinutes = breakTime - 1;

        breakCount = 0;

        // countdown
        const timerFunction = () => {
                // change the display
                document.getElementById('minutes').innerHTML = workMinutes;
                document.getElementById('seconds').innerHTML = seconds;

                // start
                seconds -= 1;

                if (seconds === 0) {
                        workMinutes -= 1;
                        if (workMinutes === -1) {
                                if (breakCount % 2 === 0) {
                                        // start break
                                        workMinutes = breakMinutes;
                                        breakCount++;

                                        // change the painel
                                        workTittle.classList.remove('active');
                                        breakTittle.classList.add('active');
                                } else {
                                        // continue work
                                        workMinutes = workTime;
                                        breakCount++;

                                        // change the painel
                                        breakTittle.classList.remove('active');
                                        workTittle.classList.add('active');
                                }
                        }
                        seconds = 5;
                }
        };

        // start countdown
        setInterval(timerFunction, 1000); // 1000 = 1s
}
