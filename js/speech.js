var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var numbers = ['minutes','seconds','half'];
for (let index = 0; index < 60; index++) {
    numbers.push(index.toString());
}
var grammar = '#JSGF V1.0; grammar numbers; public <number> = ' + numbers.join(' | ') + ' ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var microphone = document.querySelector('.microphone');
var svgMicrophone = '<svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.875 14.625C2.17337 14.625 2.45952 14.7435 2.67049 14.9545C2.88147 15.1655 3 15.4516 3 15.75V18C3 20.3869 3.94821 22.6761 5.63604 24.364C7.32387 26.0518 9.61305 27 12 27C14.3869 27 16.6761 26.0518 18.364 24.364C20.0518 22.6761 21 20.3869 21 18V15.75C21 15.4516 21.1185 15.1655 21.3295 14.9545C21.5405 14.7435 21.8266 14.625 22.125 14.625C22.4234 14.625 22.7095 14.7435 22.9205 14.9545C23.1315 15.1655 23.25 15.4516 23.25 15.75V18C23.25 20.7889 22.2141 23.4785 20.3433 25.5468C18.4724 27.6152 15.9 28.9149 13.125 29.1938V33.75H19.875C20.1734 33.75 20.4595 33.8685 20.6705 34.0795C20.8815 34.2905 21 34.5766 21 34.875C21 35.1734 20.8815 35.4595 20.6705 35.6705C20.4595 35.8815 20.1734 36 19.875 36H4.125C3.82663 36 3.54048 35.8815 3.32951 35.6705C3.11853 35.4595 3 35.1734 3 34.875C3 34.5766 3.11853 34.2905 3.32951 34.0795C3.54048 33.8685 3.82663 33.75 4.125 33.75H10.875V29.1938C8.10004 28.9149 5.52759 27.6152 3.65673 25.5468C1.78586 23.4785 0.749965 20.7889 0.75 18V15.75C0.75 15.4516 0.868527 15.1655 1.07951 14.9545C1.29048 14.7435 1.57663 14.625 1.875 14.625Z" fill="white"/><path d="M16.5 18C16.5 19.1935 16.0259 20.3381 15.182 21.182C14.3381 22.0259 13.1935 22.5 12 22.5C10.8065 22.5 9.66193 22.0259 8.81802 21.182C7.97411 20.3381 7.5 19.1935 7.5 18V6.75C7.5 5.55653 7.97411 4.41193 8.81802 3.56802C9.66193 2.72411 10.8065 2.25 12 2.25C13.1935 2.25 14.3381 2.72411 15.182 3.56802C16.0259 4.41193 16.5 5.55653 16.5 6.75V18ZM12 0C10.2098 0 8.4929 0.711159 7.22703 1.97703C5.96116 3.2429 5.25 4.95979 5.25 6.75V18C5.25 19.7902 5.96116 21.5071 7.22703 22.773C8.4929 24.0388 10.2098 24.75 12 24.75C13.7902 24.75 15.5071 24.0388 16.773 22.773C18.0388 21.5071 18.75 19.7902 18.75 18V6.75C18.75 4.95979 18.0388 3.2429 16.773 1.97703C15.5071 0.711159 13.7902 0 12 0V0Z" fill="white"/></svg>';

microphone.innerHTML = svgMicrophone;

microphone.onclick = function() {
    recognition.start();
    console.log('Listening...');
}

function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

recognition.onresult = function(event) {
    var number = event.results[0][0].transcript;
    console.log('Input: ' + number + '.');
    console.log('Confidence: ' + event.results[0][0].confidence);

    var stringNums = number.replaceAll('one', 1)
        .replaceAll('two', 2)
        .replaceAll('three', 3)
        .replaceAll('four', 4)
        .replaceAll('five', 5)
        .replaceAll('six', 6)
        .replaceAll('seven', 7)
        .replaceAll('eight', 8)
        .replaceAll('nine', 9)
        .replaceAll('ten', 10)
        .replaceAll('eleven', 11)
        .replaceAll('twelve', 12)
        .replaceAll('-and-a-', ' ')
        .replaceAll('1/2', 30)
        .replaceAll('half', 30);
    var numberMatches = stringNums.match(/\d+/g) || undefined;
    if (numberMatches !== undefined && numberMatches.length > 0){
        buttonStartEle.style.display = 'inline-block';
        buttonStopEle.style.display = 'none';
        if (isNumeric(number)){
            if (numberMatches[0] > 12){
                var splitMatches = numberMatches[0].split('');
                var shiftMatches = splitMatches
                    shiftMatches = shiftMatches.shift();
                setNewTime(shiftMatches, splitMatches[0]+splitMatches[1] || 0);
            } else {
                setNewTime(numberMatches[0], numberMatches[1] || 0);
            }
        } else if (number.includes('half')){
            setNewTime(numberMatches[0], 30);
        } else if (numberMatches.length === 1){
            setNewTime(parseInt(numberMatches[0] || 1), 0);
        } else {
            setNewTime(parseInt(numberMatches[0] || 1), parseInt(numberMatches[1]) || 0);
        }
    }
    var currentPhase = timerPositive ? 'pos' : 'neg';
    var renderId = currentPhase+"-"+timeString(displayMinutes);
    ioPaused = true;
    //document.getElementById("marker-id-"+renderId).scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
    ioPaused = false;
    if (number.includes('start')){
        startTimer();
    }
    if (number.includes('stop')){
        clearInterval(int);
        timerPause = true;
        if (displayMinutes === 0 && displaySeconds === 0){ return } // already at 00:00
        buttonStopEle.style.display = 'none'
        buttonStartEle.style.display = 'inline-block'
    }
}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    console.log("I didn't recognise that number.");
}

recognition.onerror = function(event) {
    console.log('Error occurred in recognition: ' + event.error);
}