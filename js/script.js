var containerEle = document.getElementById("container");
var timeEle = document.getElementById("time");
var timelineWrapperEle = document.getElementById("timeline-wrapper");
var timelinePositiveEle = document.getElementById("timeline-positive");
var timelineNegativeEle = document.getElementById("timeline-negative");
var progressPositiveEle = document.getElementById("progress-positive");
var progressNegativeEle = document.getElementById("progress-negative");
var buttonStartEle = document.getElementById("start");
var buttonStopEle = document.getElementById("stop");
var buttonResetEle = document.getElementById("reset");
var setTimePositive = 25;
var setTimeNegative = 5;
var displayMinutes = setTimePositive;
var displaySeconds = 0; 
var percentLeft = 100;
var timerPositive = true; // Positive/Negative
var timerPause = true; // timer display updates paused
var ioPaused = false; // IntersectionObserver updates paused
var setMarker = setTimePositive; // IntersectionObserver
var lastMarker // Prevent duplicates
var dateDefault = Date.now();
var dateStart;
var dateNow;
var int;

backgroundPhase()

buttonStartEle.onclick = function(e) {
    e.preventDefault();
    if (!timerPause){
        timerPause = true;
        return;
    }
    buttonStartEle.style.display = 'none';
    buttonStopEle.style.display = 'inline-block';
    startTimer();
};

function timeString(n){
    var newString = n < 10 ? n = `0${n}` : n = `${n}`;
    if (newString === 0 ){ newString = '00'; }
    newString = String(newString);
    return newString;
}
function switchPhase() {
    clearInterval(int);
    timerPositive = !timerPositive;
    var currentPhase = timerPositive ? 'pos' : 'neg';
    displayMinutes = parseInt(setTimeNegative);
    displaySeconds = 0;
    timerPause = true;
    setMarker = parseInt(setTimeNegative);
    buttonStartEle.style.display = 'inline-block';
    buttonStopEle.style.display = 'none';
    if (timerPositive){
        containerEle.classList.add("bg-positive")
        containerEle.classList.remove("bg-negative")
    } else {
        containerEle.classList.add("bg-negative")
        containerEle.classList.remove("bg-positive")
    }
    var renderId = currentPhase+"-"+timeString(displayMinutes);
    timeEle.innerHTML = timerPositive ? timeString(displayMinutes) + `<span class="seconds secs-pos">:00</span>` : timeString(displayMinutes) + `<span class="seconds secs-neg">:00</span>`;
    ioPaused = true;
    document.getElementById("marker-id-"+renderId).scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
    ioPaused = false;
}

// Run timer countdown
function startTimer() {
    clearInterval(int);
    timerPause = false;
    dateStart = Date.now();
    var secsTotal = (displayMinutes * 60) + displaySeconds;
    var secs,
        mins;
    
    function timer() { // 1 second loop
        if (displayMinutes === 0 && displaySeconds === 0){ switchPhase(); return }
        trackTimeline();
        dateNow = Date.now();
        var totalSecsPositive = parseInt(setTimePositive * 60);
        var totalSecsNegative = parseInt(setTimeNegative * 60);
        var secsLeftOver = secsTotal - ( (dateNow - dateStart) / 1000 | 0 );
        timerPositive ? percentLeft = secsLeftOver / totalSecsPositive * 100 : percentLeft = secsLeftOver / totalSecsNegative * 100;

        mins = (secsLeftOver / 60) | 0;
        secs = (secsLeftOver % 60) | 0;
        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;
        displayMinutes = parseInt(mins);
        displaySeconds = parseInt(secs);
        timeEle.innerHTML = timerPositive ? mins + `<span class="seconds secs-pos">:${secs}</span>` : mins + `<span class="seconds secs-neg">:${secs}</span>`;

        if (timerPositive){
            progressNegativeEle.style.display = 'none';
            progressPositiveEle.style.display = 'inline-block';
            progressPositiveEle.style.width = displayMinutes + (displaySeconds / 60) + "rem";
            //progressPositiveEle.style.width = percentLeft + "%";
        } else {
            progressPositiveEle.style.display = 'none';
            progressNegativeEle.style.display = 'inline-block';
            progressNegativeEle.style.width = displayMinutes + (displaySeconds / 60) + "rem";
            //progressNegativeEle.style.width = percentLeft + "%";
        }

        buttonStopEle.onclick = function(e) {
            e.preventDefault();
            clearInterval(int);
            timerPause = true;
            if (displayMinutes === 0 && displaySeconds === 0){ return } // already at 00:00
            buttonStopEle.style.display = 'none'
            buttonStartEle.style.display = 'inline-block'
        };
        if (secsTotal <= 0) {
            clearInterval(int);
            timerPause = true;
        }
    }
    
    if (!timerPause) {
        timer();
        int = setInterval(timer, 1000);
    }
}

// Generate timeline markers
function markerHTML(i, positive){
    var value = positive ? 'pos' : 'neg';
    if(i === 0 && !positive){
        return ''
    } else if(i % 5  === 0 ){
        if(i < 10){ i = '0' + i }
        return `
            <div class="marker-value">
                <div class="marker-label" id="marker-id-${value}-${i}" data-label="${i}">${i}</div>
                <div class="marker-tall data-marker" data-phase="${value}" data-marker="${i}" ></div>
            </div>
    `} else {
        if(i < 10){ i = '0' + i }
        return `
            <div class="marker-value">
                <div class="marker-label" id="marker-id-${value}-${i}" data-label="${i}"></div>
                <div class="marker-short data-marker" data-phase="${value}" data-marker="${i}"></div>
            </div>
    `};
}
var markerDataPos = '';
for (let i = 0; i < 100; i++) {
    markerDataPos = markerDataPos + markerHTML(i, true);
}
var markerDataNeg = '';
for (let i = 0; i < 100; i++) {
    markerDataNeg = markerDataNeg + markerHTML(i, false);
}

document.getElementById('marker-wrapper-positive').innerHTML = markerDataPos; // Render markers
document.getElementById('marker-wrapper-negative').innerHTML = markerDataNeg;

window.onload = (event) => {
    var currentPhase = timerPositive ? 'pos' : 'neg';
    var minuteString = timeString(displayMinutes);
    var secondString = timeString(displaySeconds);
    timeEle.innerHTML = `${minuteString}<span class="seconds secs-${timerPositive}">:${secondString}</span>`;
    document.getElementById("marker-id-"+currentPhase+"-"+ minuteString).scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
};

function setNewTime(m, s) {
    clearInterval(int);
    timerPause = true;
    if (setMarker !== lastMarker){
        if (displaySeconds !== 0){
            timerPositive ? setTimePositive = setMarker : setTimeNegative = setMarker;
        }
    }
    displayMinutes = parseInt(m);
    displaySeconds = parseInt(s);
    timeEle.innerHTML = `${timeString(displayMinutes)}<span class="seconds secs-${timerPositive? 'pos': 'neg'}">:${timeString(displaySeconds)}</span>`;
    if (timerPositive){
        progressNegativeEle.style.display = 'none';
        progressPositiveEle.style.display = 'inline-block';
        progressPositiveEle.style.width = displayMinutes + (displaySeconds / 60) + "rem";
        //progressPositiveEle.style.width = percentLeft + "%";
    } else {
        progressPositiveEle.style.display = 'none';
        progressNegativeEle.style.display = 'inline-block';
        progressNegativeEle.style.width = displayMinutes + (displaySeconds / 60) + "rem";
        //progressNegativeEle.style.width = percentLeft + "%";
    }
}

function backgroundPhase() {
    timerPositive ? containerEle.classList.add("bg-positive") : containerEle.classList.add("bg-negative");
    timerPositive ? containerEle.classList.remove("bg-negative") : containerEle.classList.remove("bg-positive");
}

if('IntersectionObserver' in window){
    var observer = new IntersectionObserver((changes, observer) => {
        changes.forEach(entry => {
            if (!ioPaused){
                setMarker = entry.target.dataset.marker;
                if(entry.intersectionRatio === 0 && lastMarker !== setMarker){
                    entry.target.dataset.phase === 'pos' ? timerPositive = true : timerPositive = false;
                    backgroundPhase();
                    setNewTime(setMarker, 0);
                    lastMarker = setMarker;
                    timerPause = true;
                    timerRunning = false;
                }
                buttonStartEle.style.display = 'inline-block';
                buttonStopEle.style.display = 'none';
            } else {
                buttonStartEle.style.display = 'none';
                buttonStopEle.style.display = 'inline-block';
                timerRunning = true;
                timerPause = false;
            }
        });
    }, {
        "rootMargin": "0% -50% 0% -50%",
        "threshold": 0,
    });
    const dataMarkers = document.querySelectorAll('.data-marker');
    dataMarkers.forEach(marker => observer.observe(marker));
}

var isDown = false;
var startX;
var scrollLeft;
timelineWrapperEle.addEventListener('mousedown', (e) => {
    isDown = true;
    timelineWrapperEle.classList.add('active');
    startX = e.pageX - timelineWrapperEle.offsetLeft;
    scrollLeft = timelineWrapperEle.scrollLeft;
});
timelineWrapperEle.addEventListener('mouseleave', () => {
    isDown = false;
    timelineWrapperEle.classList.remove('active');
});
timelineWrapperEle.addEventListener('mouseup', () => {
    isDown = false;
    timelineWrapperEle.classList.remove('active');
});
timelineWrapperEle.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    var x = e.pageX - timelineWrapperEle.offsetLeft;
    var walk = (x - startX) * 2; //scroll-fast
    timelineWrapperEle.scrollLeft = scrollLeft - walk;
});
