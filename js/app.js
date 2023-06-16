'use strict'

const timerEl = document.querySelector('.timer');
const clockEl = document.querySelector('.clock');
const hoursEl = document.querySelector('.hours');
const minutesEl = document.querySelector('.minutes');
const secondsEl = document.querySelector('.seconds');
const startEl = document.querySelector('.start');
const pauseEl = document.querySelector('.pause');
const resetEl = document.querySelector('.reset');
const plusEl = document.querySelector('.plus');
const minusEl = document.querySelector('.minus');

// state
let selectedDuration = 7;
let duration = 7;
let status = 'pause'; // start, hours, pause
let selectedTime = null; // hours, minutes, seconds
let beforeFinish = false;
let finish = false;
let audio = new Audio('../audio/audio.mp3')

// power on timer

timerEl.ondblclick = function(){
    setTimeout(() => {
        timerEl.classList.remove('timer-off');
    }, 500)
}

function changeTime(){
    const seconds = Math.floor(duration % 60**1 / 60**0);
    const minutes = Math.floor(duration % 60**2 / 60**1);
    const hours = Math.floor(duration % 60**3 / 60**2);
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
}

function beforeFinishHandler(){
    beforeFinish = true;
    clockEl.classList.add('alarm-effect');
    audio.play();
}

function finishHandler(){
    finish = true;
    clockEl.classList.add('alarm');
    removeBeforeFinishHandler();
}

function startHandler(){
    status = 'start'
    removeBeforeFinishHandler();
    removeFinishHandler();
    removeAllSelection();
}

function removeFinishHandler(){
    finish = false;
    clockEl.classList.remove('alarm');
}
startEl.onclick = startHandler;

function pauseHandler(){
    status = 'pause'
    removeFinishHandler();
    removeBeforeFinishHandler();
    beforeFinish = false;
}
pauseEl.onclick = pauseHandler;

function restartHandler(){
    duration = selectedDuration;
    changeTime();
    status = 'pause'
    removeBeforeFinishHandler();
    removeFinishHandler();
}

resetEl.onclick = restartHandler;

function removeBeforeFinishHandler(){
    beforeFinish = false;
    clockEl.classList.remove('alarm-effect');
    audio.pause();
}

function plusHandler(){
    if(status !== 'pause' || !selectedTime) return;
    let newDuration = duration;
    switch (selectedTime) {
        case 'hours':
            newDuration += 60**2;
            break;
        case 'minuste':
            newDuration += 60**1;
        case 'seconds':
            newDuration += 60**0;
        default:
            break;
    }
    if(newDuration < 43200){
        duration = newDuration;
        selectedDuration = newDuration;
        changeTime();
    }
}
plusEl.onclick = plusHandler;

function minusHandler(){
    if(status !== 'pause' || !selectedTime) return;
    let newDuration = duration;
    switch (selectedTime) {
        case 'hours':
            newDuration -= 60**2;
            break;
        case 'minuste':
            newDuration -= 60**1;
        case 'seconds':
            newDuration -= 60**0;
        default:
            break;
    }
    if(newDuration > 0){
        duration = newDuration;
        selectedDuration = newDuration;
        changeTime();
    }
}
minusEl.onclick = minusHandler;


const timeList = document.querySelectorAll('.time');
function selectTimeHandler(e){
    if(status !== 'pause') return;
    timeList.forEach(item => {
         this !== item && item.classList.remove('selected')
    });
    const timeType = this.getAttribute('time-type');
    if(selectedTime === timeType){
        this.classList.remove('selected');
        selectedTime = null;
    }else{
        this.classList.add('selected');
        selectedTime = timeType;
    }
}

timeList.forEach(item => item.onclick = selectTimeHandler);

function removeAllSelection(){
    timeList.forEach(item => item.classList.remove('selected'));
    selectedTime = null;
}

const interval = setInterval(() => {
    if(status === 'start' && duration !== 0){
        duration--;
        changeTime();
    }

    if(status === 'start' && duration < 5 && !beforeFinish && !finish){
        beforeFinishHandler();
    }

    if(duration < 1 && !finish){
        finishHandler();
    }
}, 1000);
